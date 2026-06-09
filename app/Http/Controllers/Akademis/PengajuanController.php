<?php

namespace App\Http\Controllers\Akademis;

use App\Http\Controllers\Controller;
use App\Http\Requests\Akademis\PengajuanStatusRequest;
use App\Models\Pengajuan;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PengajuanController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('akademis/pengajuan/index', [
            'pengajuan' => Pengajuan::with(['mahasiswa.jurusan'])
                ->orderByDesc('tgl_pengajuan')
                ->get(),
        ]);
    }

    public function show(Pengajuan $pengajuan): Response
    {
        return Inertia::render('akademis/pengajuan/show', [
            'pengajuan' => $pengajuan->load([
                'mahasiswa.jurusan.identitasPt',
                'detailPengajuan.kategori',
                'detailPengajuan.buktiKegiatan',
            ]),
        ]);
    }

    public function updateStatus(PengajuanStatusRequest $request, Pengajuan $pengajuan): RedirectResponse
    {
        $pengajuan->update($request->validated());

        return back()->with('success', 'Status pengajuan berhasil diperbarui.');
    }
}
