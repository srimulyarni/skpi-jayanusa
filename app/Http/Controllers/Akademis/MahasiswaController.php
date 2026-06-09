<?php

namespace App\Http\Controllers\Akademis;

use App\Http\Controllers\Controller;
use App\Http\Requests\Akademis\MahasiswaRequest;
use App\Models\Jurusan;
use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class MahasiswaController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('akademis/mahasiswa/index', [
            'mahasiswa' => Mahasiswa::with('jurusan')->orderBy('nobp')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('akademis/mahasiswa/create', [
            'jurusan' => Jurusan::orderBy('kode')->select('id', 'kode', 'nama', 'singkatan')->get(),
        ]);
    }

    public function store(MahasiswaRequest $request): RedirectResponse
    {
        $user = User::create([
            'username' => $request->nobp,
            'password' => Hash::make($request->nobp),
            'role'     => 'mahasiswa',
        ]);

        Mahasiswa::create(array_merge($request->validated(), ['user_id' => $user->id]));

        return redirect()->route('akademis.mahasiswa.index')->with('success', 'Mahasiswa berhasil ditambahkan.');
    }

    public function edit(Mahasiswa $mahasiswa): Response
    {
        return Inertia::render('akademis/mahasiswa/edit', [
            'mahasiswa' => $mahasiswa->load('jurusan'),
            'jurusan'   => Jurusan::orderBy('kode')->select('id', 'kode', 'nama', 'singkatan')->get(),
        ]);
    }

    public function update(MahasiswaRequest $request, Mahasiswa $mahasiswa): RedirectResponse
    {
        $mahasiswa->update($request->validated());

        return redirect()->route('akademis.mahasiswa.index')->with('success', 'Data mahasiswa berhasil diperbarui.');
    }

    public function destroy(Mahasiswa $mahasiswa): RedirectResponse
    {
        $mahasiswa->user()->delete();

        return back()->with('success', 'Mahasiswa berhasil dihapus.');
    }
}
