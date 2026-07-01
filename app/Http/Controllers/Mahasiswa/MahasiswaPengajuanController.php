<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\DetailPengajuan;
use App\Models\Kategori;
use App\Models\Mahasiswa;
use App\Models\Pengajuan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MahasiswaPengajuanController extends Controller
{
    public function index(): Response
    {
        $mahasiswa = Mahasiswa::where('user_id', auth()->id())->firstOrFail();

        $pengajuan = Pengajuan::where('mahasiswa_id', $mahasiswa->id)
            ->with('detailPengajuan.kategori')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('mahasiswa/pengajuan/index', [
            'pengajuan' => $pengajuan,
        ]);
    }

    public function create(): Response
    {
        $mahasiswa = Mahasiswa::where('user_id', auth()->id())->firstOrFail();

        $activePengajuan = Pengajuan::where('mahasiswa_id', $mahasiswa->id)
            ->whereIn('status', ['menunggu', 'diproses'])
            ->exists();

        if ($activePengajuan) {
            return redirect()->route('mahasiswa.pengajuan.index')
                ->with('error', 'Anda masih memiliki pengajuan yang sedang diproses.');
        }

        return Inertia::render('mahasiswa/pengajuan/create', [
            'kategori' => Kategori::where('status', 'aktif')->orderBy('nama_kategori')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $mahasiswa = Mahasiswa::where('user_id', auth()->id())->firstOrFail();

        $activePengajuan = Pengajuan::where('mahasiswa_id', $mahasiswa->id)
            ->whereIn('status', ['menunggu', 'diproses'])
            ->exists();

        if ($activePengajuan) {
            return back()->with('error', 'Anda masih memiliki pengajuan yang sedang diproses.');
        }

        $validated = $request->validate([
            'kegiatan' => ['required', 'array', 'min:1'],
            'kegiatan.*.kategori_id' => ['required', 'exists:kategori,id'],
            'kegiatan.*.nama_kegiatan' => ['required', 'string', 'max:255'],
            'kegiatan.*.tahun_kegiatan' => ['required', 'digits:4'],
            'kegiatan.*.peran' => ['required', 'string', 'max:100'],
            'kegiatan.*.bukti' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ]);

        $tahun = now()->format('Y');
        $bulan = now()->format('m');
        $urutan = Pengajuan::whereYear('created_at', $tahun)->whereMonth('created_at', $bulan)->count() + 1;
        $noRegistrasi = sprintf('REG/%s/%s/%04d', $tahun, $bulan, $urutan);

        DB::transaction(function () use ($validated, $mahasiswa, $noRegistrasi) {
            $pengajuan = Pengajuan::create([
                'mahasiswa_id' => $mahasiswa->id,
                'no_registrasi' => $noRegistrasi,
                'tgl_pengajuan' => now()->toDateString(),
                'status' => 'menunggu',
            ]);

            foreach ($validated['kegiatan'] as $item) {
                $detail = DetailPengajuan::create([
                    'pengajuan_id' => $pengajuan->id,
                    'kategori_id' => $item['kategori_id'],
                    'nama_kegiatan' => $item['nama_kegiatan'],
                    'tahun_kegiatan' => $item['tahun_kegiatan'],
                    'peran' => $item['peran'],
                ]);

                if (isset($item['bukti']) && $item['bukti']) {
                    $file = $item['bukti'];
                    $path = $file->store('bukti-kegiatan', 'public');

                    $detail->buktiKegiatan()->create([
                        'nama_file' => $file->getClientOriginalName(),
                        'path_file' => $path,
                    ]);
                }
            }
        });

        return redirect()->route('mahasiswa.pengajuan.index')
            ->with('success', 'Pengajuan SKPI berhasil dikirim.');
    }

    public function show(Pengajuan $pengajuan): Response
    {
        $mahasiswa = Mahasiswa::where('user_id', auth()->id())->firstOrFail();

        if ($pengajuan->mahasiswa_id !== $mahasiswa->id) {
            abort(403);
        }

        $pengajuan->load('detailPengajuan.kategori', 'detailPengajuan.buktiKegiatan');

        return Inertia::render('mahasiswa/pengajuan/show', [
            'pengajuan' => $pengajuan,
        ]);
    }

    public function edit(Pengajuan $pengajuan): Response
    {
        $mahasiswa = Mahasiswa::where('user_id', auth()->id())->firstOrFail();

        if ($pengajuan->mahasiswa_id !== $mahasiswa->id) {
            abort(403);
        }

        if (! in_array($pengajuan->status, ['menunggu', 'revisi', 'ditolak'])) {
            return redirect()->route('mahasiswa.pengajuan.index')
                ->with('error', 'Pengajuan tidak dapat diedit pada status ini.');
        }

        $pengajuan->load('detailPengajuan.kategori', 'detailPengajuan.buktiKegiatan');

        if ($pengajuan->status === 'revisi' || $pengajuan->status === 'ditolak') {
            $pengajuan->update(['status' => 'menunggu', 'catatan_akademis' => null]);
        }

        return Inertia::render('mahasiswa/pengajuan/edit', [
            'pengajuan' => $pengajuan,
            'kategori' => Kategori::where('status', 'aktif')->orderBy('nama_kategori')->get(),
        ]);
    }

    public function update(Request $request, Pengajuan $pengajuan): RedirectResponse
    {
        $mahasiswa = Mahasiswa::where('user_id', auth()->id())->firstOrFail();

        if ($pengajuan->mahasiswa_id !== $mahasiswa->id) {
            abort(403);
        }

        if (! in_array($pengajuan->status, ['menunggu'])) {
            return back()->with('error', 'Pengajuan tidak dapat diedit pada status ini.');
        }

        $validated = $request->validate([
            'kegiatan' => ['required', 'array', 'min:1'],
            'kegiatan.*.kategori_id' => ['required', 'exists:kategori,id'],
            'kegiatan.*.nama_kegiatan' => ['required', 'string', 'max:255'],
            'kegiatan.*.tahun_kegiatan' => ['required', 'digits:4'],
            'kegiatan.*.peran' => ['required', 'string', 'max:100'],
            'kegiatan.*.bukti' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ]);

        DB::transaction(function () use ($validated, $pengajuan) {
            foreach ($pengajuan->detailPengajuan as $detail) {
                foreach ($detail->buktiKegiatan as $bukti) {
                    Storage::disk('public')->delete($bukti->path_file);
                    $bukti->delete();
                }
                $detail->delete();
            }

            foreach ($validated['kegiatan'] as $item) {
                $detail = DetailPengajuan::create([
                    'pengajuan_id' => $pengajuan->id,
                    'kategori_id' => $item['kategori_id'],
                    'nama_kegiatan' => $item['nama_kegiatan'],
                    'tahun_kegiatan' => $item['tahun_kegiatan'],
                    'peran' => $item['peran'],
                ]);

                if (isset($item['bukti']) && $item['bukti']) {
                    $file = $item['bukti'];
                    $path = $file->store('bukti-kegiatan', 'public');

                    $detail->buktiKegiatan()->create([
                        'nama_file' => $file->getClientOriginalName(),
                        'path_file' => $path,
                    ]);
                }
            }
        });

        return redirect()->route('mahasiswa.pengajuan.index')
            ->with('success', 'Pengajuan SKPI berhasil diperbarui.');
    }
}
