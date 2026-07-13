<?php

namespace App\Http\Controllers\Validator;

use App\Http\Controllers\Controller;
use App\Models\Aktivitas;
use App\Models\Mahasiswa;
use App\Models\PengajuanSkpi;
use App\Models\Skpi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LaporanController extends Controller
{
    public function index(Request $request): Response
    {
        $tahun = $request->input('tahun', now()->year);
        $bulan = $request->input('bulan');

        $query = Skpi::with(['pengajuanSkpi.mahasiswa.jurusan.identitasPt', 'pengambilan'])
            ->where('status', 'diterbitkan')
            ->whereYear('tgl_terbit', $tahun);

        if ($bulan) {
            $query->whereMonth('tgl_terbit', $bulan);
        }

        $pengajuanQuery = PengajuanSkpi::with(['mahasiswa.jurusan', 'periodeSkpi'])
            ->when($bulan, function ($q) use ($bulan, $tahun) {
                $q->whereMonth('tgl_pengajuan', $bulan)->whereYear('tgl_pengajuan', $tahun);
            }, function ($q) use ($tahun) {
                $q->whereYear('tgl_pengajuan', $tahun);
            })
            ->orderByDesc('tgl_pengajuan');

        return Inertia::render('validator/laporan/index', [
            'skpi' => $query->orderBy('tgl_terbit')->get(),
            'pengajuan' => $pengajuanQuery->get(),
            'filter' => ['tahun' => $tahun, 'bulan' => $bulan],
            'ringkasan' => [
                'total_mahasiswa' => Mahasiswa::count(),
                'total_aktivitas' => Aktivitas::count(),
                'total_disetujui' => Aktivitas::where('status', 'disetujui')->count(),
                'total_pengajuan_skpi' => PengajuanSkpi::count(),
                'total_diterbitkan' => Skpi::where('status', 'diterbitkan')->count(),
                'total_diambil' => Skpi::whereHas('pengambilan', fn ($q) => $q->where('status', 'sudah_diambil'))->count(),
            ],
        ]);
    }
}
