<?php

namespace App\Http\Controllers\Akademis;

use App\Http\Controllers\Controller;
use App\Models\Pengajuan;
use App\Models\Pengambilan;
use App\Models\Skpi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SkpiController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('akademis/skpi/index', [
            'skpi' => Skpi::with(['pengajuan.mahasiswa.jurusan', 'pengambilan'])
                ->orderByDesc('created_at')
                ->get(),
            'siap_terbit' => Pengajuan::where('status', 'disetujui')
                ->whereDoesntHave('skpi')
                ->with('mahasiswa.jurusan.identitasPt')
                ->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate(['pengajuan_id' => 'required|exists:pengajuan,id']);

        $pengajuan = Pengajuan::with('mahasiswa.jurusan.identitasPt')->findOrFail($request->pengajuan_id);
        $identitasPt = $pengajuan->mahasiswa->jurusan->identitasPt;

        $tahun = now()->format('Y');
        $bulan = now()->format('m');
        $urutan = Skpi::whereYear('created_at', $tahun)->whereMonth('created_at', $bulan)->count() + 1;
        $noSkpi = sprintf('SKPI/%s/%s/%04d/%s', $tahun, $bulan, $urutan, $identitasPt->kode_institusi);

        $skpi = Skpi::create([
            'no_skpi'        => $noSkpi,
            'pengajuan_id'   => $pengajuan->id,
            'identitas_pt_id' => $identitasPt->id,
            'tgl_terbit'     => now()->toDateString(),
            'status'         => 'diterbitkan',
        ]);

        Pengambilan::create([
            'skpi_id'         => $skpi->id,
            'mahasiswa_id'    => $pengajuan->mahasiswa_id,
            'tgl_pengambilan' => now()->toDateString(),
            'status'          => 'belum_diambil',
        ]);

        return back()->with('success', 'SKPI berhasil diterbitkan.');
    }

    public function batalkan(Skpi $skpi): RedirectResponse
    {
        $skpi->update(['status' => 'dibatalkan']);

        return back()->with('success', 'SKPI berhasil dibatalkan.');
    }
}
