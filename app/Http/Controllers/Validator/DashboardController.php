<?php

namespace App\Http\Controllers\Validator;

use App\Http\Controllers\Controller;
use App\Models\Aktivitas;
use App\Models\PengajuanSkpi;
use App\Models\Pengambilan;
use App\Models\PeriodeSkpi;
use App\Models\Skpi;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $now = Carbon::now();

        $kpi = $this->getKpi($now);
        $periodeAktif = $this->getPeriodeAktif();
        $recentActivities = $this->getRecentActivities();
        $statKategori = $this->getStatKategori();
        $statStatus = $this->getStatStatus();
        $trendBulanan = $this->getTrendBulanan();

        return Inertia::render('validator/dashboard', [
            'kpi' => $kpi,
            'periodeAktif' => $periodeAktif,
            'recentActivities' => $recentActivities,
            'statKategori' => $statKategori,
            'statStatus' => $statStatus,
            'trendBulanan' => $trendBulanan,
        ]);
    }

    private function getKpi(Carbon $now): array
    {
        return [
            'aktivitas_menunggu' => Aktivitas::where('status', 'menunggu')->count(),
            'pengajuan_menunggu' => PengajuanSkpi::where('status', 'menunggu')->count(),
            'skpi_terbit_bulan_ini' => Skpi::where('status', 'diterbitkan')
                ->whereMonth('tgl_terbit', $now->month)
                ->whereYear('tgl_terbit', $now->year)
                ->count(),
            'belum_diambil' => Pengambilan::where('status', 'belum_diambil')->count(),
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

        $sisaHari = Carbon::now()->diffInDays($periode->tgl_selesai, false);

        return [
            'id' => $periode->id,
            'nama' => $periode->nama,
            'kode' => $periode->kode,
            'tgl_mulai' => $periode->tgl_mulai->format('d M Y'),
            'tgl_selesai' => $periode->tgl_selesai->format('d M Y'),
            'sisa_hari' => max(0, (int) $sisaHari),
            'max_aktivitas' => $periode->max_aktivitas,
        ];
    }

    private function getRecentActivities(): array
    {
        $pengajuan = PengajuanSkpi::with('mahasiswa')
            ->latest()
            ->limit(5)
            ->get()
            ->filter(fn ($p) => $p->mahasiswa)
            ->map(fn ($p) => [
                'waktu' => $p->created_at->format('H:i'),
                'tanggal' => $p->created_at->format('d M'),
                'nama' => $p->mahasiswa->nama,
                'aksi' => 'mengajukan SKPI',
                'tipe' => 'pengajuan',
            ]);

        $aktivitas = Aktivitas::with('mahasiswa')
            ->where('status', '!=', 'menunggu')
            ->latest('updated_at')
            ->limit(5)
            ->get()
            ->filter(fn ($a) => $a->mahasiswa)
            ->map(fn ($a) => [
                'waktu' => $a->updated_at->format('H:i'),
                'tanggal' => $a->updated_at->format('d M'),
                'nama' => $a->mahasiswa->nama,
                'aksi' => $a->status === 'disetujui' ? 'aktivitas disetujui' : 'aktivitas ditolak',
                'tipe' => $a->status,
            ]);

        $skpi = Skpi::with('pengajuanSkpi.mahasiswa')
            ->where('status', 'diterbitkan')
            ->latest()
            ->limit(5)
            ->get()
            ->filter(fn ($s) => $s->pengajuanSkpi && $s->pengajuanSkpi->mahasiswa)
            ->map(fn ($s) => [
                'waktu' => $s->created_at->format('H:i'),
                'tanggal' => $s->created_at->format('d M'),
                'nama' => $s->pengajuanSkpi->mahasiswa->nama,
                'aksi' => 'SKPI diterbitkan',
                'tipe' => 'skpi',
            ]);

        return $pengajuan->merge($aktivitas)->merge($skpi)
            ->sortByDesc(fn ($item) => $item['tanggal'] . ' ' . $item['waktu'])
            ->take(10)
            ->values()
            ->toArray();
    }

    private function getStatKategori(): array
    {
        return Aktivitas::select('kategori_id', DB::raw('count(*) as total'))
            ->groupBy('kategori_id')
            ->get()
            ->map(function ($item) {
                $kategori = \App\Models\Kategori::find($item->kategori_id);

                return [
                    'nama' => $kategori->nama_kategori ?? '-',
                    'total' => $item->total,
                ];
            })
            ->toArray();
    }

    private function getStatStatus(): array
    {
        return Aktivitas::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get()
            ->map(fn ($item) => [
                'status' => $item->status,
                'total' => $item->total,
            ])
            ->toArray();
    }

    private function getTrendBulanan(): array
    {
        $months = collect();
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $months->push([
                'bulan' => $date->format('M Y'),
                'tahun' => $date->year,
                'bulan_num' => $date->month,
            ]);
        }

        return $months->map(function ($m) {
            $pengajuan = PengajuanSkpi::whereYear('created_at', $m['tahun'])
                ->whereMonth('created_at', $m['bulan_num'])
                ->count();

            $terbit = Skpi::where('status', 'diterbitkan')
                ->whereYear('tgl_terbit', $m['tahun'])
                ->whereMonth('tgl_terbit', $m['bulan_num'])
                ->count();

            return [
                'bulan' => $m['bulan'],
                'pengajuan' => $pengajuan,
                'terbit' => $terbit,
            ];
        })->toArray();
    }
}
