<?php

namespace App\Http\Controllers\Validator;

use App\Http\Controllers\Controller;
use App\Models\Pengambilan;
use App\Models\PeriodeSkpi;
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
        $kode = $request->input('kode');

        if (! $kode) {
            $aktif = PeriodeSkpi::where('status', 'aktif')
                ->where('tgl_mulai', '<=', now())
                ->where('tgl_selesai', '>=', now())
                ->first();
            $kode = $aktif?->kode;
        }

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
            ->when($kode, fn ($query, $kode) => $query->whereHas('skpi.pengajuanSkpi.periodeSkpi', fn ($q) => $q->where('kode', $kode)))
            ->orderByRaw("FIELD(status, 'belum_diambil', 'sudah_diambil')")
            ->orderByDesc('created_at')
            ->paginate(min((int) $request->input('per_page', 15), 100))
            ->withQueryString();

        return Inertia::render('validator/pengambilan/index', [
            'pengambilan' => $pengambilan,
            'filters' => ['search' => $search, 'status' => $status, 'kode' => $kode],
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
