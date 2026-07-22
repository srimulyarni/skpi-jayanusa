<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Laporan Aktivitas Mahasiswa</title>
    <style>
        @include('pdf.partials.laporan-style')
    </style>
</head>
<body>
    @include('pdf.partials.kop-surat')

    @include('pdf.partials.laporan-header', [
        'judul' => 'Laporan Aktivitas Mahasiswa',
        'filterInfo' => $filterInfo,
        'periode' => $dari && $sampai ? $dari . ' s/d ' . $sampai : null,
    ])

    <table class="data-table" style="table-layout:fixed; word-wrap:break-word;">
        <colgroup>
            <col style="width:25px">
            <col style="width:100px">
            <col style="width:55px">
            <col style="width:75px">
            <col style="width:65px">
            <col>
            <col style="width:35px">
            <col style="width:55px">
            <col style="width:50px">
            <col style="width:45px">
            <col style="width:50px">
        </colgroup>
        <thead>
            <tr>
                <th class="no">No</th>
                <th>Nama Mahasiswa</th>
                <th>NOBP</th>
                <th>Jurusan</th>
                <th>Kategori</th>
                <th>Nama Kegiatan</th>
                <th>Tahun</th>
                <th>Peran</th>
                <th>Juara</th>
                <th>Tingkat</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $i => $item)
                <tr>
                    <td class="no">{{ $i + 1 }}</td>
                    <td>{{ $item->mahasiswa->nama ?? '-' }}</td>
                    <td>{{ $item->mahasiswa->nobp ?? '-' }}</td>
                    <td>{{ $item->mahasiswa->jurusan->nama ?? '-' }}</td>
                    <td>{{ $item->kategori->nama_kategori ?? '-' }}</td>
                    <td>{{ $item->nama_kegiatan }}</td>
                    <td style="text-align:center;">{{ $item->tahun_kegiatan }}</td>
                    <td>{{ $item->peran }}</td>
                    <td>{{ $item->juara ?? '-' }}</td>
                    <td style="text-align:center;">{{ $item->tingkat ? ucfirst($item->tingkat) : '-' }}</td>
                    <td style="text-align:center;">{{ ucfirst($item->status) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <p class="cetak-info">Total: {{ $data->count() }} aktivitas</p>

    @include('pdf.partials.signature-block')
</body>
</html>
