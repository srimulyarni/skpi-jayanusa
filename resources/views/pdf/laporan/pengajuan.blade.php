<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Laporan Pengajuan SKPI</title>
    <style>@include('pdf.partials.laporan-style')</style>
</head>
<body>
    @include('pdf.partials.kop-surat')

    @include('pdf.partials.laporan-header', [
        'judul' => 'Laporan Pengajuan SKPI',
        'filterInfo' => $filterInfo,
        'periode' => $dari && $sampai ? $dari . ' s/d ' . $sampai : null,
    ])

    <table class="data-table">
        <thead>
            <tr>
                <th class="no">No</th>
                <th>No. Registrasi</th>
                <th>Nama Mahasiswa</th>
                <th>NOBP</th>
                <th>Jurusan</th>
                <th>Periode</th>
                <th>Tgl Pengajuan</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $i => $item)
                <tr>
                    <td class="no">{{ $i + 1 }}</td>
                    <td style="font-family:monospace;">{{ $item->no_registrasi ?? '-' }}</td>
                    <td>{{ $item->mahasiswa->nama ?? '-' }}</td>
                    <td>{{ $item->mahasiswa->nobp ?? '-' }}</td>
                    <td>{{ $item->mahasiswa->jurusan->nama ?? '-' }}</td>
                    <td>{{ $item->periodeSkpi->nama ?? '-' }}</td>
                    <td style="text-align:center;">{{ $item->tgl_pengajuan ? $item->tgl_pengajuan->format('d/m/Y') : '-' }}</td>
                    <td style="text-align:center;">{{ ucfirst($item->status) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <p class="cetak-info">Total: {{ $data->count() }} pengajuan</p>

    @include('pdf.partials.signature-block')
</body>
</html>
