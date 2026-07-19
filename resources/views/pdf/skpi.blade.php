<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>SKPI {{ $skpi->no_skpi }}</title>
    <style>
        @include('pdf.partials.skpi-style');
    </style>
</head>

<body>

    {{-- HALAMAN 1: Kop + Judul + Identitas --}}

    @include('pdf.partials.kop-surat')

    <div class="judul">
        <h1>SURAT KETERANGAN PENDAMPING IJAZAH</h1>
        <div class="subtitle">Letter of Reference Accompanying the Diploma</div>
    </div>
    <div class="nomor">NO : {{ $skpi->no_skpi }}</div>

    <div class="dasar-hukum">
        Surat Keterangan Pendamping Ijazah (SKPI) ini mengacu pada Kerangka Kualifikasi Nasional Indonesia (KKNI), dan
        Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi Republik Indonesia Nomor 6 Tahun 2022. Tujuan
        dari SKPI ini adalah memberikan informasi tentang pemenuhan kompetensi lulusan yang menyatakan kemampuan kerja,
        penguasaan pengetahuan, pengakuan professional dan sikap/moral pemegangnya.
    </div>

    <div class="section-title">Identitas Diri Pemegang SKPI <span class="en">Holder's Identity</span></div>
    <table class="identitas-table">
        <tr>
            <td class="label">Nama Lengkap <span class="en">Full Name</span></td>
            <td class="separator">:</td>
            <td>{{ $mahasiswa->nama }}</td>
        </tr>
        <tr>
            <td class="label">Tempat dan Tanggal Lahir <span class="en">Place and Date of Birth</span></td>
            <td class="separator">:</td>
            <td>{{ $mahasiswa->tempat_lahir ?? '-' }},
                {{ $mahasiswa->tanggal_lahir ? $mahasiswa->tanggal_lahir->format('d-m-Y') : '-' }}</td>
        </tr>
        <tr>
            <td class="label">Nomor BP <span class="en">Student ID Number</span></td>
            <td class="separator">:</td>
            <td>{{ $mahasiswa->nobp }}</td>
        </tr>
        <tr>
            <td class="label">Nomor Ijazah <span class="en">Diploma Number</span></td>
            <td class="separator">:</td>
            <td>{{ $mahasiswa->nomor_ijazah ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Gelar <span class="en">Degree</span></td>
            <td class="separator">:</td>
            <td>{{ $identitasPt->gelar ?? '-' }}</td>
        </tr>
    </table>

    <div class="section-title">Informasi Tentang Identitas Penyelenggara <span class="en">Institution Identity
            Information</span></div>
    <table class="identitas-table">
        <tr>
            <td class="label">SK Pendirian Perguruan Tinggi <span class="en">Institution Establishment
                    Decree</span></td>
            <td class="separator">:</td>
            <td>{{ $identitasPt->nomor_sk ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Nama Perguruan Tinggi <span class="en">Institution Name</span></td>
            <td class="separator">:</td>
            <td>{{ $identitasPt->nama_pt }}</td>
        </tr>
        <tr>
            <td class="label">Program Studi <span class="en">Study Program</span></td>
            <td class="separator">:</td>
            <td>{{ $mahasiswa->jurusan->nama ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Akreditasi <span class="en">Accreditation</span></td>
            <td class="separator">:</td>
            <td>{{ $identitasPt->akreditasi_institusi }}</td>
        </tr>
    </table>

    <div style="page-break-after: always;"></div>

    {{-- HALAMAN 2+: Lampiran Aktivitas + Pengesahan --}}

    @include('pdf.partials.kop-surat')

    <div class="judul">
        <h1>LAMPIRAN SURAT KETERANGAN PENDAMPING IJAZAH</h1>
        <div class="subtitle">Appendix of Letter of Reference Accompanying the Diploma</div>
    </div>

    <div class="section-title">Daftar Aktivitas, Prestasi dan Kegiatan <span class="en">List of Activities,
            Achievements and Events</span></div>

    @php
        $hasLomba = $aktivitas->contains(fn($item) => $item->kategori && $item->kategori->tipe === 'lomba');
    @endphp

    @if ($aktivitas->count() > 0)
        <table class="aktivitas-table">
            <colgroup>
                <col style="width:30px">
                <col style="width:110px">
                <col>
                <col style="width:80px">
                <col style="width:45px">
                @if ($hasLomba)
                    <col style="width:70px">
                    <col style="width:70px">
                @endif
            </colgroup>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Jenis Kegiatan <br><span class="en">Activity Type</span></th>
                    <th>Nama Kegiatan / Prestasi <br><span class="en">Activity / Achievement</span></th>
                    <th>Peran <br><span class="en">Role</span></th>
                    <th>Tahun <br><span class="en">Year</span></th>
                    @if ($hasLomba)
                        <th>Juara <br><span class="en">Award</span></th>
                        <th>Tingkat <br><span class="en">Level</span></th>
                    @endif
                </tr>
            </thead>
            <tbody>
                @foreach ($aktivitas as $i => $item)
                    <tr>
                        <td class="no">{{ $i + 1 }}</td>
                        <td>{{ $item->kategori->nama_kategori ?? '-' }}</td>
                        <td>{{ $item->nama_kegiatan }}</td>
                        <td>{{ $item->peran }}</td>
                        <td class="tahun">{{ $item->tahun_kegiatan }}</td>
                        @if ($hasLomba)
                            <td>{{ $item->juara ?? '-' }}</td>
                            <td>{{ $item->tingkat ? ucfirst($item->tingkat) : '-' }}</td>
                        @endif
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p class="kosong">Tidak ada data aktivitas tercatat</p>
    @endif

    <div class="pengesahan clearfix">
        <div class="pengesahan-header">Pengesahan SKPI <span class="en">SKPI Legalization</span></div>

        <p>Padang, {{ \Carbon\Carbon::parse($skpi->tgl_terbit)->format('d-m-Y') }}</p>

        <div class="tanda-tangan">
            <p style="margin-bottom:0;">Ketua {{ $identitasPt->nama_singkat }} <br><span class="en">Chairperson of
                    {{ $identitasPt->nama_singkat }}</span></p>
            <div class="ttd-spacer"></div>
            <p class="ttd-nama">{{ $identitasPt->nama_pimpinan }}</p>
            <p class="ttd-nidn">NIDN. {{ $identitasPt->nidn }}</p>
        </div>
    </div>

</body>

</html>
