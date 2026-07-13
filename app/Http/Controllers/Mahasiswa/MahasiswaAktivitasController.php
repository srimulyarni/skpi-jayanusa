<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Aktivitas;
use App\Models\Kategori;
use App\Models\Mahasiswa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MahasiswaAktivitasController extends Controller
{
    public function index(): Response
    {
        $mahasiswa = Mahasiswa::where('user_id', auth()->id())->firstOrFail();

        $aktivitas = Aktivitas::where('mahasiswa_id', $mahasiswa->id)
            ->with('kategori')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('mahasiswa/aktivitas/index', [
            'aktivitas' => $aktivitas,
        ]);
    }

    public function create(): Response
    {
        $kategori = Kategori::where('status', 'aktif')->orderBy('nama_kategori')->get();

        return Inertia::render('mahasiswa/aktivitas/create', [
            'kategori' => $kategori,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $mahasiswa = Mahasiswa::where('user_id', auth()->id())->firstOrFail();

        $validated = $request->validate([
            'kategori_id' => ['required', 'exists:kategori,id'],
            'nama_kegiatan' => ['required', 'string', 'max:255'],
            'tahun_kegiatan' => ['required', 'digits:4'],
            'peran' => ['required', 'string', 'max:100'],
            'bukti_link' => ['nullable', 'url', 'max:500'],
            'juara' => ['nullable', 'string', 'max:50'],
            'tingkat' => ['nullable', 'in:universitas,wilayah,nasional,internasional'],
        ]);

        Aktivitas::create([
            'mahasiswa_id' => $mahasiswa->id,
            ...$validated,
            'status' => 'menunggu',
        ]);

        return redirect()->route('mahasiswa.aktivitas.index')
            ->with('success', 'Aktivitas berhasil diajukan ke validator.');
    }

    public function show(Aktivitas $aktivitas): Response
    {
        $mahasiswa = Mahasiswa::where('user_id', auth()->id())->firstOrFail();

        if ($aktivitas->mahasiswa_id !== $mahasiswa->id) {
            abort(403);
        }

        $aktivitas->load('kategori');

        return Inertia::render('mahasiswa/aktivitas/show', [
            'aktivitas' => $aktivitas,
        ]);
    }

    public function edit(Aktivitas $aktivitas): Response|RedirectResponse
    {
        $mahasiswa = Mahasiswa::where('user_id', auth()->id())->firstOrFail();

        if ($aktivitas->mahasiswa_id !== $mahasiswa->id) {
            abort(403);
        }

        if ($aktivitas->status === 'disetujui') {
            return redirect()->route('mahasiswa.aktivitas.index')
                ->with('error', 'Aktivitas yang sudah disetujui tidak dapat diedit.');
        }

        $kategori = Kategori::where('status', 'aktif')->orderBy('nama_kategori')->get();

        return Inertia::render('mahasiswa/aktivitas/edit', [
            'aktivitas' => $aktivitas->load('kategori'),
            'kategori' => $kategori,
        ]);
    }

    public function update(Request $request, Aktivitas $aktivitas): RedirectResponse
    {
        $mahasiswa = Mahasiswa::where('user_id', auth()->id())->firstOrFail();

        if ($aktivitas->mahasiswa_id !== $mahasiswa->id) {
            abort(403);
        }

        if ($aktivitas->status === 'disetujui') {
            return back()->with('error', 'Aktivitas yang sudah disetujui tidak dapat diedit.');
        }

        $validated = $request->validate([
            'kategori_id' => ['required', 'exists:kategori,id'],
            'nama_kegiatan' => ['required', 'string', 'max:255'],
            'tahun_kegiatan' => ['required', 'digits:4'],
            'peran' => ['required', 'string', 'max:100'],
            'bukti_link' => ['nullable', 'url', 'max:500'],
            'juara' => ['nullable', 'string', 'max:50'],
            'tingkat' => ['nullable', 'in:universitas,wilayah,nasional,internasional'],
        ]);

        $aktivitas->update([
            ...$validated,
            'status' => 'menunggu',
            'catatan_validator' => null,
        ]);

        return redirect()->route('mahasiswa.aktivitas.index')
            ->with('success', 'Aktivitas berhasil diperbarui dan diajukan ulang ke validator.');
    }

    public function destroy(Aktivitas $aktivitas): RedirectResponse
    {
        $mahasiswa = Mahasiswa::where('user_id', auth()->id())->firstOrFail();

        if ($aktivitas->mahasiswa_id !== $mahasiswa->id) {
            abort(403);
        }

        if ($aktivitas->status === 'disetujui') {
            return back()->with('error', 'Aktivitas yang sudah disetujui tidak dapat dihapus.');
        }

        $aktivitas->delete();

        return redirect()->route('mahasiswa.aktivitas.index')
            ->with('success', 'Aktivitas berhasil dihapus.');
    }
}
