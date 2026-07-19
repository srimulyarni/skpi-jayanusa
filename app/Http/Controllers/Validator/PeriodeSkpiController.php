<?php

namespace App\Http\Controllers\Validator;

use App\Http\Controllers\Controller;
use App\Models\PeriodeSkpi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PeriodeSkpiController extends Controller
{
    public function index(): Response
    {
        $periode = PeriodeSkpi::orderByDesc('created_at')->get();

        return Inertia::render('validator/periode-skpi/index', [
            'periode' => $periode,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('validator/periode-skpi/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'kode' => ['nullable', 'string', 'max:10'],
            'tgl_mulai' => ['required', 'date'],
            'tgl_selesai' => ['required', 'date', 'after:tgl_mulai'],
            'max_aktivitas' => ['nullable', 'integer', 'min:1'],
        ]);

        if (empty($validated['kode'])) {
            $tglMulai = \Carbon\Carbon::parse($validated['tgl_mulai']);
            $semester = $tglMulai->month <= 6 ? 1 : 2;
            $validated['kode'] = $tglMulai->year . $semester;
        }

        $validated['status'] = 'aktif';

        PeriodeSkpi::where('status', 'aktif')->update(['status' => 'nonaktif']);
        PeriodeSkpi::create($validated);

        return redirect()->route('validator.periode-skpi.index')
            ->with('success', 'Periode SKPI berhasil ditambahkan. Periode lain dinonaktifkan.');
    }

    public function edit(PeriodeSkpi $periodeSkpi): Response
    {
        return Inertia::render('validator/periode-skpi/edit', [
            'periode' => $periodeSkpi,
        ]);
    }

    public function update(Request $request, PeriodeSkpi $periodeSkpi): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'kode' => ['nullable', 'string', 'max:10'],
            'tgl_mulai' => ['required', 'date'],
            'tgl_selesai' => ['required', 'date', 'after:tgl_mulai'],
            'max_aktivitas' => ['nullable', 'integer', 'min:1'],
            'status' => ['required', 'in:aktif,nonaktif'],
        ]);

        if (empty($validated['kode'])) {
            $tglMulai = \Carbon\Carbon::parse($validated['tgl_mulai']);
            $semester = $tglMulai->month <= 6 ? 1 : 2;
            $validated['kode'] = $tglMulai->year . $semester;
        }

        if ($validated['status'] === 'aktif') {
            PeriodeSkpi::where('id', '!=', $periodeSkpi->id)
                ->where('status', 'aktif')
                ->update(['status' => 'nonaktif']);
        }

        $periodeSkpi->update($validated);

        return redirect()->route('validator.periode-skpi.index')
            ->with('success', 'Periode SKPI berhasil diperbarui.');
    }

    public function destroy(PeriodeSkpi $periodeSkpi): RedirectResponse
    {
        $periodeSkpi->delete();

        return redirect()->route('validator.periode-skpi.index')
            ->with('success', 'Periode SKPI berhasil dihapus.');
    }
}
