<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Bukti Pengajuan SKPI {{ $pengajuan->no_registrasi }}</title>
    <style>
        @include('pdf.partials.skpi-style')

        .info-box {
            border: 1px solid #000;
            padding: 10px 14px;
            margin-bottom: 14px;
            font-size: 10.5pt;
        }
        .info-box .label {
            color: #555;
            width: 160px;
        }
        .status-badge {
            display: inline-block;
            border: 1px solid #000;
            padding: 2px 10px;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 10pt;
        }
        .footer-note {
            margin-top: 20px;
            font-size: 9pt;
            color: #555;
            text-align: center;
            font-style: italic;
            border-top: 1px solid #ccc;
            padding-top: 8px;
        }
    </style>
</head>
<body>

    @include('pdf.partials.kop-surat')

    <div class="judul">
        <h1>BUKTI PENGAJUAN SKPI</h1>
        <div class="subtitle">Proof of SKPI Submission</div>
    </div>
    <div class="nomor">NO : {{ $pengajuan->no_registrasi ?? '-' }}</div>

    <div class="info-box">
        <table class="identitas-table" style="margin-bottom:0;">
            <tr>
                <td class="label">No. Registrasi <span class="en">Registration No.</span></td>
                <td class="separator">:</td>
                <td>{{ $pengajuan->no_registrasi ?? '-' }}</td>
            </tr>
            <tr>
                <td class="label">Tanggal Pengajuan <span class="en">Submission Date</span></td>
                <td class="separator">:</td>
                <td>{{ $pengajuan->tgl_pengajuan ? \Carbon\Carbon::parse($pengajuan->tgl_pengajuan)->format('d F Y') : '-' }}</td>
            </tr>
            <tr>
                <td class="label">Periode <span class="en">Period</span></td>
                <td class="separator">:</td>
                <td>{{ $pengajuan->periodeSkpi->nama ?? '-' }} ({{ $pengajuan->periodeSkpi->kode ?? '-' }})</td>
            </tr>
            <tr>
                <td class="label">Status</td>
                <td class="separator">:</td>
                <td><span class="status-badge">{{ strtoupper($pengajuan->status) }}</span></td>
            </tr>
        </table>
    </div>

    <div class="section-title">Identitas Pemohon <span class="en">Applicant's Identity</span></div>
    <table class="identitas-table">
        <tr>
            <td class="label">Nama Lengkap <span class="en">Full Name</span></td>
            <td class="separator">:</td>
            <td>{{ $mahasiswa->nama }}</td>
        </tr>
        <tr>
            <td class="label">Nomor BP <span class="en">Student ID Number</span></td>
            <td class="separator">:</td>
            <td>{{ $mahasiswa->nobp }}</td>
        </tr>
        <tr>
            <td class="label">Tempat dan Tanggal Lahir <span class="en">Place and Date of Birth</span></td>
            <td class="separator">:</td>
            <td>{{ $mahasiswa->tempat_lahir ?? '-' }}, {{ $mahasiswa->tanggal_lahir ? $mahasiswa->tanggal_lahir->format('d-m-Y') : '-' }}</td>
        </tr>
        <tr>
            <td class="label">Program Studi <span class="en">Study Program</span></td>
            <td class="separator">:</td>
            <td>{{ $mahasiswa->jurusan->nama ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Perguruan Tinggi <span class="en">Institution</span></td>
            <td class="separator">:</td>
            <td>{{ $identitasPt->nama_pt ?? '-' }}</td>
        </tr>
    </table>

    <div class="footer-note">
        Dokumen ini bukan SKPI. Ini adalah bukti pengajuan SKPI yang masih dalam proses validasi.<br>
        <span style="font-style: normal;">This document is not a SKPI. This is a proof of SKPI submission currently under validation process.</span>
    </div>

</body>
</html>
