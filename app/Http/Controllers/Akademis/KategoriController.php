<?php

namespace App\Http\Controllers\Akademis;

use App\Http\Controllers\Controller;
use App\Http\Requests\Akademis\KategoriRequest;
use App\Models\Kategori;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class KategoriController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('akademis/kategori/index', [
            'kategori' => Kategori::orderBy('nama_kategori')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('akademis/kategori/create');
    }

    public function store(KategoriRequest $request): RedirectResponse
    {
        Kategori::create($request->validated());

        return redirect()->route('akademis.kategori.index')->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function edit(Kategori $kategori): Response
    {
        return Inertia::render('akademis/kategori/edit', ['kategori' => $kategori]);
    }

    public function update(KategoriRequest $request, Kategori $kategori): RedirectResponse
    {
        $kategori->update($request->validated());

        return redirect()->route('akademis.kategori.index')->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy(Kategori $kategori): RedirectResponse
    {
        $kategori->delete();

        return back()->with('success', 'Kategori berhasil dihapus.');
    }
}
