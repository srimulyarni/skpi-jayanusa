<?php

namespace App\Http\Controllers\Akademis;

use App\Http\Controllers\Controller;
use App\Http\Requests\Akademis\JurusanRequest;
use App\Models\IdentitasPt;
use App\Models\Jurusan;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class JurusanController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('akademis/jurusan/index', [
            'jurusan'   => Jurusan::with('identitasPt')->orderBy('kode')->get(),
            'identitas' => IdentitasPt::orderBy('kode_institusi')->select('id', 'kode_institusi', 'nama_singkat')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('akademis/jurusan/create', [
            'identitas' => IdentitasPt::orderBy('kode_institusi')->select('id', 'kode_institusi', 'nama_singkat')->get(),
        ]);
    }

    public function store(JurusanRequest $request): RedirectResponse
    {
        Jurusan::create($request->validated());

        return redirect()->route('akademis.jurusan.index')->with('success', 'Jurusan berhasil ditambahkan.');
    }

    public function edit(Jurusan $jurusan): Response
    {
        return Inertia::render('akademis/jurusan/edit', [
            'jurusan'   => $jurusan,
            'identitas' => IdentitasPt::orderBy('kode_institusi')->select('id', 'kode_institusi', 'nama_singkat')->get(),
        ]);
    }

    public function update(JurusanRequest $request, Jurusan $jurusan): RedirectResponse
    {
        $jurusan->update($request->validated());

        return redirect()->route('akademis.jurusan.index')->with('success', 'Jurusan berhasil diperbarui.');
    }

    public function destroy(Jurusan $jurusan): RedirectResponse
    {
        $jurusan->delete();

        return back()->with('success', 'Jurusan berhasil dihapus.');
    }
}
