# BLUEPRINT.md — SKPI Jayanusa

**Baca file ini SEBELUM mulai kerja. JANGAN generate ulang dari awal.**

Dibuat: 2026-07-10 | Update terakhir: 2026-07-10 (audit session)

---

## Progress FASE

| FASE | Status | Catatan |
|------|--------|---------|
| 1. DB Schema + Migration | ✅ | 13 tabel, `migrate:fresh --seed` sukses |
| 2. Rename akademis→validator | ✅ | Controllers, pages, routes, sidebar, types, request |
| 3. CRUD Aktivitas (mahasiswa) | ✅ | Controller + 4 pages + Google Drive link + conditional Juara/Tingkat |
| 4. Validasi Aktivitas (validator) | ✅ | Controller + 2 pages (index/show) + sidebar "Validasi" group |
| 5. Kompre Gate + Periode SKPI | ✅ | CRUD periode + kompreStatus/periodeAktif shared props + sidebar gate |
| 6. Pengajuan SKPI (mahasiswa) | ✅ | Centang aktivitas disetujui → submit + 3 pages |
| 7. Validasi SKPI + Cetak PDF | ✅ | SkpiController updated + SkpiPdfController updated |
| 8. Cleanup | ✅ | Hapus model/controller/page lama (Pengajuan, DetailPengajuan, BuktiKegiatan, MahasiswaPengajuanController) |

### Playwright Test Results
- ✅ Homepage loads
- ✅ Login validator → dashboard works
- ✅ Sidebar menu all `/validator/`
- ✅ Validasi Aktivitas page — shows aktivitas, approve works
- ✅ Periode SKPI page — CRUD works
- ✅ Terbitkan SKPI page — loads
- ✅ PDF preview — loads
- ✅ Login mahasiswa (API eksternal) — works with real credential
- ✅ Mahasiswa: tambah aktivitas (lomba + Juara/Tingkat)
- ✅ Mahasiswa: profil update
- ✅ Mahasiswa: Pengajuan SKPI checkbox submission
- ✅ Full E2E: mahasiswa input → validator approve → mahasiswa submit SKPI

### Catatan Penting
- `composer dump-autoload` WAJIB setelah hapus model file (autoload cache)
- Login mahasiswa butuh API eksternal — test dengan credential asli
- `catatan_akademis` → `catatan_validator` di semua file
- `nomor_ijazah` diisi oleh validator di Data Mahasiswa edit (bukan popup)
- `KategoriRequest` di namespace `Validator` (bukan `Akademis`)

---

## Status Saat Ini

Sistem SKPI V2 **berfungsi penuh**:
- Mahasiswa: login → aktivitas CRUD → pilih aktivitas → submit SKPI
- Validator: validasi aktivitas → periode SKPI → terbitkan SKPI → cetak PDF → pengambilan
- Ketua: dashboard + laporan

**78 test pass**, frontend build success. Full E2E flow verified via Playwright.

---

## REDESIGN V2 — Task dari Client (10 task)

**Sumber**: `TASK.md` — semua task WAJIB diimplementasi.

### Ringkasan Perubahan

| # | Task | Dampak |
|---|------|--------|
| 1 | Rename `akademis` → `validator` | Rename role enum + semua referensi |
| 2 | Setiap kegiatan = pengajuan terpisah → validator validasi per kegiatan | Redesign entity |
| 3 | Upload bukti via Google Drive link | Hapus file upload, ganti URL field |
| 4 | Validator lihat semua jurusan | Hapus filter jurusan untuk validator |
| 5 | Batasi yang ditampilkan di SKPI, upload tidak dibatasi | Terkait task 6 |
| 6 | Menu SKPI: centang kegiatan yang disetujui | 2 menu terpisah |
| 7 | Hanya mahasiswa lulus kompre yang bisa ajukan SKPI | Gate + field kompre |
| 8 | SKPI diajukan → validator cetak | Flow SKPI |
| 9 | Tabel periode SKPI | Tabel baru + validasi periode |
| 10 | Kategori tipe Lomba → field Juara + Tingkat | Tambah field conditional |

### Arsitektur Baru: 2 Entity Terpisah

```
┌─────────────────────────────────────────────────────────────────┐
│                     FLOW V2                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. INPUT AKTIVITAS (kapan saja, tidak terikat periode)         │
│     Mahasiswa → Tambah kegiatan + paste link Google Drive        │
│     → Submit per kegiatan → Status: menunggu                    │
│     → Validator validasi per kegiatan (approve/reject)           │
│     → Status: disetujui / ditolak                                │
│     * Jika kategori tipe=lomba → field Juara + Tingkat wajib    │
│                                                                  │
│  2. PILIH AKTIVITAS UNTUK SKPI (saat periode aktif)             │
│     Mahasiswa → Centang aktivitas yang disetujui                 │
│     → Submit Pengajuan SKPI                                      │
│     * Gate: hanya mahasiswa lulus kompre                         │
│     * Gate: hanya saat periode SKPI aktif                        │
│                                                                  │
│  3. VALIDASI SKPI                                                │
│     Validator → Review pilihan mahasiswa → Approve/Reject        │
│                                                                  │
│  4. CETAK SKPI                                                   │
│     Validator → Cetak PDF SKPI (hanya aktivitas yang dipilih)    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Struktur DB Baru

#### Tabel Baru: `aktivitas` (ganti `pengajuan` + `detail_pengajuan`)
```sql
CREATE TABLE aktivitas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    mahasiswa_id BIGINT UNSIGNED NOT NULL,
    kategori_id BIGINT UNSIGNED NOT NULL,
    nama_kegiatan VARCHAR(255) NOT NULL,
    tahun_kegiatan VARCHAR(4) NOT NULL,
    peran VARCHAR(100) NOT NULL,
    bukti_link VARCHAR(500) NULL,           -- Google Drive URL
    juara VARCHAR(50) NULL,                 -- Hanya jika kategori tipe=lomba
    tingkat ENUM('universitas','wilayah','nasional','internasional') NULL,  -- Hanya jika kategori tipe=lomba
    status ENUM('menunggu','disetujui','ditolak') DEFAULT 'menunggu',
    catatan_validator TEXT NULL,
    created_at TIMESTAMP, updated_at TIMESTAMP,
    FOREIGN KEY (mahasiswa_id) REFERENCES mahasiswa(id) ON DELETE CASCADE,
    FOREIGN KEY (kategori_id) REFERENCES kategori(id) ON DELETE RESTRICT
);
```

#### Tabel Baru: `pengajuan_skpi` (ganti `pengajuan` lama untuk SKPI)
```sql
CREATE TABLE pengajuan_skpi (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    mahasiswa_id BIGINT UNSIGNED NOT NULL,
    periode_skpi_id BIGINT UNSIGNED NOT NULL,
    no_registrasi VARCHAR(255) UNIQUE NULL,
    tgl_pengajuan DATE NULL,
    status ENUM('menunggu','disetujui','revisi','ditolak') DEFAULT 'menunggu',
    catatan_validator TEXT NULL,
    created_at TIMESTAMP, updated_at TIMESTAMP,
    FOREIGN KEY (mahasiswa_id) REFERENCES mahasiswa(id) ON DELETE CASCADE,
    FOREIGN KEY (periode_skpi_id) REFERENCES periode_skpi(id) ON DELETE RESTRICT
);
```

#### Tabel Baru: `pengajuan_skpi_aktivitas` (pivot)
```sql
CREATE TABLE pengajuan_skpi_aktivitas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pengajuan_skpi_id BIGINT UNSIGNED NOT NULL,
    aktivitas_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP, updated_at TIMESTAMP,
    FOREIGN KEY (pengajuan_skpi_id) REFERENCES pengajuan_skpi(id) ON DELETE CASCADE,
    FOREIGN KEY (aktivitas_id) REFERENCES aktivitas(id) ON DELETE CASCADE,
    UNIQUE KEY unique_pengajuan_aktivitas (pengajuan_skpi_id, aktivitas_id)
);
```

#### Tabel Baru: `periode_skpi`
```sql
CREATE TABLE periode_skpi (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,             -- Contoh: "Periode Juli 2026"
    tgl_mulai DATE NOT NULL,
    tgl_selesai DATE NOT NULL,
    status ENUM('aktif','nonaktif') DEFAULT 'aktif',
    created_at TIMESTAMP, updated_at TIMESTAMP
);
```

#### Perubahan Tabel Existing

**`kategori`** — tambah field:
```sql
ALTER TABLE kategori ADD COLUMN tipe ENUM('lomba','lainnya') DEFAULT 'lainnya';
```

**`mahasiswa`** — tambah field:
```sql
ALTER TABLE mahasiswa ADD COLUMN kompre_status BOOLEAN NULL DEFAULT NULL;
ALTER TABLE mahasiswa ADD COLUMN kompre_tanggal DATE NULL;
```

**`skpi`** — ubah FK:
```sql
-- ganti pengajuan_id → pengajuan_skpi_id
ALTER TABLE skpi DROP FOREIGN KEY skpi_pengajuan_id_foreign;
ALTER TABLE skpi CHANGE pengajuan_id pengajuan_skpi_id BIGINT UNSIGNED NOT NULL;
ALTER TABLE skpi ADD FOREIGN KEY (pengajuan_skpi_id) REFERENCES pengajuan_skpi(id) ON DELETE CASCADE;
```

#### Tabel Dihapus
- `pengajuan` — diganti `aktivitas` + `pengajuan_skpi`
- `detail_pengajuan` — merged ke `aktivitas`
- `bukti_kegiatan` — diganti field `bukti_link` di `aktivitas`

#### Tabel Tetap
- `users`, `identitas_pt`, `jurusan`, `mahasiswa` (tambah field), `kategori` (tambah field), `skpi` (ubah FK), `pengambilan`

### Perubahan Role

| Lama | Baru | Dampak |
|------|------|--------|
| `akademis` | `validator` | `users.role` enum, middleware, sidebar, controllers, routes, pages, tests |

**File yang perlu diubah** (rename `akademis` → `validator`):
- `database/migrations/*_create_users_table.php`
- `database/seeders/UserSeeder.php`
- `database/factories/UserFactory.php`
- `app/Http/Middleware/RoleMiddleware.php`
- `app/Http/Middleware/HandleInertiaRequests.php`
- `app/Http/Responses/LoginResponse.php`
- `routes/web.php` (prefix `akademis` → `validator`)
- Semua controller di `app/Http/Controllers/Akademis/` → `app/Http/Controllers/Validator/`
- Semua page di `resources/js/pages/akademis/` → `resources/js/pages/validator/`
- `resources/js/components/app-sidebar.tsx`
- `resources/js/components/user-menu-content.tsx`
- Semua test yang referensi `akademis`
- `PROJECT.md`, `BLUEPRINT.md`

### Perubahan Menu Mahasiswa

**Lama**: 1 menu "Pengajuan SKPI" (disabled jika profil belum lengkap)

**Baru**: 2 menu terpisah:
1. **"Aktivitas Saya"** — CRUD aktivitas kapan saja, tidak terikat periode
2. **"Pengajuan SKPI"** — centang aktivitas disetujui → submit SKPI (gate: kompre + periode aktif)

### Perubahan Menu Validator

**Lama**: Master → [Dashboard, Data Mahasiswa, Kategori, Identitas PT, Jurusan], Transaksi → [Pengajuan, Pengambilan, Terbitkan SKPI], Laporan → [Laporan]

**Baru**: 
- Master → [Dashboard, Data Mahasiswa, Kategori, Identitas PT, Jurusan]
- Validasi → [Validasi Aktivitas, Validasi SKPI]
- SKPI → [Terbitkan SKPI, Pengambilan, Periode SKPI]
- Laporan → [Laporan]

### Upload Bukti: File → Google Drive

**Lama**: File upload ke `storage/app/public/bukti-kegiatan/`
**Baru**: Input URL Google Drive → simpan di `aktivitas.bukti_link`

**Validasi URL**:
```php
'bukti_link' => ['nullable', 'url', 'regex:/drive\.google\.com/']
```

**Tampilan**: Link clickable di tabel, bukan preview gambar.

### Gate: Lulus Kompre

**Field**: `mahasiswa.kompre_status` (nullable boolean) + `mahasiswa.kompre_tanggal` (nullable date)

**Sumber data** (prioritas):
1. **API eksternal** (saat API sudah siap) — auto-sync
2. **Manual validator** — edit di halaman Data Mahasiswa

**Gate logic**:
```php
// Di middleware atau controller
if (!$mahasiswa->kompre_status) {
    return back()->with('error', 'Anda belum lulus kompre.');
}
```

**Menu SKPI**: disabled + tooltip jika `kompre_status !== true`

### Periode SKPI

**Tabel**: `periode_skpi` (lihat schema di atas)

**CRUD**: Validator bisa create/edit/hapus periode

**Validasi saat submit SKPI**:
```php
$periode = PeriodeSkpi::where('status', 'aktif')
    ->where('tgl_mulai', '<=', now())
    ->where('tgl_selesai', '>=', now())
    ->first();

if (!$periode) {
    return back()->with('error', 'Tidak ada periode SKPI yang aktif.');
}
```

**Menu mahasiswa**: "Pengajuan SKPI" disabled jika tidak ada periode aktif

### Kategori Tipe Lomba

**Field**: `kategori.tipe` enum(`lomba`, `lainnya`)

**Conditional fields di form aktivitas**:
- Jika kategori tipe=`lomba` → tampilkan field Juara (text) + Tingkat (select: universitas/wilayah/nasional/internasional)
- Jika kategori tipe=`lainnya` → sembunyikan field tersebut

**Validasi**:
```php
'juara' => ['nullable', 'string', 'max:50'],
'tingkat' => ['nullable', 'in:universitas,wilayah,nasional,internasional'],
```

**Di SKPI PDF**: Kolom Juara + Tingkat hanya tampil untuk baris tipe lomba.

---

## Phased Execution Plan

### FASE 1: Foundation (DB Schema + Migration)
**Tujuan**: Struktur DB baru, tanpa hapus data lama (fresh migration)

1. Buat migration baru:
   - `create_aktivitas_table.php`
   - `create_pengajuan_skpi_table.php`
   - `create_pengajuan_skpi_aktivitas_table.php`
   - `create_periode_skpi_table.php`
   - Alter `kategori` (tambah `tipe`)
   - Alter `mahasiswa` (tambah `kompre_status`, `kompre_tanggal`)
   - Alter `skpi` (ubah FK)
   - Drop `pengajuan`, `detail_pengajuan`, `bukti_kegiatan`
2. Update Model Eloquent
3. Update Factories
4. Run `php artisan migrate:fresh`
5. **Playwright test**: cek halaman masih bisa diakses (akan error karena controller belum update)

### FASE 2: Rename Role `akademis` → `validator`
**Tujuan**: Semua referensi role konsisten

1. Update migration users (enum)
2. Rename folder controller `Akademis/` → `Validator/`
3. Rename folder pages `akademis/` → `validator/`
4. Update routes, middleware, sidebar, login response
5. Update seeders, factories
6. Update semua test
7. Run `php artisan test --compact`
8. **Playwright test**: login validator, cek dashboard

### FASE 3: CRUD Aktivitas (Mahasiswa)
**Tujuan**: Mahasiswa bisa input aktivitas kapan saja

1. Buat `AktivitasController` (mahasiswa side)
2. Buat pages: `mahasiswa/aktivitas/{index,create,edit,show}.tsx`
3. Form: kategori select → conditional Juara + Tingkat
4. Upload: input Google Drive link (bukan file)
5. Submit per kegiatan → status `menunggu`
6. Update sidebar: menu "Aktivitas Saya"
7. Run test
8. **Playwright test**: login mahasiswa, tambah aktivitas, cek tampil

### FASE 4: Validasi Aktivitas (Validator)
**Tujuan**: Validator bisa approve/reject per aktivitas

1. Buat `ValidasiAktivitasController` (validator side)
2. Buat pages: `validator/validasi-aktivitas/{index,show}.tsx`
3. Filter: semua jurusan, status menunggu
4. Aksi: approve/reject + catatan
5. Run test
6. **Playwright test**: login validator, approve aktivitas

### FASE 5: Kompre Gate + Periode SKPI
**Tujuan**: Gate untuk pengajuan SKPI

1. CRUD Periode SKPI (validator side)
2. Field `kompre_status` di Data Mahasiswa (validator edit)
3. Gate logic: kompre + periode aktif
4. Update sidebar: menu "Pengajuan SKPI" disabled jika tidak memenuhi gate
5. Run test
6. **Playwright test**: cek gate bekerja

### FASE 6: Pengajuan SKPI (Mahasiswa)
**Tujuan**: Mahasiswa centang aktivitas → submit SKPI

1. Buat `MahasiswaSkpiController`
2. Buat pages: `mahasiswa/skpi/{index,ajukan}.tsx`
3. Page "Pengajuan SKPI": daftar aktivitas disetujui + checkbox
4. Submit → buat `pengajuan_skpi` + pivot records
5. Run test
6. **Playwright test**: centang aktivitas, submit SKPI

### FASE 7: Validasi SKPI + Cetak (Validator)
**Tujuan**: Validator approve SKPI + cetak PDF

1. Buat `ValidasiSkpiController`
2. Buat pages: `validator/validasi-skpi/{index,show}.tsx`
3. Aksi: approve/reject SKPI
4. Update SkpiPdfController: data dari `pengajuan_skpi` + pivot
5. Update SKPI PDF template: kolom Juara + Tingkat untuk tipe lomba
6. Run test
7. **Playwright test**: validator approve SKPI, cetak PDF

### FASE 8: Cleanup + Final Testing
**Tujuan**: Bersih-bersih, test menyeluruh

1. Hapus file lama yang tidak dipakai
2. Update seeders (data dummy baru)
3. Update tests (66 test lama → sesuai schema baru)
4. Full regression test
5. **Playwright test**: full flow end-to-end
6. Update PROJECT.md + BLUEPRINT.md

---

## Checklist Per Fase

Setiap fase:
- [ ] Playwright test — flow sesuai ekspektasi
- [ ] Update PROJECT.md + BLUEPRINT.md

---

## Known Issues & Solutions (Existing)

### 1. Multi-file Upload Bug
**Masalah**: `useForm` + `forceFormData: true` tidak serialize nested array dengan File objects.
**Solusi**: Manual `FormData` construction.
**Status**: TIDAK RELEVAN LAGI — upload diganti Google Drive link.

### 2. dompdf Limitations
- Tidak support flexbox → pakai `<table>` untuk layout
- `page-break-after: always` untuk paksa halaman baru
- `display: table-header-group` pada `<thead>` untuk header terulang
- `page-break-inside: avoid` untuk cegah elemen terpotong
- Image harus base64 encode untuk local files

### 3. Config Cache Issue
**Masalah**: Setelah install package baru, test gagal karena config cache stale.
**Solusi**: `php artisan config:clear` sebelum test.

### 4. PowerShell Commands
- Gunakan `;` bukan `&&`
- Gunakan `npx.cmd` bukan `npm`

---

## Yang Sudah Dicoba & Gagal (JANGAN Ulangi)

1. **Flexbox di PDF dompdf** — tidak dirender
2. **`forceFormData: true`** dari `useForm` untuk nested array + File — hanya kirim 1 file
3. **`page-break-after: always`** di tengah konten tanpa `page-break-inside: avoid` — tabel terpotong
4. **Font terlalu kecil** (9pt) untuk isi halaman 1 — user complain
5. **Spacing terlalu besar** di halaman 1 — overflow ke halaman 2
6. **`nomor_ijazah` required di profil** — semester 2 belum punya

---

## Test Suite

**78 test pass** (Pest). Semua test sudah ditulis ulang untuk schema V2.

Test files:
- `DashboardTest.php` — 6 test (mahasiswa/validator/ketua dashboard access)
- `RoleMiddlewareTest.php` — 5 test (role guard)
- `MahasiswaAktivitasTest.php` — 12 test (CRUD aktivitas + lomba conditional)
- `ValidatorValidasiAktivitasTest.php` — 6 test (approve/reject)
- `MahasiswaPengajuanSkpiTest.php` — 8 test (kompre gate + periode + submit)
- `ValidatorSkpiTest.php` — 7 test (terbitkan/batalkan SKPI)
- `ValidatorCrudTest.php` — 4 test (master data CRUD)
- `ValidatorPengambilanTest.php` — 3 test (pengambilan)
- `ValidatorPeriodeSkpiTest.php` — 8 test (periode SKPI CRUD)
- `MahasiswaProfileTest.php` — 3 test (profil update)
- `LaporanTest.php` — 4 test (laporan filters)
- `Auth/AuthenticationTest.php` — 5 test (login/logout)
- `Settings/*.php` — 7 test (settings)

---

## Checklist Sebelum Selesai Sesi

- [ ] Playwright test — flow utama berfungsi
- [ ] `PROJECT.md` di-update
- [ ] `BLUEPRINT.md` di-update
- [ ] User konfirmasi perubahan terlihat di browser
