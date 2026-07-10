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
            'mahasiswa' => [
                'nomor_ijazah' => $mahasiswa->nomor_ijazah,
            ],
        ]);
    }

    public function create(): Response|RedirectResponse
    {
        $mahasiswa = Mahasiswa::where('user_id', auth()->id())->firstOrFail();

        $activePengajuan = Pengajuan::where('mahasiswa_id', $mahasiswa->id)
            ->whereIn('status', ['draft', 'menunggu', 'diproses'])
            ->exists();

        if ($activePengajuan) {
            return redirect()->route('mahasiswa.pengajuan.index')
                ->with('error', 'Anda masih memiliki pengajuan yang sedang aktif.');
        }

        return Inertia::render('mahasiswa/pengajuan/create', [
            'kategori' => Kategori::where('status', 'aktif')->orderBy('nama_kategori')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $mahasiswa = Mahasiswa::where('user_id', auth()->id())->firstOrFail();

        $activePengajuan = Pengajuan::where('mahasiswa_id', $mahasiswa->id)
            ->whereIn('status', ['draft', 'menunggu', 'diproses'])
            ->exists();

        if ($activePengajuan) {
            return back()->with('error', 'Anda masih memiliki pengajuan yang sedang aktif.');
        }

        $validated = $request->validate([
            'kegiatan' => ['required', 'array', 'min:1'],
            'kegiatan.*.kategori_id' => ['required', 'exists:kategori,id'],
            'kegiatan.*.nama_kegiatan' => ['required', 'string', 'max:255'],
            'kegiatan.*.tahun_kegiatan' => ['required', 'digits:4'],
            'kegiatan.*.peran' => ['required', 'string', 'max:100'],
            'kegiatan.*.bukti' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ]);

        DB::transaction(function () use ($validated, $mahasiswa) {
            $pengajuan = Pengajuan::create([
                'mahasiswa_id' => $mahasiswa->id,
                'no_registrasi' => null,
                'tgl_pengajuan' => null,
                'status' => 'draft',
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
                    $ext = $file->getClientOriginalExtension();
                    $safeName = \Illuminate\Support\Str::slug($item['nama_kegiatan'], '-') . '-' . time() . '.' . $ext;
                    $path = $file->storeAs('bukti-kegiatan', $safeName, 'public');

                    $detail->buktiKegiatan()->create([
                        'nama_file' => $safeName,
                        'path_file' => $path,
                    ]);
                }
            }
        });

        return redirect()->route('mahasiswa.pengajuan.index')
            ->with('success', 'Draft pengajuan berhasil disimpan.');
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
            'mahasiswa' => [
                'nomor_ijazah' => $mahasiswa->nomor_ijazah,
            ],
        ]);
    }

    public function edit(Pengajuan $pengajuan): Response
    {
        $mahasiswa = Mahasiswa::where('user_id', auth()->id())->firstOrFail();

        if ($pengajuan->mahasiswa_id !== $mahasiswa->id) {
            abort(403);
        }

        if (! in_array($pengajuan->status, ['draft', 'menunggu', 'revisi', 'ditolak'])) {
            return redirect()->route('mahasiswa.pengajuan.index')
                ->with('error', 'Pengajuan tidak dapat diedit pada status ini.');
        }

        $pengajuan->load('detailPengajuan.kategori', 'detailPengajuan.buktiKegiatan');

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

        if (! in_array($pengajuan->status, ['draft', 'menunggu', 'revisi', 'ditolak'])) {
            return back()->with('error', 'Pengajuan tidak dapat diedit pada status ini.');
        }

        $validated = $request->validate([
            'kegiatan' => ['required', 'array', 'min:1'],
            'kegiatan.*.kategori_id' => ['required', 'exists:kategori,id'],
            'kegiatan.*.nama_kegiatan' => ['required', 'string', 'max:255'],
            'kegiatan.*.tahun_kegiatan' => ['required', 'digits:4'],
            'kegiatan.*.peran' => ['required', 'string', 'max:100'],
            'kegiatan.*.bukti' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            'kegiatan.*.bukti_path' => ['nullable', 'string'],
            'kegiatan.*.bukti_nama' => ['nullable', 'string', 'max:255'],
        ]);

        DB::transaction(function () use ($validated, $pengajuan) {
            if (in_array($pengajuan->status, ['revisi', 'ditolak'])) {
                $pengajuan->update(['status' => 'menunggu', 'catatan_akademis' => null]);
            }

            $pengajuan->load('detailPengajuan.buktiKegiatan');

            $preservePaths = collect($validated['kegiatan'])
                ->pluck('bukti_path')
                ->filter()
                ->toArray();

            foreach ($pengajuan->detailPengajuan as $detail) {
                foreach ($detail->buktiKegiatan as $bukti) {
                    if (! in_array($bukti->path_file, $preservePaths)) {
                        Storage::disk('public')->delete($bukti->path_file);
                    }
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
                    $ext = $file->getClientOriginalExtension();
                    $safeName = \Illuminate\Support\Str::slug($item['nama_kegiatan'], '-') . '-' . time() . '.' . $ext;
                    $path = $file->storeAs('bukti-kegiatan', $safeName, 'public');

                    $detail->buktiKegiatan()->create([
                        'nama_file' => $safeName,
                        'path_file' => $path,
                    ]);
                } elseif (isset($item['bukti_path']) && $item['bukti_path']) {
                    $detail->buktiKegiatan()->create([
                        'nama_file' => $item['bukti_nama'] ?? basename($item['bukti_path']),
                        'path_file' => $item['bukti_path'],
                    ]);
                }
            }
        });

        return redirect()->route('mahasiswa.pengajuan.index')
            ->with('success', 'Pengajuan SKPI berhasil diperbarui.');
    }

    public function ajukan(Request $request, Pengajuan $pengajuan): RedirectResponse
    {
        $mahasiswa = Mahasiswa::where('user_id', auth()->id())->firstOrFail();

        if ($pengajuan->mahasiswa_id !== $mahasiswa->id) {
            abort(403);
        }

        if ($pengajuan->status !== 'draft') {
            return back()->with('error', 'Hanya draft pengajuan yang bisa diajukan.');
        }

        if ($pengajuan->detailPengajuan()->count() === 0) {
            return back()->with('error', 'Tambahkan minimal 1 kegiatan sebelum mengajukan.');
        }

        $validated = $request->validate([
            'nomor_ijazah' => ['required', 'string', 'max:100'],
        ]);

        $tahun = now()->format('Y');
        $bulan = now()->format('m');
        $urutan = Pengajuan::whereYear('created_at', $tahun)->whereMonth('created_at', $bulan)->count() + 1;
        $noRegistrasi = sprintf('REG/%s/%s/%04d', $tahun, $bulan, $urutan);

        DB::transaction(function () use ($validated, $mahasiswa, $pengajuan, $noRegistrasi) {
            $mahasiswa->update(['nomor_ijazah' => $validated['nomor_ijazah']]);

            $pengajuan->update([
                'no_registrasi' => $noRegistrasi,
                'tgl_pengajuan' => now()->toDateString(),
                'status' => 'menunggu',
            ]);
        });

        return redirect()->route('mahasiswa.pengajuan.index')
            ->with('success', 'Pengajuan SKPI berhasil diajukan dengan nomor registrasi ' . $noRegistrasi);
    }
}
