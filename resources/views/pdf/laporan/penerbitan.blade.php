<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Laporan Penerbitan SKPI</title>
    <style>@include('pdf.partials.laporan-style')</style>
</head>
<body>
    @include('pdf.partials.kop-surat')

    @include('pdf.partials.laporan-header', [
        'judul' => 'Laporan Penerbitan SKPI',
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
                <th>Status SKPI</th>
                <th>Pengambilan</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $i => $item)
                <tr>
                    <td class="no">{{ $i + 1 }}</td>
                    <td style="font-family:monospace;">{{ $item->skpi?->no_skpi ?? '-' }}</td>
                    <td>{{ $item->mahasiswa->nama ?? '-' }}</td>
                    <td>{{ $item->mahasiswa->nobp ?? '-' }}</td>
                    <td>{{ $item->mahasiswa->jurusan->nama ?? '-' }}</td>
                    <td style="text-align:center;">{{ $item->skpi?->tgl_terbit?->format('d/m/Y') ?? '-' }}</td>
                    <td style="text-align:center;">
                        @if (! $item->skpi)
                            Belum Terbit
                        @else
                            {{ $item->skpi->status === 'dibatalkan' ? 'Dibatalkan' : 'Diterbitkan' }}
                        @endif
                    </td>
                    <td style="text-align:center;">
                        @if (! $item->skpi?->pengambilan)
                            -
                        @else
                            {{ $item->skpi->pengambilan->status === 'sudah_diambil' ? 'Sudah' : 'Belum' }}
                        @endif
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <p class="cetak-info">
        Total: {{ $data->count() }} pengajuan &middot;
        {{ $data->where('skpi.status', 'diterbitkan')->count() }} diterbitkan &middot;
        {{ $data->where('skpi.status', 'dibatalkan')->count() }} dibatalkan &middot;
        {{ $data->whereNull('skpi')->count() }} belum terbit
    </p>

    @include('pdf.partials.signature-block')
</body>
</html>
