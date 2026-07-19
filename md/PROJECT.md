# SKPI Jayanusa

Sistem pengelolaan SKPI untuk Yayasan Jayanusa (STMIK, AMIK, AKPER). Flow: mahasiswa input aktivitas → validator validasi → mahasiswa pilih aktivitas untuk SKPI → validator approve SKPI → cetak PDF.

---

## Aturan Kerja

- Komentar `//` DILARANG kecuali hal yang benar-benar tidak obvious
- WAJIB gunakan Context7 atau `search-docs` untuk referensi Laravel/packages — DILARANG asumsi
- WAJIB update PROJECT.md setiap selesai mengerjakan sesuatu
- Baca `BLUEPRINT.md` sebelum mulai kerja — JANGAN generate dari awal
- Diskusi dulu sebelum coding jika user minta diskusi
- Gunakan bahasa Indonesia untuk komunikasi
- Test + build cukup di akhir fase, bukan setiap perubahan kecil

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Backend | Laravel 13.x, PHP 8.4 |
| Frontend | React 19 + TypeScript via Inertia.js v3 |
| CSS | Tailwind CSS v4 (`@tailwindcss/vite`) |
| UI | shadcn/ui (New York), Radix UI, Lucide React |
| Tables | TanStack Table |
| Routing | Inertia.js + Wayfinder (type-safe) |
| Auth | Fortify (admin: username/password), Custom (mahasiswa: NOBP + API eksternal) |
| Build | Vite 8, `laravel-vite-plugin` |
| PDF | `barryvdh/laravel-dompdf` v3.1.2 |
| DB | MySQL/MariaDB (Laragon) |
| Font | Instrument Sans (Bunny CDN) |

---

## Database

**13 tabel**: `users`, `identitas_pt`, `jurusan`, `kategori`, `mahasiswa`, `aktivitas`, `pengajuan_skpi`, `pengajuan_skpi_aktivitas`, `periode_skpi`, `skpi`, `pengambilan`, `sessions`, `cache/jobs`

**Relasi utama**:
- `identitas_pt` → 1:N → `jurusan` → 1:N → `mahasiswa`
- `mahasiswa` → 1:N → `aktivitas` → N:1 → `kategori`
- `mahasiswa` → 1:N → `pengajuan_skpi` → M:N → `aktivitas` (pivot)
- `pengajuan_skpi` → N:1 → `periode_skpi`
- `pengajuan_skpi` → 1:1 → `skpi` → 1:1 → `pengambilan`
- `skpi` → N:1 → `identitas_pt`
- `users` → 1:1 → `mahasiswa`

**Enum/Constraint penting**:
- `users.role`: `mahasiswa`, `validator`, `ketua`
- `kategori.tipe`: `lomba`, `lainnya`
- `aktivitas.status`: `menunggu`, `disetujui`, `ditolak`
- `aktivitas.tingkat`: `universitas`, `wilayah`, `nasional`, `internasional` (nullable)
- `pengajuan_skpi.status`: `menunggu`, `disetujui`, `revisi`, `ditolak`
- `periode_skpi.status`: `aktif`, `nonaktif`
- `skpi.status`: `draft`, `diterbitkan`, `dibatalkan`
- `pengambilan.status`: `belum_diambil`, `sudah_diambil`
- `mahasiswa.kompre_status`: nullable boolean
- `mahasiswa.nomor_ijazah`: nullable (diisi oleh validator di Data Mahasiswa edit)

---

## Autentikasi

**Admin (validator/ketua)**: Fortify, `username` + `password` → `LoginResponse` redirect by role. `lowercase_usernames: true`.

**Mahasiswa**: Custom `MahasiswaLoginController` → `JayanusaAuthService` POST ke `https://api.novinaldi.my.id/api/login-voting` → `FindOrCreateMahasiswaAction` buat User+Mahasiswa jika baru. SSL verification disabled, timeout 20s.

**Profile completeness** (`HandleInertiaRequests` → `auth.isProfileLengkap`):
- Field wajib: `tempat_lahir`, `tanggal_lahir`, `jk`, `nohp`, `alamat`
- `nomor_ijazah` TIDAK wajib (diinput via popup saat Ajukan SKPI)
- Sidebar disable menu Pengajuan SKPI + toast warning jika belum lengkap

---

## Business Rules

### Flow SKPI V2
1. **Input Aktivitas** (kapan saja, tidak terikat periode): mahasiswa tambah kegiatan + link Google Drive → submit per kegiatan → validator validasi per kegiatan
2. **Pilih Aktivitas untuk SKPI** (saat periode aktif + kompre lulus): mahasiswa centang aktivitas yang sudah disetujui → submit Pengajuan SKPI
3. **Validasi SKPI**: validator approve/reject pengajuan SKPI
4. **Cetak SKPI**: validator cetak PDF (hanya aktivitas yang dipilih)

### Gate
- Menu "Pengajuan SKPI" disabled jika:
  - Profil belum lengkap
  - `kompre_status !== true`
  - Tidak ada periode SKPI aktif
- Hanya mahasiswa lulus kompre yang bisa ajukan SKPI
- SKPI hanya bisa diajukan saat periode aktif
- Input aktivitas bisa kapan saja (tidak terikat periode)

### Constraints
- Mahasiswa hanya boleh punya 1 pengajuan SKPI aktif (`menunggu`/`disetujui`)
- Aktivitas `disetujui` tidak bisa diedit/dihapus oleh mahasiswa
- Aktivitas `ditolak`/`menunggu` bisa diedit (reset ke `menunggu`)
- Format no SKPI: `SKPI/{YYYY}/{MM}/{0001}/{KODE_INSTITUSI}` (auto-generate)
- Format no registrasi: `REG/{YYYY}/{MM}/{0001}` (auto-generate)
- Terbitkan SKPI: hanya untuk pengajuan `disetujui`, dicegah duplikat
- Batalkan SKPI: tolak jika sudah `dibatalkan` atau sudah `sudah_diambil`
- Terbitkan SKPI → auto-create Pengambilan (`belum_diambil`)
- Admin mahasiswa: index/edit/update/destroy saja (no create — auto dari login)
- Hapus master data dicegah: Jurusan, Kategori, IdentitasPT (jika masih dipakai)
- Validator lihat semua jurusan (tidak filter)
- Upload bukti via Google Drive link (bukan file upload)
- Kategori tipe `lomba` → field Juara + Tingkat wajib di form aktivitas
- Maksimal aktivitas per pengajuan SKPI ditentukan oleh `periode_skpi.max_aktivitas` (default 10, bisa diubah admin per periode)

---

## Routes

**Prefix & Role**:
- `/mahasiswa` → role:mahasiswa
- `/validator` → role:validator
- `/ketua` → role:ketua
- `/settings` → auth (semua role), UI hidden untuk mahasiswa

**Mahasiswa**:
| Method | URI | Handler |
|--------|-----|---------|
| GET/POST | `/mahasiswa/login` | `MahasiswaLoginController` |
| GET | `/mahasiswa/dashboard` | Inertia |
| GET/PUT | `/mahasiswa/profil` | `MahasiswaProfileController` |
| GET/POST | `/mahasiswa/aktivitas` | `MahasiswaAktivitasController@index\|@store` |
| GET/PUT/DELETE | `/mahasiswa/aktivitas/{aktivitas}` | `@show\|@update\|@destroy` |
| GET | `/mahasiswa/aktivitas/{aktivitas}/edit` | `@edit` |
| GET/POST | `/mahasiswa/skpi` | `MahasiswaPengajuanSkpiController@index\|@store` |
| GET | `/mahasiswa/skpi/create` | `@create` |
| GET | `/mahasiswa/skpi/{pengajuanSkpi}` | `@show` |

**Validator**:
- CRUD: kategori, jurusan, identitas-pt, mahasiswa (tanpa create/store)
- Validasi Aktivitas: index, show, `{id}/approve` (PATCH), `{id}/reject` (PATCH)
- Periode SKPI: index, create, store, edit, update, destroy
- SKPI: index, store, `{id}/batalkan` (PATCH)
- SKPI PDF: `{id}/pdf` (preview), `{id}/pdf/download` (download)
- Pengambilan: index, `{id}/ambil` (PATCH)
- Laporan: index

**Ketua**: dashboard (inertia), laporan (`LaporanController@index`)

**Settings**: profile (GET/PATCH), security (GET), password (PUT, throttle 6,1), appearance (inertia)

---

## Sidebar Navigation

**Mahasiswa**: [Dashboard, Profil Saya, Aktivitas Saya, Pengajuan SKPI (disabled jika gate tidak terpenuhi)]

**Validator**: 
- Master → [Dashboard, Data Mahasiswa, Kategori Kegiatan, Identitas PT, Jurusan]
- Validasi → [Validasi Aktivitas]
- Transaksi → [Terbitkan SKPI, Pengambilan, Periode SKPI]
- Laporan → [Laporan]

**Ketua**: [Dashboard, Laporan]

---

## Seeders

**Normal (daily dev)**:
```bash
php artisan migrate:fresh --seed
```
- `IdentitasPtSeeder`: 3 institusi (STMIK, AMIK, AKPER)
- `JurusanSeeder`: 3 jurusan (MI→AMIK, SI→STMIK, SK→STMIK)
- `KategoriSeeder`: 8 kategori (tipe: lomba untuk "Kompetisi dan Lomba")
- `UserSeeder`: admin `validator`/`password`, `ketua`/`password`
- `DummyDataSeeder`: 4 mahasiswa (2 kompre, 2 belum), 6 aktivitas, 1 periode SKPI, 1 pengajuan SKPI + SKPI terbit

---

## Perintah

```bash
php artisan migrate:fresh --seed
php artisan config:clear
composer dump-autoload
npx.cmd vite build
php artisan route:clear
```

---

## Fitur Selesai

- Login (admin + mahasiswa via API eksternal)
- Role `validator` (bukan `akademis`)
- Profil mahasiswa (tanpa nomor_ijazah wajib)
- Aktivitas: CRUD kapan saja, upload Google Drive link, conditional Juara/Tingkat untuk lomba
- Validasi Aktivitas: validator approve/reject per aktivitas
- Periode SKPI: CRUD + gate periode aktif
- Kompre gate: `kompre_status` field + gate logic
- Pengajuan SKPI: mahasiswa centang aktivitas disetujui → submit
- Terbitkan SKPI + auto-create Pengambilan
- SKPI PDF (preview + download, 2 halaman, kop surat, English subtitle)
- Pengambilan (validator tandai "Sudah Diambil")
- Laporan (filter + tabel)
- Dashboard per role
- Guard hapus master data
- Test suite (78 test, Pest)

## Fitur Belum Selesai

- Cetak/Export PDF Laporan (tombol ada, implementasi belum)
- Passkeys (`@laravel/passkeys` terinstall, belum dipakai)
- SSR (config enabled, perlu `npm run build:ssr` + SSR server)
- QR code verifikasi SKPI (nice to have, ditunda)
- StressTestSeeder (belum diupdate untuk schema V2)
