# SKPI Jayanusa

Sistem pengelolaan SKPI untuk Yayasan Jayanusa (STMIK, AMIK, AKPER). Siklus: mahasiswa login → pengajuan SKPI → review akademis → terbitkan SKPI → pengambilan dokumen.

---

## Aturan

- Komentar `//` DILARANG kecuali hal yang benar-benar tidak obvious
- WAJIB gunakan Context7 untuk referensi Laravel/packages — DILARANG asumsi
- WAJIB update PROJECT.md setiap selesai mengerjakan sesuatu
- Jangan jawab "sudah beres" jika belum diverifikasi

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Backend | Laravel 13.x, PHP ≥ 8.3 |
| Frontend | React + TypeScript via Inertia.js v3 |
| CSS | Tailwind CSS v4 (`@tailwindcss/vite`) |
| UI | shadcn/ui (New York), Radix UI, Lucide React |
| Tables | TanStack Table |
| Routing | Inertia.js + Wayfinder (type-safe) |
| Auth | Fortify (admin: username/password), Custom (mahasiswa: NOBP + API eksternal) |
| Build | Vite 8, `laravel-vite-plugin` |
| DB | MySQL/MariaDB (Laragon) |
| Font | Instrument Sans (Bunny CDN) |

---

## Database

**10 tabel**: `users`, `identitas_pt`, `jurusan`, `kategori`, `mahasiswa`, `pengajuan`, `detail_pengajuan`, `bukti_kegiatan`, `skpi`, `pengambilan`

**Relasi utama**:
- `identitas_pt` → 1:N → `jurusan` → 1:N → `mahasiswa` → 1:N → `pengajuan`
- `pengajuan` → 1:N → `detail_pengajuan` → 1:N → `bukti_kegiatan`
- `detail_pengajuan` → N:1 → `kategori`
- `pengajuan` → 1:1 → `skpi` → 1:1 → `pengambilan`
- `skpi` → N:1 → `identitas_pt`
- `users` → 1:1 → `mahasiswa`

**Enum/Constraint penting**:
- `users.role`: `mahasiswa`, `akademis`, `ketua`
- `jurusan.kode`: `string(10)`, bebas (seed: `000`=MI, `100`=SI, `200`=SK)
- `identitas_pt.kode_institusi`: `string(20)`, unique (seed: STMIK, AMIK, AKPER)
- `identitas_pt.akreditasi_institusi`: validasi form `Unggul|Baik Sekali|Baik|Tidak Terakreditasi`
- `identitas_pt.gelar`: nullable (seed: S.Kom, A.Md, A.Md.Kep)
- `pengajuan.status`: `draft|menunggu|diproses|disetujui|revisi|ditolak`
- `skpi.status`: `draft|diterbitkan|dibatalkan`
- `pengambilan.status`: `belum_diambil|sudah_diambil`
- `mahasiswa.jk`: `L|P`, punya `foto` (nullable), `tahun_masuk` (nullable), `nomor_ijazah` (nullable)

---

## Autentikasi

**Admin (akademis/ketua)**: Fortify, `username` + `password` → `LoginResponse` redirect by role. `lowercase_usernames: true`.

**Mahasiswa**: Custom `MahasiswaLoginController` → `JayanusaAuthService` POST ke `https://api.novinaldi.my.id/api/login-voting` → `FindOrCreateMahasiswaAction` buat User+Mahasiswa jika baru (deteksi jurusan dari `substr(nobp, 2, 3)`). SSL verification disabled, timeout 20s.

**Logout**: Semua role redirect ke `/` (`LogoutResponse.php`).

**Profile completeness** (`HandleInertiaRequests` → `auth.isProfileLengkap`):
- Field wajib: `tempat_lahir`, `tanggal_lahir`, `jk`, `nohp`, `alamat`
- `nomor_ijazah` TIDAK wajib (semester awal belum punya, diinput via popup saat Ajukan draft)
- Sidebar disable menu Pengajuan SKPI + toast warning jika belum lengkap

---

## Business Rules

- Mahasiswa hanya boleh punya 1 pengajuan aktif (`draft`/`menunggu`/`diproses`)
- Draft pengajuan: mahasiswa simpan kegiatan dulu, bisa edit/tambah kapan saja
- Ajukan draft: popup input `nomor_ijazah` → simpan ke mahasiswa + generate `no_registrasi` + `tgl_pengajuan`, status → `menunggu`
- Draft TIDAK terlihat oleh akademis (baru muncul setelah diajukan)
- Menu Pengajuan SKPI disabled jika profil belum lengkap
- Edit pengajuan: status `draft`/`menunggu`/`revisi`/`ditolak`; reset ke `menunggu` saat update untuk `revisi`/`ditolak`; draft tetap `draft`
- Format no SKPI: `SKPI/{YYYY}/{MM}/{0001}/{KODE_INSTITUSI}` (auto-generate)
- Terbitkan SKPI: hanya untuk pengajuan `disetujui`, dicegah duplikat
- Batalkan SKPI: tolak jika sudah `dibatalkan` atau sudah `sudah_diambil`
- Terbitkan SKPI → auto-create Pengambilan (`belum_diambil`)
- Admin mahasiswa: index/edit/update/destroy saja (no create — mahasiswa auto dari login)
- Hapus master data dicegah jika masih dipakai: Jurusan (punya mahasiswa), Kategori (punya detail_pengajuan), IdentitasPT (punya jurusan)
- Catatan akademis: input muncul hanya saat status `revisi`/`ditolak` (wajib via `required_if`). Mahasiswa lihat di halaman show
- Settings disembunyikan untuk role `mahasiswa`
- Foto mahasiswa: `storage/app/public/mahasiswa/foto/`
- Upload bukti kegiatan: `forceFormData: true` untuk fix multi-file upload di Inertia

---

## Routes

**Prefix & Role**:
- `/mahasiswa` → role:mahasiswa
- `/akademis` → role:akademis
- `/ketua` → role:ketua
- `/settings` → auth (semua role), UI hidden untuk mahasiswa

**Mahasiswa**:
| Method | URI | Handler |
|--------|-----|---------|
| GET/POST | `/mahasiswa/login` | `MahasiswaLoginController` |
| GET | `/mahasiswa/dashboard` | Inertia |
| GET/PUT | `/mahasiswa/profil` | `MahasiswaProfileController` |
| GET/POST | `/mahasiswa/pengajuan` | `MahasiswaPengajuanController@index\|@store` |
| GET | `/mahasiswa/pengajuan/create` | `@create` |
| GET/PUT | `/mahasiswa/pengajuan/{pengajuan}` | `@show\|@update` |
| GET | `/mahasiswa/pengajuan/{pengajuan}/edit` | `@edit` |
| POST | `/mahasiswa/pengajuan/{pengajuan}/ajukan` | `@ajukan` |

**Akademis** (resource routes standar untuk master data):
- CRUD: kategori, jurusan, identitas-pt, mahasiswa (tanpa create/store)
- Pengajuan: index, show, `{id}/status` (PATCH)
- SKPI: index, store, `{id}/batalkan` (PATCH)
- Pengambilan: index, `{id}/ambil` (PATCH)
- Laporan: index

**Ketua**: dashboard (inertia), laporan (`LaporanController@index`)

**Settings**: profile (GET/PATCH), security (GET), password (PUT, throttle 6,1), appearance (inertia)

---

## Sidebar Navigation

Dikelompokkan dalam `NavGroup[]` di `app-sidebar.tsx`:
- **Mahasiswa**: Menu → [Dashboard, Profil Saya, Pengajuan SKPI (disabled)]
- **Akademis**: Master → [Dashboard, Data Mahasiswa, Kategori, Identitas PT, Jurusan], Transaksi → [Pengajuan, Pengambilan, Terbitkan SKPI], Laporan → [Laporan]
- **Ketua**: Menu → [Dashboard, Laporan]

---

## Konvensi Kode

- Backend: MVC + Action classes + Form Requests, PHP 8 Attributes untuk fillable
- Frontend: `useForm` dari Inertia, `useState` lokal, type definitions inline di page
- DataTable: reusable `@/components/data-table`
- Search/Filter: debounced search (500ms) via `use-debounce`, dropdown filter langsung `router.get`. Pola: `applyFilters()` gabungkan semua params, `preserveState: true, replace: true`
- Pagination: reusable `@/components/data-table-pagination`
- Route names: `{prefix}.{resource}.{action}`
- Naming: Controller `{Entity}Controller`, Model singular, Migration jamak Indonesia

---

## Seeders

**Normal (daily dev)**:
```bash
php artisan migrate:fresh --seed
```
- `IdentitasPtSeeder`: 3 institusi (STMIK, AMIK, AKPER)
- `JurusanSeeder`: 3 jurusan (MI→AMIK, SI→STMIK, SK→STMIK)
- `KategoriSeeder`: 8 kategori kegiatan
- `UserSeeder`: admin `akademis`/`password`, `ketua`/`password`
- `DummyDataSeeder`: 4 mahasiswa (2 lengkap, 2 belum), 6 pengajuan (draft, menunggu, diproses, disetujui, revisi, ditolak), 2 SKPI (1 diambil, 1 belum)

**Stress test (100K per tabel)**:
```bash
php artisan migrate:fresh --seed --seeder=StressTestSeeder
# atau jalankan setelah master data:
php artisan db:seed --seeder=StressTestSeeder
```
- 100K users + mahasiswa, 100K pengajuan, 200K detail_pengajuan + bukti_kegiatan, ~20K skpi + pengambilan
- NOBP stress test: prefix `99` (mudah dibedakan dari data asli)

---

## Perintah

```bash
composer install && npm install
php artisan migrate --seed

npm run dev                    # Vite dev
npm run build                  # Build
npm run lint                   # ESLint fix
npm run format                 # Prettier fix
npm run types:check            # TypeScript check
./vendor/bin/pint              # Laravel Pint
php artisan test               # Pest

# Stress test (100K/tabel)
php artisan migrate:fresh --seed --seeder=StressTestSeeder
```

---

## Fitur Selesai & Belum

**Sudah**: Login (admin + mahasiswa), Profil mahasiswa, Pengajuan SKPI (draft → ajukan → edit/show), Upload bukti, Review pengajuan, Terbitkan SKPI, SKPI PDF (preview + download), Pengambilan, Laporan (filter + tabel), Dashboard per role, Guard hapus master data, Test suite (66 test, Pest)

**Belum**:
- Cetak/Export PDF Laporan (tombol ada, implementasi belum)
- Passkeys (`@laravel/passkeys` terinstall, belum dipakai)
- SSR (config enabled, perlu `npm run build:ssr` + SSR server)

---

## Catatan Teknis

- Wayfinder: type-safe routes di `resources/js/routes/` dan `resources/js/wayfinder/`
- React Compiler via `babel-plugin-react-compiler`
- Tailwind v4: tanpa `tailwind.config.js`, konfigurasi via CSS
- Session driver: database (tabel `sessions`)
- Fortify: custom views via Inertia, features kosong
- Path alias: `@/` → `resources/js/`
- Layout: `app.tsx` switch by page name prefix (`auth/`, `settings/`, lainnya → AppLayout)
- Factories: semua model punya factory di `database/factories/`
- Test DB: `skpi_jayanusa_testing` (MySQL), config di `phpunit.xml`
