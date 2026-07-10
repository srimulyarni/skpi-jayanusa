<?php

namespace App\Http\Controllers\Akademis;

use App\Http\Controllers\Controller;
use App\Http\Requests\Akademis\KategoriRequest;
use App\Models\Kategori;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KategoriController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $kategori = Kategori::when($search, function ($query, $search) {
            $query->where('nama_kategori', 'like', "%{$search}%");
        })
            ->orderBy('nama_kategori')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('akademis/kategori/index', [
            'kategori' => $kategori,
            'filters' => ['search' => $search],
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
        if ($kategori->detailPengajuan()->exists()) {
            return back()->with('error', 'Kategori tidak bisa dihapus karena masih digunakan dalam pengajuan.');
        }

        $kategori->delete();

        return back()->with('success', 'Kategori berhasil dihapus.');
    }
}
