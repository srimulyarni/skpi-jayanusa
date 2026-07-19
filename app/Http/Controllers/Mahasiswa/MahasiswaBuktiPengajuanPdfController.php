<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\IdentitasPt;
use App\Models\Mahasiswa;
use App\Models\PengajuanSkpi;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;

class MahasiswaBuktiPengajuanPdfController extends Controller
{
    public function preview(PengajuanSkpi $pengajuanSkpi): Response
    {
        $this->authorizeAccess($pengajuanSkpi);

        $pdf = $this->generatePdf($pengajuanSkpi);
        $filename = $this->filename($pengajuanSkpi);

        return $pdf->stream("{$filename}.pdf");
    }

    public function download(PengajuanSkpi $pengajuanSkpi): Response
    {
        $this->authorizeAccess($pengajuanSkpi);

        $pdf = $this->generatePdf($pengajuanSkpi);
        $filename = $this->filename($pengajuanSkpi);

        return $pdf->download("{$filename}.pdf");
    }

    private function authorizeAccess(PengajuanSkpi $pengajuanSkpi): void
    {
        $mahasiswa = Mahasiswa::where('user_id', auth()->id())->firstOrFail();

        if ($pengajuanSkpi->mahasiswa_id !== $mahasiswa->id) {
            abort(403);
        }
    }

    private function generatePdf(PengajuanSkpi $pengajuanSkpi): \Barryvdh\DomPDF\PDF
    {
        $pengajuanSkpi->load(['mahasiswa.jurusan.identitasPt', 'aktivitas.kategori', 'periodeSkpi']);

        $identitasPt = IdentitasPt::first();

        return Pdf::loadView('pdf.bukti-pengajuan', [
            'pengajuan' => $pengajuanSkpi,
            'mahasiswa' => $pengajuanSkpi->mahasiswa,
            'identitasPt' => $identitasPt,
            'aktivitas' => $pengajuanSkpi->aktivitas,
        ])->setOption(['isHtml5ParserEnabled' => true]);
    }

    private function filename(PengajuanSkpi $pengajuanSkpi): string
    {
        return 'bukti-pengajuan-' . str_replace('/', '-', $pengajuanSkpi->no_registrasi ?? $pengajuanSkpi->id);
    }
}
