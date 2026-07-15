<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Laporan Kategori Kegiatan</title>
    <style>@include('pdf.partials.laporan-style')</style>
</head>
<body>
    @include('pdf.partials.kop-surat')

    @include('pdf.partials.laporan-header', [
        'judul' => 'Laporan Kategori Kegiatan',
        'filterInfo' => $filterInfo,
        'periode' => $dari && $sampai ? $dari . ' s/d ' . $sampai : null,
    ])

    <table class="data-table">
        <thead>
            <tr>
                <th class="no">No</th>
                <th>Nama Kategori</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $i => $item)
                <tr>
                    <td class="no">{{ $i + 1 }}</td>
                    <td>{{ $item->nama_kategori }}</td>
                    <td style="text-align:center;">{{ ucfirst($item->status) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <p class="cetak-info">Total: {{ $data->count() }} kategori</p>

    @include('pdf.partials.signature-block')
</body>
</html>
