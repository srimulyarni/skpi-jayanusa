<div class="kop">
    <div class="kop-logo">
        @php
            $logoPath = public_path('assets/images/jayanusa.webp');
            $logoBase64 = file_exists($logoPath)
                ? 'data:image/webp;base64,' . base64_encode(file_get_contents($logoPath))
                : null;
        @endphp
        @if ($logoBase64)
            <img src="{{ $logoBase64 }}" alt="Logo Jayanusa">
        @endif
    </div>
    <p class="kop-nama">Yayasan Bina Manajemen Informatika (YBMI) Jayanusa</p>
    <p class="kop-nama-en">(Jayanusa Management Development Foundation (YBMI)</p>
    <p class="kop-alamat">Jl. Olo Ladang No. 10, Padang — Sumatera Barat</p>
</div>
<hr class="garis-ganda">
