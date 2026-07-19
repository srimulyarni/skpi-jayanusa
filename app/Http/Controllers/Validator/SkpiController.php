<?php

namespace App\Http\Controllers\Validator;

use App\Http\Controllers\Controller;
use App\Models\PengajuanSkpi;
use App\Models\PeriodeSkpi;
use App\Models\Pengambilan;
use App\Models\Skpi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SkpiController extends Controller
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

        $pengajuan = PengajuanSkpi::with('mahasiswa.jurusan', 'periodeSkpi')
            ->when($search, function ($query, $search) {
                $query->where('no_registrasi', 'like', "%{$search}%")
                    ->orWhereHas('mahasiswa', function ($q) use ($search) {
                        $q->where('nama', 'like', "%{$search}%")
                            ->orWhere('nobp', 'like', "%{$search}%");
                    });
            })
            ->when($status, fn ($query, $status) => $query->where('status', $status))
            ->when($kode, fn ($query, $kode) => $query->whereHas('periodeSkpi', fn ($q) => $q->where('kode', $kode)))
            ->orderByRaw("FIELD(status, 'menunggu', 'disetujui', 'ditolak', 'dibatalkan')")
            ->orderByDesc('created_at')
            ->paginate(min((int) $request->input('per_page', 15), 100))
            ->withQueryString();

        return Inertia::render('validator/skpi/index', [
            'pengajuan' => $pengajuan,
            'filters' => ['search' => $search, 'status' => $status, 'kode' => $kode],
        ]);
    }

    public function show(PengajuanSkpi $pengajuanSkpi): Response
    {
        $pengajuanSkpi->load(['mahasiswa.jurusan', 'periodeSkpi', 'aktivitas.kategori', 'skpi.pengambilan']);

        return Inertia::render('validator/skpi/show', [
            'pengajuan' => $pengajuanSkpi,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate(['pengajuan_skpi_id' => 'required|exists:pengajuan_skpi,id']);

        $pengajuan = PengajuanSkpi::with('mahasiswa.jurusan.identitasPt')->findOrFail($request->pengajuan_skpi_id);

        if ($pengajuan->skpi()->exists()) {
            return back()->with('error', 'Pengajuan ini sudah memiliki SKPI.');
        }

        if ($pengajuan->status !== 'disetujui') {
            return back()->with('error', 'Hanya pengajuan yang disetujui yang bisa diterbitkan SKPI.');
        }

        $identitasPt = $pengajuan->mahasiswa->jurusan->identitasPt;

        $tahun = now()->format('Y');
        $bulan = now()->format('m');
        $urutan = Skpi::whereYear('created_at', $tahun)->whereMonth('created_at', $bulan)->count() + 1;
        $noSkpi = sprintf('SKPI/%s/%s/%04d/%s', $tahun, $bulan, $urutan, $identitasPt->kode_institusi);

        $skpi = Skpi::create([
            'no_skpi' => $noSkpi,
            'pengajuan_skpi_id' => $pengajuan->id,
            'identitas_pt_id' => $identitasPt->id,
            'tgl_terbit' => now()->toDateString(),
            'status' => 'diterbitkan',
        ]);

        Pengambilan::create([
            'skpi_id' => $skpi->id,
            'mahasiswa_id' => $pengajuan->mahasiswa_id,
            'tgl_pengambilan' => now()->toDateString(),
            'status' => 'belum_diambil',
        ]);

        return back()->with('success', 'SKPI berhasil diterbitkan.');
    }

    public function approve(PengajuanSkpi $pengajuanSkpi): RedirectResponse
    {
        if ($pengajuanSkpi->status !== 'menunggu') {
            return back()->with('error', 'Hanya pengajuan yang menunggu yang bisa disetujui.');
        }

        $pengajuanSkpi->update(['status' => 'disetujui', 'tgl_proses' => now()->toDateString()]);

        return back()->with('success', 'Pengajuan SKPI berhasil disetujui.');
    }

    public function reject(Request $request, PengajuanSkpi $pengajuanSkpi): RedirectResponse
    {
        $request->validate(['catatan_validator' => 'required|string|max:1000']);

        if ($pengajuanSkpi->status !== 'menunggu') {
            return back()->with('error', 'Hanya pengajuan yang menunggu yang bisa ditolak.');
        }

        $pengajuanSkpi->update([
            'status' => 'ditolak',
            'catatan_validator' => $request->catatan_validator,
            'tgl_proses' => now()->toDateString(),
        ]);

        return back()->with('success', 'Pengajuan SKPI berhasil ditolak.');
    }
}
