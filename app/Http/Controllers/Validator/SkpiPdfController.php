<?php

namespace App\Http\Controllers\Validator;

use App\Http\Controllers\Controller;
use App\Models\Skpi;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;

class SkpiPdfController extends Controller
{
    public function preview(Skpi $skpi): Response
    {
        $data = $this->getData($skpi);
        $pdf = Pdf::loadView('pdf.skpi', $data)
            ->setOption(['isRemoteEnabled' => true, 'isHtml5ParserEnabled' => true]);

        $filename = str_replace('/', '-', $skpi->no_skpi);

        return $pdf->stream("{$filename}.pdf");
    }

    public function download(Skpi $skpi): Response
    {
        $data = $this->getData($skpi);
        $pdf = Pdf::loadView('pdf.skpi', $data)
            ->setOption(['isRemoteEnabled' => true, 'isHtml5ParserEnabled' => true]);

        $filename = str_replace('/', '-', $skpi->no_skpi);

        return $pdf->download("{$filename}.pdf");
    }

    private function getData(Skpi $skpi): array
    {
        $skpi->load(['pengajuanSkpi.mahasiswa.jurusan.identitasPt', 'pengajuanSkpi.aktivitas.kategori', 'identitasPt']);

        return [
            'skpi' => $skpi,
            'mahasiswa' => $skpi->pengajuanSkpi->mahasiswa,
            'identitasPt' => $skpi->identitasPt,
            'aktivitas' => $skpi->pengajuanSkpi->aktivitas,
        ];
    }
}
