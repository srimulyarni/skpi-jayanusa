@page {
    margin: 1.5cm 2cm;
    size: A4;
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

.judul {
    text-align: center;
    margin-bottom: 4px;
}
.judul h1 {
    font-size: 13pt;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.judul .subtitle {
    font-size: 10.5pt;
    font-style: italic;
    color: #1447E6;
    margin: 2px 0 0;
}
.nomor {
    text-align: center;
    font-size: 11pt;
    margin-bottom: 10px;
}

.dasar-hukum {
    text-align: justify;
    margin-bottom: 12px;
    font-size: 10.5pt;
    line-height: 1.5;
    text-indent: 25px;
}

.section-title {
    font-weight: bold;
    font-size: 11pt;
    margin: 10px 0 5px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
}
.section-title .en {
    font-weight: normal;
    font-style: italic;
    font-size: 9.5pt;
    color: #1447E6;
    display: block;
    text-transform: none;
    margin-top: 1px;
}

.identitas-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 4px;
    font-size: 10.5pt;
    page-break-inside: avoid;
}
.identitas-table td {
    padding: 2px 4px;
    vertical-align: top;
}
.identitas-table .label {
    width: 190px;
}
.identitas-table .label .en {
    font-weight: normal;
    font-style: italic;
    font-size: 8.5pt;
    color: #1447E6;
    display: block;
}
.identitas-table .separator {
    width: 15px;
    text-align: center;
}

.aktivitas-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 12px;
    font-size: 10pt;
}
.aktivitas-table thead {
    display: table-header-group;
}
.aktivitas-table th,
.aktivitas-table td {
    border: 1px solid #000;
    padding: 4px 5px;
    vertical-align: top;
}
.aktivitas-table th {
    background-color: #f0f0f0;
    font-weight: bold;
    text-align: center;
    font-size: 10pt;
}
.aktivitas-table th .en {
    font-weight: normal;
    font-style: italic;
    font-size: 8.5pt;
    color: #1447E6;
}
.aktivitas-table td.no {
    text-align: center;
    width: 28px;
}
.aktivitas-table td.tahun {
    text-align: center;
    width: 45px;
}

.pengesahan {
    margin-top: 20px;
    page-break-inside: avoid;
}
.pengesahan-header {
    font-weight: bold;
    font-size: 11pt;
    text-transform: uppercase;
    border-bottom: 2px solid #000;
    padding-bottom: 2px;
    margin-bottom: 2px;
}
.pengesahan-header .en {
    font-weight: normal;
    font-style: italic;
    font-size: 9.5pt;
    color: #1447E6;
    text-transform: none;
    margin-left: 5px;
}
.tanda-tangan {
    float: right;
    width: 230px;
    text-align: center;
    margin-top: 8px;
}
.tanda-tangan .en {
    font-weight: normal;
    font-style: italic;
    font-size: 8.5pt;
    color: #1447E6;
}
.ttd-spacer {
    height: 65px;
}
.ttd-nama {
    font-weight: bold;
    text-decoration: underline;
}
.ttd-nidn {
    font-size: 10pt;
    margin-top: 1px;
}
.clearfix::after {
    content: "";
    display: table;
    clear: both;
}
.kosong {
    text-align: center;
    font-style: italic;
    color: #666;
    padding: 15px;
}
