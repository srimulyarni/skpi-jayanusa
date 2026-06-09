<?php

namespace App\Http\Controllers\Akademis;

use App\Http\Controllers\Controller;
use App\Http\Requests\Akademis\IdentitasPtRequest;
use App\Models\IdentitasPt;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class IdentitasPtController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('akademis/identitas-pt/index', [
            'identitas' => IdentitasPt::orderBy('kode_institusi')->get(),
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
        $identitasPt->delete();

        return back()->with('success', 'Identitas PT berhasil dihapus.');
    }
}
