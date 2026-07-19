<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Aktivitas;
use App\Models\Mahasiswa;
use App\Models\PengajuanSkpi;
use App\Models\PeriodeSkpi;
use Inertia\Inertia;
use Inertia\Response;

class MahasiswaDashboardController extends Controller
{
    public function __invoke(): Response
    {
        $mahasiswa = Mahasiswa::where('user_id', auth()->id())->firstOrFail();

        $aktivitasStats = $this->getAktivitasStats($mahasiswa);
        $journey = $this->getJourney($mahasiswa);
        $periodeAktif = $this->getPeriodeAktif();
        $recentActivities = $this->getRecentActivities($mahasiswa);
        $suggestions = $this->getSuggestions($mahasiswa, $aktivitasStats, $journey);

        return Inertia::render('mahasiswa/dashboard', [
            'aktivitasStats' => $aktivitasStats,
            'journey' => $journey,
            'periodeAktif' => $periodeAktif,
            'recentActivities' => $recentActivities,
            'suggestions' => $suggestions,
        ]);
    }

    private function getAktivitasStats(Mahasiswa $mahasiswa): array
    {
        return [
            'total' => Aktivitas::where('mahasiswa_id', $mahasiswa->id)->count(),
            'disetujui' => Aktivitas::where('mahasiswa_id', $mahasiswa->id)->where('status', 'disetujui')->count(),
            'menunggu' => Aktivitas::where('mahasiswa_id', $mahasiswa->id)->where('status', 'menunggu')->count(),
            'ditolak' => Aktivitas::where('mahasiswa_id', $mahasiswa->id)->where('status', 'ditolak')->count(),
        ];
    }

    private function getJourney(Mahasiswa $mahasiswa): array
    {
        $isProfileLengkap = $mahasiswa->tempat_lahir
            && $mahasiswa->tanggal_lahir
            && $mahasiswa->jk
            && $mahasiswa->nohp
            && $mahasiswa->alamat;

        $kompreLulus = $mahasiswa->kompre_status === true;

        $totalAktivitas = Aktivitas::where('mahasiswa_id', $mahasiswa->id)->count();
        $disetujui = Aktivitas::where('mahasiswa_id', $mahasiswa->id)->where('status', 'disetujui')->count();

        $hasPengajuan = PengajuanSkpi::where('mahasiswa_id', $mahasiswa->id)
            ->whereIn('status', ['menunggu', 'disetujui'])
            ->exists();

        $hasSkpiTerbit = PengajuanSkpi::where('mahasiswa_id', $mahasiswa->id)
            ->where('status', 'disetujui')
            ->whereHas('skpi')
            ->exists();

        $periodeAktif = PeriodeSkpi::where('status', 'aktif')
            ->where('tgl_mulai', '<=', now())
            ->where('tgl_selesai', '>=', now())
            ->exists();

        $step1Done = $totalAktivitas > 0;
        $step2Done = $totalAktivitas > 0 && $disetujui === $totalAktivitas;
        $step3Done = $hasPengajuan;
        $step4Done = $hasSkpiTerbit;

        $currentStep = 1;
        if ($step4Done) {
            $currentStep = 4;
        } elseif ($step3Done) {
            $currentStep = 3;
        } elseif ($step1Done) {
            $currentStep = 2;
        }

        return [
            'steps' => [
                [
                    'label' => 'Input Aktivitas',
                    'description' => 'Tambahkan kegiatan dan prestasi',
                    'status' => $step1Done ? 'done' : 'current',
                    'count' => $totalAktivitas,
                    'countLabel' => 'aktivitas',
                ],
                [
                    'label' => 'Validasi',
                    'description' => 'Validator menyetujui aktivitas',
                    'status' => $step2Done ? 'done' : ($currentStep >= 2 ? 'current' : 'locked'),
                    'count' => $disetujui,
                    'countLabel' => 'dari ' . $totalAktivitas . ' disetujui',
                ],
                [
                    'label' => 'Pilih untuk SKPI',
                    'description' => 'Pilih aktivitas dan ajukan SKPI',
                    'status' => $step3Done ? 'done' : ($currentStep >= 3 && $kompreLulus && $periodeAktif ? 'current' : 'locked'),
                    'count' => $hasPengajuan ? 1 : 0,
                    'countLabel' => $hasPengajuan ? 'diajukan' : '',
                ],
                [
                    'label' => 'SKPI Terbit',
                    'description' => 'Validator menerbitkan SKPI',
                    'status' => $step4Done ? 'done' : ($currentStep >= 4 ? 'current' : 'locked'),
                    'count' => $hasSkpiTerbit ? 1 : 0,
                    'countLabel' => $hasSkpiTerbit ? 'terbit' : '',
                ],
            ],
            'currentStep' => $currentStep,
            'currentLabel' => match ($currentStep) {
                1 => 'Input Aktivitas',
                2 => 'Menunggu Validasi',
                3 => 'Pilih Aktivitas untuk SKPI',
                4 => 'SKPI Terbit',
            },
            'currentDescription' => match ($currentStep) {
                1 => 'Mulai tambahkan kegiatan dan prestasi Anda.',
                2 => $disetujui . ' dari ' . $totalAktivitas . ' aktivitas sudah disetujui validator.',
                3 => 'Pilih aktivitas yang sudah disetujui untuk diajukan ke SKPI.',
                4 => 'SKPI Anda sudah terbit. Silakan ambil di kampus.',
            },
        ];
    }

    private function getPeriodeAktif(): ?array
    {
        $periode = PeriodeSkpi::where('status', 'aktif')
            ->where('tgl_mulai', '<=', now())
            ->where('tgl_selesai', '>=', now())
            ->first();

        if (! $periode) {
            return null;
        }

        return [
            'nama' => $periode->nama,
            'kode' => $periode->kode,
            'tgl_selesai' => $periode->tgl_selesai->format('d M Y'),
            'sisa_hari' => max(0, (int) now()->diffInDays($periode->tgl_selesai, false)),
        ];
    }

    private function getRecentActivities(Mahasiswa $mahasiswa): array
    {
        return Aktivitas::where('mahasiswa_id', $mahasiswa->id)
            ->with('kategori:id,nama_kategori')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn ($a) => [
                'id' => $a->id,
                'nama_kegiatan' => $a->nama_kegiatan,
                'kategori' => $a->kategori->nama_kategori ?? '-',
                'status' => $a->status,
                'waktu' => $a->created_at->diffForHumans(),
            ])
            ->toArray();
    }

    private function getSuggestions(Mahasiswa $mahasiswa, array $stats, array $journey): array
    {
        $suggestions = [];

        if ($stats['total'] === 0) {
            $suggestions[] = [
                'text' => 'Tambahkan aktivitas pertama Anda',
                'action' => '/mahasiswa/aktivitas/create',
                'label' => 'Tambah Aktivitas',
                'type' => 'primary',
            ];
        }

        if ($stats['menunggu'] > 0) {
            $suggestions[] = [
                'text' => $stats['menunggu'] . ' aktivitas menunggu validasi validator',
                'action' => null,
                'label' => null,
                'type' => 'info',
            ];
        }

        if ($stats['ditolak'] > 0) {
            $suggestions[] = [
                'text' => $stats['ditolak'] . ' aktivitas ditolak. Periksa dan perbaiki.',
                'action' => '/mahasiswa/aktivitas',
                'label' => 'Lihat Aktivitas',
                'type' => 'warning',
            ];
        }

        if ($stats['disetujui'] > 0 && $journey['currentStep'] < 3) {
            $suggestions[] = [
                'text' => 'Aktivitas sudah disetujui. Siap untuk diajukan ke SKPI.',
                'action' => '/mahasiswa/skpi/create',
                'label' => 'Ajukan SKPI',
                'type' => 'primary',
            ];
        }

        return $suggestions;
    }
}
