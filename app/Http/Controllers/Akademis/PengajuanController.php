<?php

namespace App\Http\Controllers\Akademis;

use App\Http\Controllers\Controller;
use App\Http\Requests\Akademis\PengajuanStatusRequest;
use App\Models\Pengajuan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengajuanController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $pengajuan = Pengajuan::with(['mahasiswa.jurusan'])
            ->when($search, function ($query, $search) {
                $query->whereHas('mahasiswa', function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                        ->orWhere('nobp', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('tgl_pengajuan')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('akademis/pengajuan/index', [
            'pengajuan' => $pengajuan,
            'filters' => ['search' => $search],
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
