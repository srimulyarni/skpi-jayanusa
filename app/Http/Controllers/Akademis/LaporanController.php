<?php

namespace App\Http\Controllers\Akademis;

use App\Http\Controllers\Controller;
use App\Models\Mahasiswa;
use App\Models\Pengajuan;
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

        $query = Skpi::with(['pengajuan.mahasiswa.jurusan.identitasPt', 'pengambilan'])
            ->where('status', 'diterbitkan')
            ->whereYear('tgl_terbit', $tahun);

        if ($bulan) {
            $query->whereMonth('tgl_terbit', $bulan);
        }

        return Inertia::render('akademis/laporan/index', [
            'skpi'    => $query->orderBy('tgl_terbit')->get(),
            'filter'  => ['tahun' => $tahun, 'bulan' => $bulan],
            'ringkasan' => [
                'total_mahasiswa'    => Mahasiswa::count(),
                'total_pengajuan'    => Pengajuan::count(),
                'total_disetujui'    => Pengajuan::where('status', 'disetujui')->count(),
                'total_diterbitkan'  => Skpi::where('status', 'diterbitkan')->count(),
                'total_diambil'      => Skpi::whereHas('pengambilan', fn($q) => $q->where('status', 'sudah_diambil'))->count(),
            ],
        ]);
    }
}
