<?php

namespace App\Http\Controllers\Akademis;

use App\Http\Controllers\Controller;
use App\Http\Requests\Akademis\UpdateMahasiswaRequest;
use App\Models\Jurusan;
use App\Models\Mahasiswa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MahasiswaController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $jurusanId = $request->input('jurusan_id');
        $tahunMasuk = $request->input('tahun_masuk');

        $mahasiswa = Mahasiswa::with('jurusan')
            ->withCount(['pengajuan', 'pengambilan'])
            ->when($search, function ($query, $search) {
                $query->where('nama', 'like', "%{$search}%")
                    ->orWhere('nobp', 'like', "%{$search}%");
            })
            ->when($jurusanId, function ($query, $jurusanId) {
                $query->where('jurusan_id', $jurusanId);
            })
            ->when($tahunMasuk, function ($query, $tahunMasuk) {
                $query->where('tahun_masuk', $tahunMasuk);
            })
            ->orderBy('nobp')
            ->paginate(10)
            ->withQueryString();

        $jurusan = Jurusan::orderBy('kode')->select('id', 'kode', 'nama', 'singkatan')->get();
        $tahunList = Mahasiswa::whereNotNull('tahun_masuk')->distinct()->orderByDesc('tahun_masuk')->pluck('tahun_masuk');

        return Inertia::render('akademis/mahasiswa/index', [
            'mahasiswa' => $mahasiswa,
            'jurusan' => $jurusan,
            'tahunList' => $tahunList,
            'filters' => [
                'search' => $search,
                'jurusan_id' => $jurusanId,
                'tahun_masuk' => $tahunMasuk,
            ],
        ]);
    }

    public function edit(Mahasiswa $mahasiswa): Response
    {
        return Inertia::render('akademis/mahasiswa/edit', [
            'mahasiswa' => $mahasiswa->load('jurusan.identitasPt'),
            'jurusan' => Jurusan::orderBy('kode')->select('id', 'kode', 'nama', 'singkatan')->get(),
        ]);
    }

    public function update(UpdateMahasiswaRequest $request, Mahasiswa $mahasiswa): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('foto')) {
            if ($mahasiswa->foto) {
                Storage::disk('public')->delete($mahasiswa->foto);
            }
            $data['foto'] = $request->file('foto')->store('mahasiswa/foto', 'public');
        }

        $mahasiswa->update($data);

        return redirect()->route('akademis.mahasiswa.index')->with('success', 'Data mahasiswa berhasil diperbarui.');
    }

    public function destroy(Mahasiswa $mahasiswa): RedirectResponse
    {
        if ($mahasiswa->pengajuan()->exists()) {
            return back()->with('error', 'Mahasiswa tidak bisa dihapus karena masih memiliki data pengajuan.');
        }

        if ($mahasiswa->foto) {
            Storage::disk('public')->delete($mahasiswa->foto);
        }

        $mahasiswa->user()->delete();

        return back()->with('success', 'Mahasiswa berhasil dihapus.');
    }
}
