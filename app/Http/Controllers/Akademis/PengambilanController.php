<?php

namespace App\Http\Controllers\Akademis;

use App\Http\Controllers\Controller;
use App\Models\Pengambilan;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PengambilanController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('akademis/pengambilan/index', [
            'pengambilan' => Pengambilan::with(['skpi', 'mahasiswa.jurusan'])
                ->orderByDesc('created_at')
                ->get(),
        ]);
    }

    public function ambil(Pengambilan $pengambilan): RedirectResponse
    {
        $pengambilan->update([
            'status'     => 'sudah_diambil',
            'diambil_pada' => now(),
        ]);

        return back()->with('success', 'Status pengambilan berhasil diperbarui.');
    }
}
