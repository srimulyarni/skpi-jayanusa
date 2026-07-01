<?php

namespace App\Http\Controllers\Akademis;

use App\Http\Controllers\Controller;
use App\Models\Pengambilan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengambilanController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $pengambilan = Pengambilan::with(['skpi', 'mahasiswa.jurusan'])
            ->when($search, function ($query, $search) {
                $query->whereHas('mahasiswa', function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                        ->orWhere('nobp', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('akademis/pengambilan/index', [
            'pengambilan' => $pengambilan,
            'filters' => ['search' => $search],
        ]);
    }

    public function ambil(Pengambilan $pengambilan): RedirectResponse
    {
        $pengambilan->update([
            'status' => 'sudah_diambil',
            'diambil_pada' => now(),
        ]);

        return back()->with('success', 'Status pengambilan berhasil diperbarui.');
    }
}
