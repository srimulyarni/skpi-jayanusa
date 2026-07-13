<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Aktivitas;
use App\Models\Mahasiswa;
use App\Models\PengajuanSkpi;
use App\Models\PeriodeSkpi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class MahasiswaPengajuanSkpiController extends Controller
{
    public function index(): Response
    {
        $mahasiswa = Mahasiswa::where('user_id', auth()->id())->firstOrFail();

        $pengajuan = PengajuanSkpi::where('mahasiswa_id', $mahasiswa->id)
            ->with('aktivitas.kategori', 'periodeSkpi')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('mahasiswa/skpi/index', [
            'pengajuan' => $pengajuan,
            'kompreStatus' => $mahasiswa->kompre_status === true,
            'periodeAktif' => PeriodeSkpi::where('status', 'aktif')
                ->where('tgl_mulai', '<=', now())
                ->where('tgl_selesai', '>=', now())
                ->first(),
        ]);
    }

    public function create(): Response|RedirectResponse
    {
        $mahasiswa = Mahasiswa::where('user_id', auth()->id())->firstOrFail();

        if ($mahasiswa->kompre_status !== true) {
            return redirect()->route('mahasiswa.skpi.index')
                ->with('error', 'Anda belum lulus kompre.');
        }

        $periode = PeriodeSkpi::where('status', 'aktif')
            ->where('tgl_mulai', '<=', now())
            ->where('tgl_selesai', '>=', now())
            ->first();

        if (! $periode) {
            return redirect()->route('mahasiswa.skpi.index')
                ->with('error', 'Tidak ada periode SKPI yang aktif.');
        }

        $existing = PengajuanSkpi::where('mahasiswa_id', $mahasiswa->id)
            ->whereIn('status', ['menunggu', 'disetujui'])
            ->exists();

        if ($existing) {
            return redirect()->route('mahasiswa.skpi.index')
                ->with('error', 'Anda sudah memiliki pengajuan SKPI aktif.');
        }

        $aktivitas = Aktivitas::where('mahasiswa_id', $mahasiswa->id)
            ->where('status', 'disetujui')
            ->with('kategori')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('mahasiswa/skpi/create', [
            'aktivitas' => $aktivitas,
            'periode' => $periode,
            'maxAktivitas' => $periode->max_aktivitas,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $mahasiswa = Mahasiswa::where('user_id', auth()->id())->firstOrFail();

        if ($mahasiswa->kompre_status !== true) {
            return back()->with('error', 'Anda belum lulus kompre.');
        }

        $periode = PeriodeSkpi::where('status', 'aktif')
            ->where('tgl_mulai', '<=', now())
            ->where('tgl_selesai', '>=', now())
            ->first();

        if (! $periode) {
            return back()->with('error', 'Tidak ada periode SKPI yang aktif.');
        }

        $validated = $request->validate([
            'aktivitas_ids' => ['required', 'array', 'min:1'],
            'aktivitas_ids.*' => ['exists:aktivitas,id'],
        ]);

        if ($periode->max_aktivitas && count($validated['aktivitas_ids']) > $periode->max_aktivitas) {
            return back()->with('error', 'Maksimal ' . $periode->max_aktivitas . ' aktivitas untuk periode ini.');
        }

        $validAktivitas = Aktivitas::whereIn('id', $validated['aktivitas_ids'])
            ->where('mahasiswa_id', $mahasiswa->id)
            ->where('status', 'disetujui')
            ->count();

        if ($validAktivitas !== count($validated['aktivitas_ids'])) {
            return back()->with('error', 'Beberapa aktivitas tidak valid.');
        }

        $tahun = now()->format('Y');
        $bulan = now()->format('m');
        $urutan = PengajuanSkpi::whereYear('created_at', $tahun)->whereMonth('created_at', $bulan)->count() + 1;
        $noRegistrasi = sprintf('REG/%s/%s/%04d', $tahun, $bulan, $urutan);

        DB::transaction(function () use ($mahasiswa, $periode, $validated, $noRegistrasi) {
            $pengajuan = PengajuanSkpi::create([
                'mahasiswa_id' => $mahasiswa->id,
                'periode_skpi_id' => $periode->id,
                'no_registrasi' => $noRegistrasi,
                'tgl_pengajuan' => now()->toDateString(),
                'status' => 'menunggu',
            ]);

            $pengajuan->aktivitas()->attach($validated['aktivitas_ids']);
        });

        return redirect()->route('mahasiswa.skpi.index')
            ->with('success', 'Pengajuan SKPI berhasil diajukan dengan nomor ' . $noRegistrasi);
    }

    public function show(PengajuanSkpi $pengajuanSkpi): Response
    {
        $mahasiswa = Mahasiswa::where('user_id', auth()->id())->firstOrFail();

        if ($pengajuanSkpi->mahasiswa_id !== $mahasiswa->id) {
            abort(403);
        }

        $pengajuanSkpi->load('aktivitas.kategori', 'periodeSkpi');

        return Inertia::render('mahasiswa/skpi/show', [
            'pengajuan' => $pengajuanSkpi,
        ]);
    }

    public function batalkan(PengajuanSkpi $pengajuanSkpi): RedirectResponse
    {
        $mahasiswa = Mahasiswa::where('user_id', auth()->id())->firstOrFail();

        if ($pengajuanSkpi->mahasiswa_id !== $mahasiswa->id) {
            abort(403);
        }

        if ($pengajuanSkpi->status !== 'menunggu') {
            return back()->with('error', 'Hanya pengajuan yang menunggu yang bisa dibatalkan.');
        }

        $pengajuanSkpi->update(['status' => 'dibatalkan']);

        return redirect()->route('mahasiswa.skpi.index')
            ->with('success', 'Pengajuan SKPI berhasil dibatalkan.');
    }
}
