@page {
    size: A4 landscape;
    margin: 1.5cm 2cm;
    @bottom-center {
        content: "Halaman " counter(page) " dari " counter(pages);
        font-size: 8pt;
        color: #666;
    }
}

body {
    font-family: 'Times New Roman', serif;
    font-size: 11pt;
    line-height: 1.4;
    color: #000;
}

.kop {
    text-align: center;
    margin-bottom: 2px;
}
.kop-logo {
    margin-bottom: 2px;
}
.kop-logo img {
    width: 75px;
    height: auto;
}
.kop-nama {
    font-size: 14pt;
    font-weight: bold;
    text-transform: uppercase;
    margin: 0;
}
.kop-nama-en {
    font-size: 10pt;
    font-style: italic;
    color: #1447E6;
    margin: 1px 0;
}
.kop-nama-yas {
    font-size: 11pt;
    font-weight: bold;
    text-transform: uppercase;
    margin: 0;
}
.kop-nama-en-yas {
    font-size: 9pt;
    font-style: italic;
    color: #1447E6;
    margin: 1px 0;
}
.kop-alamat {
    font-size: 9pt;
    margin: 1px 0;
}
.garis-ganda {
    border: none;
    border-top: 3px solid #000;
    border-bottom: 1px solid #000;
    height: 4px;
    margin: 5px 0 10px;
}

.laporan-judul {
    text-align: center;
    margin: 15px 0 5px;
}
.laporan-judul h1 {
    font-size: 13pt;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.laporan-subtitle {
    font-size: 10pt;
    color: #555;
    margin: 2px 0 0;
}

.laporan-meta {
    margin: 10px 0;
    font-size: 10pt;
    border-bottom: 1px solid #ccc;
    padding-bottom: 8px;
}
.laporan-meta table {
    width: auto;
    border-collapse: collapse;
}
.laporan-meta td {
    padding: 1px 8px 1px 0;
    vertical-align: top;
}
.laporan-meta .meta-label {
    font-weight: bold;
    width: 120px;
    color: #333;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 12px;
    font-size: 10pt;
    table-layout: fixed;
    word-wrap: break-word;
}
.data-table thead {
    display: table-header-group;
}
.data-table th,
.data-table td {
    border: 1px solid #000;
    padding: 4px 6px;
    vertical-align: top;
}
.data-table th {
    background-color: #e8e8e8;
    font-weight: bold;
    text-align: center;
    font-size: 10pt;
}
.data-table tr:nth-child(even) td {
    background-color: #f9f9f9;
}
.data-table .no {
    text-align: center;
    width: 30px;
}

.tanda-tangan-blok {
    margin-top: 30px;
    page-break-inside: avoid;
}
.tanda-tangan-blok table {
    width: 100%;
    border-collapse: collapse;
}
.tanda-tangan-blok td {
    width: 50%;
    vertical-align: top;
    text-align: center;
    padding: 0 20px;
}
.tanda-tangan-blok .ttd-jabatan {
    font-weight: bold;
    margin-bottom: 0;
}
.tanda-tangan-blok .ttd-en {
    font-style: italic;
    font-size: 9pt;
    color: #1447E6;
    margin: 0;
}
.tanda-tangan-blok .ttd-spacer {
    height: 65px;
}
.tanda-tangan-blok .ttd-nama {
    font-weight: bold;
    text-decoration: underline;
    margin: 0;
}
.tanda-tangan-blok .ttd-nip {
    font-size: 10pt;
    margin: 1px 0 0;
}

.cetak-info {
    margin-top: 20px;
    font-size: 9pt;
    color: #666;
    border-top: 1px solid #ccc;
    padding-top: 5px;
}
