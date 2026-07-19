<?php

namespace App\Http\Controllers\Ketua;

use App\Http\Controllers\Controller;
use App\Models\Aktivitas;
use App\Models\Mahasiswa;
use App\Models\PengajuanSkpi;
use App\Models\Pengambilan;
use App\Models\PeriodeSkpi;
use App\Models\Skpi;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class KetuaDashboardController extends Controller
{
    public function __invoke(): Response
    {
        $now = Carbon::now();

        return Inertia::render('ketua/dashboard', [
            'summary' => $this->getSummary($now),
            'periodeAktif' => $this->getPeriodeAktif(),
            'trendBulanan' => $this->getTrendBulanan(),
            'statPengajuan' => $this->getStatPengajuan(),
            'topKategori' => $this->getTopKategori(),
        ]);
    }

    private function getSummary(Carbon $now): array
    {
        return [
            'total_mahasiswa' => Mahasiswa::count(),
            'total_skpi_terbit' => Skpi::where('status', 'diterbitkan')->count(),
            'skpi_bulan_ini' => Skpi::where('status', 'diterbitkan')
                ->whereMonth('tgl_terbit', $now->month)
                ->whereYear('tgl_terbit', $now->year)
                ->count(),
            'pengajuan_menunggu' => PengajuanSkpi::where('status', 'menunggu')->count(),
            'belum_diambil' => Pengambilan::where('status', 'belum_diambil')->count(),
            'total_aktivitas' => Aktivitas::count(),
            'aktivitas_disetujui' => Aktivitas::where('status', 'disetujui')->count(),
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
            'tgl_mulai' => $periode->tgl_mulai->format('d M Y'),
            'tgl_selesai' => $periode->tgl_selesai->format('d M Y'),
            'sisa_hari' => max(0, (int) now()->diffInDays($periode->tgl_selesai, false)),
        ];
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

    private function getStatPengajuan(): array
    {
        return PengajuanSkpi::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get()
            ->map(fn ($item) => [
                'status' => $item->status,
                'total' => $item->total,
            ])
            ->toArray();
    }

    private function getTopKategori(): array
    {
        return Aktivitas::select('kategori_id', DB::raw('count(*) as total'))
            ->groupBy('kategori_id')
            ->orderByDesc('total')
            ->limit(5)
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
}
