<div class="tanda-tangan-blok">
    <table>
        <tr>
            <td>
                <p class="ttd-jabatan">Mengetahui,</p>
                <p class="ttd-jabatan">Ketua {{ $identitasPt->nama_singkat ?? $identitasPt->nama_pt }}</p>
                <p class="ttd-en">Chairperson</p>
                <div class="ttd-spacer"></div>
                <p class="ttd-nama">{{ $identitasPt->nama_pimpinan ?? '-' }}</p>
                <p class="ttd-nip">NIDN. {{ $identitasPt->nidn ?? '-' }}</p>
            </td>
            <td>
                {{-- <p class="ttd-jabatan">Padang, {{ now()->format('d F Y') }}</p>
                <p class="ttd-jabatan">Validator</p>
                <div class="ttd-spacer"></div>
                <p class="ttd-nama">{{ auth()->user()->name ?? '-' }}</p>
                <p class="ttd-nip">&nbsp;</p> --}}
            </td>
        </tr>
    </table>
</div>
