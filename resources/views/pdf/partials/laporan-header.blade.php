<div class="laporan-judul">
    <h1>{{ $judul }}</h1>
    @if(isset($subjudul))
        <div class="laporan-subtitle">{{ $subjudul }}</div>
    @endif
</div>

<div class="laporan-meta">
    <table>
        @if(isset($periode))
            <tr>
                <td class="meta-label">Periode</td>
                <td>: {{ $periode }}</td>
            </tr>
        @endif
        @if(isset($filterInfo) && count($filterInfo) > 0)
            <tr>
                <td class="meta-label">Filter</td>
                <td>: {{ implode(', ', $filterInfo) }}</td>
            </tr>
        @endif
        <tr>
            <td class="meta-label">Tanggal Cetak</td>
            <td>: {{ now()->format('d F Y H:i') }}</td>
        </tr>
    </table>
</div>
