<?php

namespace App\Http\Controllers\Validator;

use App\Http\Controllers\Controller;
use App\Models\Aktivitas;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ValidasiAktivitasController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $aktivitas = Aktivitas::with(['mahasiswa.jurusan', 'kategori'])
            ->when($search, function ($query, $search) {
                $query->whereHas('mahasiswa', function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                        ->orWhere('nobp', 'like', "%{$search}%");
                })->orWhere('nama_kegiatan', 'like', "%{$search}%");
            })
            ->when($status, fn ($q) => $q->where('status', $status))
            ->orderByRaw("FIELD(status, 'menunggu', 'ditolak', 'disetujui')")
            ->orderByDesc('created_at')
            ->paginate(min((int) $request->input('per_page', 15), 100))
            ->withQueryString();

        return Inertia::render('validator/validasi-aktivitas/index', [
            'aktivitas' => $aktivitas,
            'filters' => ['search' => $search, 'status' => $status],
        ]);
    }

    public function show(Aktivitas $aktivitas): Response
    {
        $aktivitas->load('mahasiswa.jurusan', 'kategori');

        return Inertia::render('validator/validasi-aktivitas/show', [
            'aktivitas' => $aktivitas,
        ]);
    }

    public function approve(Aktivitas $aktivitas): RedirectResponse
    {
        $aktivitas->update([
            'status' => 'disetujui',
            'catatan_validator' => null,
        ]);

        return redirect()->route('validator.validasi-aktivitas.index')
            ->with('success', 'Aktivitas berhasil disetujui.');
    }

    public function reject(Request $request, Aktivitas $aktivitas): RedirectResponse
    {
        $validated = $request->validate([
            'catatan_validator' => ['required', 'string', 'max:1000'],
        ]);

        $aktivitas->update([
            'status' => 'ditolak',
            'catatan_validator' => $validated['catatan_validator'],
        ]);

        return redirect()->route('validator.validasi-aktivitas.index')
            ->with('success', 'Aktivitas berhasil ditolak.');
    }
}
