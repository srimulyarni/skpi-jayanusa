<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Laporan Pengambilan SKPI</title>
    <style>@include('pdf.partials.laporan-style')</style>
</head>
<body>
    @include('pdf.partials.kop-surat')

    @include('pdf.partials.laporan-header', [
        'judul' => 'Laporan Pengambilan SKPI',
        'filterInfo' => $filterInfo,
        'periode' => $dari && $sampai ? $dari . ' s/d ' . $sampai : null,
    ])

    <table class="data-table">
        <thead>
            <tr>
                <th class="no">No</th>
                <th>No. SKPI</th>
                <th>Nama Mahasiswa</th>
                <th>NOBP</th>
                <th>Jurusan</th>
                <th>Tgl Terbit</th>
                <th>Tgl Pengambilan</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $i => $item)
                <tr>
                    <td class="no">{{ $i + 1 }}</td>
                    <td style="font-family:monospace;">{{ $item->skpi->no_skpi ?? '-' }}</td>
                    <td>{{ $item->skpi->pengajuanSkpi->mahasiswa->nama ?? '-' }}</td>
                    <td>{{ $item->skpi->pengajuanSkpi->mahasiswa->nobp ?? '-' }}</td>
                    <td>{{ $item->skpi->pengajuanSkpi->mahasiswa->jurusan->nama ?? '-' }}</td>
                    <td style="text-align:center;">{{ $item->skpi->tgl_terbit ? $item->skpi->tgl_terbit->format('d/m/Y') : '-' }}</td>
                    <td style="text-align:center;">{{ $item->tgl_pengambilan ? $item->tgl_pengambilan->format('d/m/Y') : '-' }}</td>
                    <td style="text-align:center;">{{ $item->status === 'sudah_diambil' ? 'Sudah' : 'Belum' }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <p class="cetak-info">Total: {{ $data->count() }} data pengambilan</p>

    @include('pdf.partials.signature-block')
</body>
</html>
