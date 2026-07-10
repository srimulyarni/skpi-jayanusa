# Analisa Desain Dokumen SKPI (dari wireframe draw.io client)

_Revisi 2 — setelah review Claude Code_

**Konteks:** Wireframe ini adalah _preview dokumen_ SKPI (Image 1: halaman lanjutan — daftar aktivitas + pengesahan; Image 2: halaman cover — identitas). Dipakai baik oleh mahasiswa (untuk download) maupun akademis (untuk cek sebelum terbitkan). Header biru "Sistem Informasi SKPI Jayanusa" adalah UI dashboard, bukan bagian dari isi PDF.

---

## 0. Arsitektur Render — PALING PENTING

**Masalah:** Kalau preview di aplikasi dan PDF final di-render dari komponen yang sama (misal komponen React yang sama dipakai untuk keduanya), ini rawan bug — styling yang oke di browser sering berantakan jadi PDF (font, page-break, margin).

**Rekomendasi:**

- **Preview di app** = komponen React biasa (dalam frame dashboard, ada tombol Cetak/Download).
- **PDF generation** = template terpisah (Blade view khusus, di-render via `dompdf` atau `browsershot`), tidak reuse komponen React.
- Header biru + tombol aksi TIDAK ikut ke PDF. PDF mulai langsung dari kop surat institusi.
- Kedua render path harus sinkron datanya (dari backend yang sama) tapi templating-nya independen.

---

## 1. Halaman 1 — Cover / Identitas (Image 2)

### Kop surat

- Logo sekarang berdiri sendiri di kiri, terpisah dari blok teks institusi → kurang menyatu. Perbaikan: logo + teks nama institusi disatukan dalam satu baris (flex), logo proporsional terhadap ukuran teks judul.
- Garis pembatas kop surat cuma 1 garis tipis. Standar surat resmi Indonesia: **garis ganda** (tebal di atas, tipis di bawah, jarak ~1-2mm).

### Judul & nomor SKPI

- Judul + subtitle "Bachelor Supplement" sudah oke.
- Nomor SKPI (`SKPI/XXXX/XX/XXXX/XXX`) di-highlight abu-abu di wireframe (menandakan placeholder) — pastikan di PDF final background ini dihilangkan, jadi teks normal.

### Paragraf dasar hukum (KKNI, Permendikbudristek No. 6/2022)

- Perlu line-height & margin bawah lebih lega, sekarang terasa menempel ke tabel di bawahnya.
- Typo di teks wireframe: "Kerang kaKualifikasi" → seharusnya "Kerangka Kualifikasi". Pastikan diperbaiki di implementasi.

### Tabel Identitas Diri & Identitas Penyelenggara

- Struktur 2 blok terpisah sudah tepat sesuai standar SKPI Dikti.
- Field wajib mengacu Permendikbudristek No. 6/2022 — identitas lulusan (nama, NIM/NOBP, tempat/tgl lahir, program studi), capaian pembelajaran, ringkasan kegiatan mahasiswa. **NIK dan foto mahasiswa TIDAK termasuk field wajib SKPI** (SKPI bukan dokumen identitas seperti KTP) — dicoret dari rekomendasi, jangan jadi prioritas.
    - Field "AKREDITASI" di wireframe sudah cukup sebagai satu field — **tidak perlu dipecah** jadi "Nomor SK Akreditasi" + "Masa Berlaku Akreditasi" terpisah kecuali memang ada permintaan eksplisit dari client. Rekomendasi sebelumnya dicoret, tidak berdasar dari wireframe maupun regulasi.
- Format baris sekarang pakai garis kosong panjang gaya form kertas manual. Untuk versi digital: ganti ke grid 2 kolom (label rata kanan, value rata kiri) — lebih rapi.

---

## 2. Halaman 2 — Lanjutan: Daftar Aktivitas & Pengesahan (Image 1)

### Tabel "Daftar Aktivitas, Prestasi dan Kegiatan"

ini dari tabel kita saja yang sudah ada

### Bagian Pengesahan SKPI

- Header "PENGESAHAN SKPI" / "SKPI Legalization" pakai 2 baris background abu-abu solid — terlalu berat untuk section divider. Ganti: satu baris bold + garis bawah, subtitle italic tanpa background block.
- "Padang, DD-MM-YYYY" harus merujuk **tanggal SKPI diterbitkan**, bukan tanggal cetak/download — penting untuk validitas legal saat mahasiswa download berkali-kali.
- Blok tanda tangan (Ketua STMIK-AMIK Jayanusa / NIDN) butuh:
    - Ruang kosong ±3-4cm di atas nama, untuk tanda tangan basah (proses manual) atau tanda tangan digital/QR (proses online).
    - Nama ketua bold + garis bawah, NIDN aktual di bawahnya (field dinamis, bukan placeholder statis "NIDN").

### Elemen tambahan (revisi prioritas)

- **QR code verifikasi** — turun dari "sedang" ke **"nice to have"**. Tidak perlu integrasi PDDikti nasional — cukup halaman verifikasi publik internal (`domain-kampus/verifikasi-skpi?no=XXX`) yang cek ke database sendiri. Tapi ini tetap scope tambahan (halaman baru + endpoint publik) yang belum jadi kebutuhan mendesak dibanding fitur inti — ditunda sampai fitur prioritas 1-6 selesai.
- ~~Footer keterangan keabsahan digital~~ — **dicoret**. Karena flow resmi sistem ini masih pakai tanda tangan basah + cap pimpinan (proses manual), klaim "dokumen ini sah secara digital tanpa cap basah" berpotensi menyesatkan secara hukum. Jangan pasang klaim keabsahan di preview/PDF sampai ada keputusan institusional eksplisit bahwa versi digital dianggap sah tanpa tanda tangan basah.
- **Nomor halaman** ("Halaman 1 dari 2") tetap relevan — tapi jumlah halaman harus dianggap **dinamis**, bukan tetap 2 halaman (lihat poin di bawah).

---

## 3. Yang Sebelumnya Terlewat (dari review Claude Code)

### Sumber data tiap bagian dokumen

- Identitas mahasiswa → tabel `mahasiswa`
- Identitas penyelenggara → tabel `identitas_pt`
- Daftar kegiatan → `detail_pengajuan` + kategori
- ~~Capaian pembelajaran (learning outcomes)~~ — **dicoret**. Tidak ada di wireframe, tidak wajib untuk implementasi pertama. Bisa ditambah di fase berikut kalau ada kebutuhan dari akademik.

### Jumlah halaman dinamis

- Wireframe client menampilkan 2 halaman (cover + aktivitas) sebagai ilustrasi, **bukan batasan sistem**. Kalau daftar kegiatan mahasiswa panjang (15+ item), dokumen bisa jadi 3-4 halaman. Page-break handling tabel aktivitas (sudah disebut di atas) jadi kebutuhan struktural, bukan sekadar catatan tambahan.

### Cetak batch

- Kalau ada puluhan SKPI yang harus ditandatangani pimpinan sekaligus (mis. akhir semester), akademis butuh cetak batch — bukan buka dokumen satu per satu. Masuk sebagai fitur efisiensi di halaman "Terbitkan SKPI" / "Kelola Pengambilan", misalnya checkbox multi-select + tombol "Cetak Terpilih" yang generate 1 PDF gabungan atau ZIP berisi PDF per mahasiswa.

---

## Ringkasan Prioritas Implementasi (revisi)

| Prioritas | Item                                                                         | Alasan                                          |
| --------- | ---------------------------------------------------------------------------- | ----------------------------------------------- |
| 1         | Render path terpisah (Blade + dompdf/browsershot)                            | Fondasi — tanpa ini PDF tidak bisa dibuat       |
| 2         | Template SKPI sesuai regulasi (field wajib Permendikbudristek No. 6/2022)    | Kepatuhan regulasi                              |
| 3         | Tabel aktivitas terstruktur + page-break handling (halaman dinamis)          | Substansi dokumen                               |
| 4         | Flow pengambilan: mahasiswa download (konfirmasi) + akademis "Sudah Diambil" | Workflow selesai                                |
| 5         | Preview dokumen di halaman mahasiswa                                         | UX                                              |
| 6         | Cetak batch untuk akademis                                                   | Efisiensi proses tanda tangan pimpinan          |
| 7         | QR code verifikasi (halaman verifikasi internal)                             | Nice to have, ditunda sampai fitur inti selesai |

**Dicoret dari rekomendasi (over-engineering / tidak berdasar dari wireframe atau regulasi):**

- Field NIK dan foto mahasiswa di identitas SKPI — tidak diatur dalam regulasi, SKPI bukan dokumen identitas.
- Pemecahan field "AKREDITASI" jadi "Nomor SK Akreditasi" + "Masa Berlaku Akreditasi" — wireframe sudah cukup dengan satu field, tidak ada dasar kebutuhan untuk dipecah.
- Footer klaim "sah secara digital tanpa cap basah" — menyesatkan selama proses resmi masih pakai tanda tangan basah + cap pimpinan.
- ~~Capaian pembelajaran~~ — tidak ada di wireframe, tidak wajib untuk implementasi pertama. Tidak jadi blocker.
