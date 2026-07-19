<?php

namespace App\Http\Controllers\Validator;

use App\Http\Controllers\Controller;
use App\Models\Aktivitas;
use App\Models\IdentitasPt;
use App\Models\Jurusan;
use App\Models\Kategori;
use App\Models\PengajuanSkpi;
use App\Models\Pengambilan;
use App\Models\PeriodeSkpi;
use App\Models\Skpi;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LaporanController extends Controller
{
    private function getDateRange(Request $request): array
    {
        return [$request->input('dari'), $request->input('sampai')];
    }

    private function getIdentitasPt(): ?IdentitasPt
    {
        return IdentitasPt::first();
    }

    private function getKodeDefault(): ?string
    {
        return PeriodeSkpi::where('status', 'aktif')
            ->where('tgl_mulai', '<=', now())
            ->where('tgl_selesai', '>=', now())
            ->value('kode');
    }

    public function kategori(): Response
    {
        $data = Kategori::orderBy('nama_kategori')->get();

        return Inertia::render('validator/laporan/kategori', ['data' => $data]);
    }

    public function kategoriPdf()
    {
        $data = Kategori::orderBy('nama_kategori')->get();

        return Pdf::loadView('pdf.laporan.kategori', [
            'data' => $data,
            'dari' => null,
            'sampai' => null,
            'filterInfo' => [],
            'identitasPt' => $this->getIdentitasPt(),
        ])->setOption(['isHtml5ParserEnabled' => true])->stream('laporan-kategori.pdf');
    }

    public function pengajuan(Request $request): Response
    {
        [$dari, $sampai] = $this->getDateRange($request);
        $kode = $request->input('kode') ?: $this->getKodeDefault();
        $status = $request->input('status');

        $query = PengajuanSkpi::with(['mahasiswa.jurusan', 'periodeSkpi'])
            ->when($dari, fn ($q) => $q->where('tgl_pengajuan', '>=', $dari))
            ->when($sampai, fn ($q) => $q->where('tgl_pengajuan', '<=', $sampai))
            ->when($kode, fn ($q) => $q->whereHas('periodeSkpi', fn ($pq) => $pq->where('kode', $kode)))
            ->when($status, fn ($q) => $q->where('status', $status))
            ->orderByDesc('tgl_pengajuan');

        return Inertia::render('validator/laporan/pengajuan', [
            'data' => $query->get(),
            'filters' => ['dari' => $dari, 'sampai' => $sampai, 'kode' => $kode, 'status' => $status],
        ]);
    }

    public function pengajuanPdf(Request $request)
    {
        [$dari, $sampai] = $this->getDateRange($request);
        $kode = $request->input('kode') ?: $this->getKodeDefault();
        $status = $request->input('status');

        $query = PengajuanSkpi::with(['mahasiswa.jurusan', 'periodeSkpi'])
            ->when($dari, fn ($q) => $q->where('tgl_pengajuan', '>=', $dari))
            ->when($sampai, fn ($q) => $q->where('tgl_pengajuan', '<=', $sampai))
            ->when($kode, fn ($q) => $q->whereHas('periodeSkpi', fn ($pq) => $pq->where('kode', $kode)))
            ->when($status, fn ($q) => $q->where('status', $status))
            ->orderByDesc('tgl_pengajuan');

        $data = $query->get();
        $filterInfo = [];
        if ($kode) $filterInfo[] = 'Kode Periode: ' . $kode;
        if ($status) $filterInfo[] = 'Status: ' . ucfirst($status);

        return Pdf::loadView('pdf.laporan.pengajuan', [
            'data' => $data, 'dari' => $dari, 'sampai' => $sampai,
            'filterInfo' => $filterInfo, 'identitasPt' => $this->getIdentitasPt(),
        ])->setOption(['isHtml5ParserEnabled' => true])->stream('laporan-pengajuan.pdf');
    }

    public function penerbitan(Request $request): Response
    {
        [$dari, $sampai] = $this->getDateRange($request);
        $kode = $request->input('kode') ?: $this->getKodeDefault();
        $statusAmbil = $request->input('status_ambil');

        $query = Skpi::with(['pengajuanSkpi.mahasiswa.jurusan', 'pengajuanSkpi.periodeSkpi', 'pengambilan'])
            ->where('status', 'diterbitkan')
            ->when($dari, fn ($q) => $q->where('tgl_terbit', '>=', $dari))
            ->when($sampai, fn ($q) => $q->where('tgl_terbit', '<=', $sampai))
            ->when($kode, fn ($q) => $q->whereHas('pengajuanSkpi.periodeSkpi', fn ($pq) => $pq->where('kode', $kode)))
            ->when($statusAmbil === 'sudah', fn ($q) => $q->whereHas('pengambilan', fn ($pq) => $pq->where('status', 'sudah_diambil')))
            ->when($statusAmbil === 'belum', fn ($q) => $q->whereHas('pengambilan', fn ($pq) => $pq->where('status', 'belum_diambil')))
            ->orderBy('tgl_terbit');

        return Inertia::render('validator/laporan/penerbitan', [
            'data' => $query->get(),
            'filters' => ['dari' => $dari, 'sampai' => $sampai, 'kode' => $kode, 'status_ambil' => $statusAmbil],
        ]);
    }

    public function penerbitanPdf(Request $request)
    {
        [$dari, $sampai] = $this->getDateRange($request);
        $kode = $request->input('kode') ?: $this->getKodeDefault();
        $statusAmbil = $request->input('status_ambil');

        $query = Skpi::with(['pengajuanSkpi.mahasiswa.jurusan', 'pengajuanSkpi.periodeSkpi', 'pengambilan'])
            ->where('status', 'diterbitkan')
            ->when($dari, fn ($q) => $q->where('tgl_terbit', '>=', $dari))
            ->when($sampai, fn ($q) => $q->where('tgl_terbit', '<=', $sampai))
            ->when($kode, fn ($q) => $q->whereHas('pengajuanSkpi.periodeSkpi', fn ($pq) => $pq->where('kode', $kode)))
            ->when($statusAmbil === 'sudah', fn ($q) => $q->whereHas('pengambilan', fn ($pq) => $pq->where('status', 'sudah_diambil')))
            ->when($statusAmbil === 'belum', fn ($q) => $q->whereHas('pengambilan', fn ($pq) => $pq->where('status', 'belum_diambil')))
            ->orderBy('tgl_terbit');

        $data = $query->get();
        $filterInfo = [];
        if ($kode) $filterInfo[] = 'Kode Periode: ' . $kode;
        if ($statusAmbil) $filterInfo[] = 'Pengambilan: ' . ($statusAmbil === 'sudah' ? 'Sudah Diambil' : 'Belum Diambil');

        return Pdf::loadView('pdf.laporan.penerbitan', [
            'data' => $data, 'dari' => $dari, 'sampai' => $sampai,
            'filterInfo' => $filterInfo, 'identitasPt' => $this->getIdentitasPt(),
        ])->setOption(['isHtml5ParserEnabled' => true])->stream('laporan-penerbitan.pdf');
    }

    public function pengambilan(Request $request): Response
    {
        [$dari, $sampai] = $this->getDateRange($request);
        $kode = $request->input('kode') ?: $this->getKodeDefault();
        $statusAmbil = $request->input('status_ambil');

        $query = Pengambilan::with(['skpi.pengajuanSkpi.mahasiswa.jurusan', 'skpi.pengajuanSkpi.periodeSkpi'])
            ->when($dari, fn ($q) => $q->where('tgl_pengambilan', '>=', $dari))
            ->when($sampai, fn ($q) => $q->where('tgl_pengambilan', '<=', $sampai))
            ->when($kode, fn ($q) => $q->whereHas('skpi.pengajuanSkpi.periodeSkpi', fn ($pq) => $pq->where('kode', $kode)))
            ->when($statusAmbil === 'sudah', fn ($q) => $q->where('status', 'sudah_diambil'))
            ->when($statusAmbil === 'belum', fn ($q) => $q->where('status', 'belum_diambil'))
            ->orderByDesc('created_at');

        return Inertia::render('validator/laporan/pengambilan', [
            'data' => $query->get(),
            'filters' => ['dari' => $dari, 'sampai' => $sampai, 'kode' => $kode, 'status_ambil' => $statusAmbil],
        ]);
    }

    public function pengambilanPdf(Request $request)
    {
        [$dari, $sampai] = $this->getDateRange($request);
        $kode = $request->input('kode') ?: $this->getKodeDefault();
        $statusAmbil = $request->input('status_ambil');

        $query = Pengambilan::with(['skpi.pengajuanSkpi.mahasiswa.jurusan', 'skpi.pengajuanSkpi.periodeSkpi'])
            ->when($dari, fn ($q) => $q->where('tgl_pengambilan', '>=', $dari))
            ->when($sampai, fn ($q) => $q->where('tgl_pengambilan', '<=', $sampai))
            ->when($kode, fn ($q) => $q->whereHas('skpi.pengajuanSkpi.periodeSkpi', fn ($pq) => $pq->where('kode', $kode)))
            ->when($statusAmbil === 'sudah', fn ($q) => $q->where('status', 'sudah_diambil'))
            ->when($statusAmbil === 'belum', fn ($q) => $q->where('status', 'belum_diambil'))
            ->orderByDesc('created_at');

        $data = $query->get();
        $filterInfo = [];
        if ($kode) $filterInfo[] = 'Kode Periode: ' . $kode;
        if ($statusAmbil) $filterInfo[] = 'Status: ' . ($statusAmbil === 'sudah' ? 'Sudah Diambil' : 'Belum Diambil');

        return Pdf::loadView('pdf.laporan.pengambilan', [
            'data' => $data, 'dari' => $dari, 'sampai' => $sampai,
            'filterInfo' => $filterInfo, 'identitasPt' => $this->getIdentitasPt(),
        ])->setOption(['isHtml5ParserEnabled' => true])->stream('laporan-pengambilan.pdf');
    }

    public function aktivitas(Request $request): Response
    {
        [$dari, $sampai] = $this->getDateRange($request);
        $kode = $request->input('kode') ?: $this->getKodeDefault();
        $kategoriId = $request->input('kategori_id');
        $jurusanId = $request->input('jurusan_id');
        $status = $request->input('status');

        $query = Aktivitas::with(['mahasiswa.jurusan', 'kategori'])
            ->when($dari, fn ($q) => $q->where('created_at', '>=', $dari))
            ->when($sampai, fn ($q) => $q->where('created_at', '<=', $sampai . ' 23:59:59'))
            ->when($kode, fn ($q) => $q->whereHas('mahasiswa.pengajuanSkpi.periodeSkpi', fn ($pq) => $pq->where('kode', $kode)))
            ->when($kategoriId, fn ($q) => $q->where('kategori_id', $kategoriId))
            ->when($jurusanId, fn ($q) => $q->whereHas('mahasiswa', fn ($mq) => $mq->where('jurusan_id', $jurusanId)))
            ->when($status, fn ($q) => $q->where('status', $status))
            ->orderByDesc('created_at');

        return Inertia::render('validator/laporan/aktivitas', [
            'data' => $query->get(),
            'filters' => ['dari' => $dari, 'sampai' => $sampai, 'kode' => $kode, 'kategori_id' => $kategoriId, 'jurusan_id' => $jurusanId, 'status' => $status],
            'kategoriList' => Kategori::orderBy('nama_kategori')->get(),
            'jurusanList' => Jurusan::orderBy('nama')->get(),
        ]);
    }

    public function aktivitasPdf(Request $request)
    {
        [$dari, $sampai] = $this->getDateRange($request);
        $kode = $request->input('kode') ?: $this->getKodeDefault();
        $kategoriId = $request->input('kategori_id');
        $jurusanId = $request->input('jurusan_id');
        $status = $request->input('status');

        $query = Aktivitas::with(['mahasiswa.jurusan', 'kategori'])
            ->when($dari, fn ($q) => $q->where('created_at', '>=', $dari))
            ->when($sampai, fn ($q) => $q->where('created_at', '<=', $sampai . ' 23:59:59'))
            ->when($kode, fn ($q) => $q->whereHas('mahasiswa.pengajuanSkpi.periodeSkpi', fn ($pq) => $pq->where('kode', $kode)))
            ->when($kategoriId, fn ($q) => $q->where('kategori_id', $kategoriId))
            ->when($jurusanId, fn ($q) => $q->whereHas('mahasiswa', fn ($mq) => $mq->where('jurusan_id', $jurusanId)))
            ->when($status, fn ($q) => $q->where('status', $status))
            ->orderByDesc('created_at');

        $data = $query->get();
        $filterInfo = [];
        if ($kode) $filterInfo[] = 'Kode Periode: ' . $kode;
        if ($kategoriId) { $k = Kategori::find($kategoriId); if ($k) $filterInfo[] = 'Kategori: ' . $k->nama_kategori; }
        if ($jurusanId) { $j = Jurusan::find($jurusanId); if ($j) $filterInfo[] = 'Jurusan: ' . $j->nama; }
        if ($status) $filterInfo[] = 'Status: ' . ucfirst($status);

        return Pdf::loadView('pdf.laporan.aktivitas', [
            'data' => $data, 'dari' => $dari, 'sampai' => $sampai,
            'filterInfo' => $filterInfo, 'identitasPt' => $this->getIdentitasPt(),
        ])->setPaper('a4', 'landscape')->setOption(['isHtml5ParserEnabled' => true])->stream('laporan-aktivitas.pdf');
    }
}
