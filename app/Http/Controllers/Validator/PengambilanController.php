<?php

namespace App\Http\Controllers\Validator;

use App\Http\Controllers\Controller;
use App\Models\Pengambilan;
use App\Models\Skpi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengambilanController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $pengambilan = Pengambilan::with(['skpi.pengajuanSkpi.mahasiswa.jurusan', 'mahasiswa.jurusan'])
            ->when($search, function ($query, $search) {
                $query->whereHas('mahasiswa', function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                        ->orWhere('nobp', 'like', "%{$search}%");
                })->orWhereHas('skpi', function ($q) use ($search) {
                    $q->where('no_skpi', 'like', "%{$search}%");
                });
            })
            ->when($status, fn ($query, $s) => $query->where('status', $s))
            ->orderByRaw("FIELD(status, 'belum_diambil', 'sudah_diambil')")
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('validator/pengambilan/index', [
            'pengambilan' => $pengambilan,
            'filters' => ['search' => $search, 'status' => $status],
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

    public function batalkan(Skpi $skpi): RedirectResponse
    {
        if ($skpi->status === 'dibatalkan') {
            return back()->with('error', 'SKPI sudah dibatalkan.');
        }

        if ($skpi->pengambilan && $skpi->pengambilan->status === 'sudah_diambil') {
            return back()->with('error', 'SKPI yang sudah diambil tidak dapat dibatalkan.');
        }

        $skpi->update(['status' => 'dibatalkan']);

        return back()->with('success', 'SKPI berhasil dibatalkan.');
    }
}
