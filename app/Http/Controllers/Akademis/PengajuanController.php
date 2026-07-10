<?php

namespace App\Http\Controllers\Akademis;

use App\Http\Controllers\Controller;
use App\Http\Requests\Akademis\PengajuanStatusRequest;
use App\Models\Jurusan;
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
        $status = $request->input('status');
        $jurusanId = $request->input('jurusan_id');
        $tglDari = $request->input('tgl_dari');
        $tglSampai = $request->input('tgl_sampai');

        $statusOrder = ['menunggu', 'diproses', 'disetujui', 'revisi', 'ditolak'];

        $pengajuan = Pengajuan::with(['mahasiswa.jurusan'])
            ->select('pengajuan.*')
            ->where('status', '!=', 'draft')
            ->when($search, function ($query, $search) {
                $query->whereHas('mahasiswa', function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                        ->orWhere('nobp', 'like', "%{$search}%");
                });
            })
            ->when($status, fn ($query) => $query->where('status', $status))
            ->when($jurusanId, fn ($query) => $query->whereHas('mahasiswa', fn ($q) => $q->where('jurusan_id', $jurusanId)))
            ->when($tglDari, fn ($query) => $query->where('tgl_pengajuan', '>=', $tglDari))
            ->when($tglSampai, fn ($query) => $query->where('tgl_pengajuan', '<=', $tglSampai))
            ->orderByRaw('FIELD(status, '.implode(',', array_map(fn ($s) => "'{$s}'", $statusOrder)).')')
            ->orderByDesc('tgl_pengajuan')
            ->paginate(15)
            ->withQueryString();

        $jurusan = Jurusan::orderBy('kode')->select('id', 'kode', 'nama', 'singkatan')->get();

        return Inertia::render('akademis/pengajuan/index', [
            'pengajuan' => $pengajuan,
            'jurusan' => $jurusan,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'jurusan_id' => $jurusanId,
                'tgl_dari' => $tglDari,
                'tgl_sampai' => $tglSampai,
            ],
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

        return redirect()->route('akademis.pengajuan.index')->with('success', 'Status pengajuan berhasil diperbarui.');
    }
}
