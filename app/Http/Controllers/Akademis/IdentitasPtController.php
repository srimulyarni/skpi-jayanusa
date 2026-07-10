<?php

namespace App\Http\Controllers\Akademis;

use App\Http\Controllers\Controller;
use App\Http\Requests\Akademis\IdentitasPtRequest;
use App\Models\IdentitasPt;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IdentitasPtController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $kodeInstitusi = $request->input('kode_institusi');

        $identitas = IdentitasPt::when($search, function ($query, $search) {
            $query->where('nama_pt', 'like', "%{$search}%")
                ->orWhere('kode_institusi', 'like', "%{$search}%");
        })
            ->when($kodeInstitusi, function ($query, $kodeInstitusi) {
                $query->where('kode_institusi', $kodeInstitusi);
            })
            ->orderBy('kode_institusi')
            ->paginate(10)
            ->withQueryString();

        $instansiList = IdentitasPt::distinct()->pluck('kode_institusi');

        return Inertia::render('akademis/identitas-pt/index', [
            'identitas' => $identitas,
            'instansiList' => $instansiList,
            'filters' => [
                'search' => $search,
                'kode_institusi' => $kodeInstitusi,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('akademis/identitas-pt/create');
    }

    public function store(IdentitasPtRequest $request): RedirectResponse
    {
        IdentitasPt::create($request->validated());

        return redirect()->route('akademis.identitas-pt.index')->with('success', 'Identitas PT berhasil ditambahkan.');
    }

    public function edit(IdentitasPt $identitasPt): Response
    {
        return Inertia::render('akademis/identitas-pt/edit', [
            'identitas' => $identitasPt,
        ]);
    }

    public function update(IdentitasPtRequest $request, IdentitasPt $identitasPt): RedirectResponse
    {
        $identitasPt->update($request->validated());

        return redirect()->route('akademis.identitas-pt.index')->with('success', 'Identitas PT berhasil diperbarui.');
    }

    public function destroy(IdentitasPt $identitasPt): RedirectResponse
    {
        if ($identitasPt->jurusan()->exists()) {
            return back()->with('error', 'Identitas PT tidak bisa dihapus karena masih memiliki data jurusan.');
        }

        $identitasPt->delete();

        return back()->with('success', 'Identitas PT berhasil dihapus.');
    }
}
