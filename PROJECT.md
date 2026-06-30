# SKPI Jayanusa — Project Documentation

> Dokumen ini dibuat agar sesi berikutnya langsung memahami seluruh alur project tanpa perlu generate ulang.

---

## 1. Ringkasan Proyek

**SKPI Jayanusa** adalah sistem pengelolaan **Surat Keterangan Pendamping Ijazah (SKPI)** untuk institusi di bawah naungan **Yayasan Jayanusa** (STMIK, AMIK, AKPER). Sistem ini mengelola siklus penuh: dari data mahasiswa → pengajuan SKPI → review akademis → penerbitan SKPI → pengambilan dokumen.

---

## 2. Tech Stack

| Layer | Teknologi | Versi |
|-------|-----------|-------|
| **Backend** | Laravel | 13.x |
| **PHP** | PHP | ≥ 8.3 |
| **Frontend** | React + TypeScript | via Inertia.js v3 |
| **CSS** | Tailwind CSS v4 | `@tailwindcss/vite` |
| **UI Components** | shadcn/ui (New York style) | Radix UI primitives |
| **Data Tables** | TanStack Table | `@tanstack/react-table` |
| **Icons** | Lucide React | |
| **Routing (frontend)** | Inertia.js + Wayfinder | type-safe route generation |
| **Auth (admin)** | Laravel Fortify | username/password |
| **Auth (mahasiswa)** | Custom `MahasiswaLoginController` | via external API |
| **Build** | Vite | with `laravel-vite-plugin` |
| **Package Manager** | npm | 11.x |
| **Database** | MySQL/MariaDB (via Laragon) | |
| **Testing** | Pest PHP | v4 |
| **Linting** | ESLint + Prettier | |
| **Font** | Instrument Sans (Bunny CDN) | 400/500/600 |

---

## 3. Arsitektur & Pola

### 3.1 Pattern
- **Backend**: MVC klasik Laravel + Action classes + Form Requests
- **Frontend**: Inertia.js SPA (React) — server-side routing, client-side rendering
- **Layout switching**: Berdasarkan prefix nama halaman (`auth/`, `settings/`, `mahasiswa/`, `akademis/`, `ketua/`)
- **Sidebar navigation**: Role-based, di-hardcode di `resources/js/components/app-sidebar.tsx`

### 3.2 Struktur Folder Utama

```
app/
├── Actions/                      # Single-purpose action classes
│   └── FindOrCreateMahasiswaAction.php
├── Http/
│   ├── Controllers/
│   │   ├── Akademis/             # Semua controller admin akademis
│   │   │   ├── IdentitasPtController.php
│   │   │   ├── JurusanController.php
│   │   │   ├── KategoriController.php
│   │   │   ├── LaporanController.php
│   │   │   ├── MahasiswaController.php
│   │   │   ├── PengajuanController.php
│   │   │   ├── PengambilanController.php
│   │   │   └── SkpiController.php
│   │   ├── Auth/
│   │   │   └── MahasiswaLoginController.php
│   │   └── Settings/
│   ├── Middleware/
│   │   └── RoleMiddleware.php    # role:mahasiswa, role:akademis, role:ketua
│   ├── Requests/
│   │   ├── Akademis/             # Form Request validasi
│   │   ├── Auth/
│   │   └── Settings/
│   └── Responses/
│       └── LoginResponse.php     # Redirect by role after Fortify login
├── Models/                       # 10 model Eloquent
├── Providers/
│   ├── AppServiceProvider.php
│   └── FortifyServiceProvider.php
└── Services/
    └── JayanusaAuthService.php   # HTTP client ke API eksternal

resources/js/
├── app.tsx                       # Inertia entry point, layout resolver
├── components/                   # Shared components + shadcn/ui
├── layouts/
│   ├── app/                      # Sidebar layout
│   ├── auth/                     # Auth layout (simple/card/split)
│   └── settings/                 # Settings layout
├── pages/                        # Inertia page components
│   ├── auth/                     # login.tsx, mahasiswa-login.tsx
│   ├── mahasiswa/                # dashboard.tsx
│   ├── akademis/                 # CRUD pages (index/create/edit/show)
│   ├── ketua/                    # dashboard.tsx
│   └── settings/                 # profile, security, appearance
├── types/                        # TypeScript types
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions
└── routes/                       # Wayfinder generated routes
```

---

## 4. Database Schema & Relasi

### 4.1 Entity Relationship

```
┌─────────────┐       ┌──────────────┐       ┌─────────────────┐
│  identitas_pt│──1:N──│   jurusan    │──1:N──│   mahasiswa     │
│             │       │              │       │                 │
│ id          │       │ id           │       │ id              │
│ kode_institusi│     │ kode (enum)  │       │ nobp (unique)   │
│ nama_pt     │       │ nama         │       │ nama            │
│ nama_singkat│       │ singkatan    │       │ tempat_lahir    │
│ nama_en     │       │ identitas_pt_id│     │ tanggal_lahir   │
│ alamat      │       └──────────────┘       │ jk (L/P)        │
│ nomor_sk    │                              │ alamat           │
│ akreditasi  │                              │ nohp             │
│ nama_pimpinan│                             │ jurusan_id (FK)  │
│ nidn        │                              │ user_id (FK)     │
│ logo        │                              └────────┬─────────┘
└─────────────┘                                       │
                                                      │ 1:N
┌─────────────┐       ┌──────────────┐       ┌───────┴─────────┐
│   kategori  │──1:N──│detail_pengajuan│──N:1─│   pengajuan     │
│             │       │              │       │                 │
│ id          │       │ id           │       │ id              │
│ nama_kategori│      │ pengajuan_id │       │ mahasiswa_id    │
│ status      │       │ kategori_id  │       │ no_registrasi   │
└─────────────┘       │ nama_kegiatan│       │ tgl_pengajuan   │
                      │ tahun_kegiatan│      │ status (enum)   │
                      │ peran        │       │ catatan_akademis│
                      └──────┬───────┘       └────────┬────────┘
                             │ 1:N                    │ 1:1
                      ┌──────┴───────┐       ┌───────┴─────────┐
                      │bukti_kegiatan│       │     skpi        │
                      │              │       │                 │
                      │ id           │       │ id              │
                      │ detail_peng_id│      │ no_skpi (unique)│
                      │ nama_file    │       │ pengajuan_id    │
                      │ path_file    │       │ identitas_pt_id │
                      └──────────────┘       │ tgl_terbit      │
                                             │ status (enum)   │
                                             └────────┬────────┘
                                                      │ 1:1
                                             ┌───────┴─────────┐
                                             │  pengambilan     │
                                             │                 │
                                             │ id              │
                                             │ skpi_id         │
                                             │ mahasiswa_id    │
                                             │ tgl_pengambilan │
                                             │ diambil_pada    │
                                             │ status (enum)   │
                                             └─────────────────┘

┌─────────────┐
│    users    │
│             │
│ id          │
│ username    │─── unique, lowercase
│ password    │─── hashed
│ role (enum) │─── mahasiswa | akademis | ketua
└─────────────┘
```

### 4.2 Enum Values

| Tabel | Kolom | Values |
|-------|-------|--------|
| `users` | `role` | `mahasiswa`, `akademis`, `ketua` |
| `identitas_pt` | `kode_institusi` | `STMIK`, `AMIK`, `AKPER` |
| `jurusan` | `kode` | `000` (MI/AMIK), `100` (SI/STMIK), `200` (SK/STMIK) |
| `kategori` | `status` | `aktif`, `nonaktif` |
| `pengajuan` | `status` | `menunggu`, `diproses`, `disetujui`, `revisi`, `ditolak` |
| `skpi` | `status` | `draft`, `diterbitkan`, `dibatalkan` |
| `pengambilan` | `status` | `belum_diambil`, `sudah_diambil` |
| `mahasiswa` | `jk` | `L`, `P` |

---

## 5. Autentikasi & Otorisasi

### 5.1 Dua Jalur Login

**Jalur 1 — Admin (akademis / ketua)** via Fortify:
- Halaman: `GET /login` → `auth/login.tsx`
- Credential: `username` + `password` (disimpan di tabel `users`)
- Redirect: `LoginResponse.php` → `/akademis/dashboard` atau `/ketua/dashboard` berdasarkan `role`

**Jalur 2 — Mahasiswa** via Custom Controller:
- Halaman: `GET /mahasiswa/login` → `auth/mahasiswa-login.tsx`
- Credential: `nobp` + `password`
- Alur:
  1. `MahasiswaLoginController::store()` → `JayanusaAuthService::authenticate()`
  2. Kirim POST ke `https://api.novinaldi.my.id/api/login-voting` dengan `{username: nobp, password}`
  3. Jika sukses → `FindOrCreateMahasiswaAction::execute()`:
     - Cari `User` berdasarkan `username = nobp`
     - Jika tidak ada: buat `User` (role=mahasiswa) + `Mahasiswa` (deteksi jurusan dari 3 digit kode NOBP)
     - Jika sudah ada: update password
  4. `Auth::login($user)` → redirect ke `/mahasiswa/dashboard`

### 5.2 Role Middleware

File: `app/Http/Middleware/RoleMiddleware.php`
```php
// Usage: middleware(['auth', 'role:akademis'])
// Mengecek $request->user()->role terhadap daftar role yang diizinkan
```

### 5.3 Route Groups

| Prefix | Role | Contoh Route |
|--------|------|-------------|
| `/mahasiswa` | `mahasiswa` | `/mahasiswa/dashboard` |
| `/akademis` | `akademis` | `/akademis/pengajuan`, `/akademis/skpi` |
| `/ketua` | `ketua` | `/ketua/dashboard`, `/ketua/laporan` |
| `/settings` | `auth` (any role) | `/settings/profile`, `/settings/security` |

---

## 6. Bisnis Flow (Siklus SKPI)

```
┌──────────────────────────────────────────────────────────────────┐
│                        ALUR SKPI LENGKAP                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. MAHASISWA LOGIN                                              │
│     └─ NOBP + Password → API Jayanusa → FindOrCreateMahasiswa   │
│                                                                  │
│  2. MAHASISWA MENGAJUKAN SKPI                                    │
│     └─ (Fitur belum diimplementasi di frontend, route commented) │
│                                                                  │
│  3. AKADEMIS REVIEW PENGAJUAN                                    │
│     └─ /akademis/pengajuan → Lihat detail → Update status        │
│     └─ Status: menunggu → diproses → disetujui/revisi/ditolak    │
│                                                                  │
│  4. AKADEMIS TERBITKAN SKPI                                      │
│     └─ /akademis/skpi → Pilih pengajuan "disetujui" → Terbitkan  │
│     └─ Auto-generate: no_skpi (format: SKPI/YYYY/MM/XXXX/KODE)  │
│     └─ Auto-create: Pengambilan (status: belum_diambil)          │
│                                                                  │
│  5. AKADEMIS CATAT PENGAMBILAN                                   │
│     └─ /akademis/pengambilan → Klik "Ambil" → Update timestamp   │
│     └─ Status: belum_diambil → sudah_diambil                     │
│                                                                  │
│  6. LAPORAN                                                      │
│     └─ /akademis/laporan & /ketua/laporan                        │
│     └─ Filter: tahun + bulan → Tabel SKPI + Ringkasan statistik  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 6.1 Format No. SKPI

```
SKPI/{YYYY}/{MM}/{0001}/{KODE_INSTITUSI}
Contoh: SKPI/2026/06/0001/STMIK
```
- Di-generate otomatis oleh `SkpiController::store()`
- Urutan berdasarkan jumlah SKPI yang sudah ada di tahun+bulan yang sama

### 6.2 Mapping NOBP → Jurusan

`FindOrCreateMahasiswaAction` mendeteksi jurusan dari NOBP:
```php
$kodeJurusan = substr($nobp, 2, 3); // digit ke-3 sampai ke-5
// '000' → MI (AMIK), '100' → SI (STMIK), '200' → SK (STMIK)
```

---

## 7. Routes Detail

### 7.1 Public Routes
| Method | URI | Handler | Nama |
|--------|-----|---------|------|
| GET | `/` | Inertia `welcome` | `home` |
| GET | `/mahasiswa/login` | `MahasiswaLoginController@show` | `mahasiswa.login` |
| POST | `/mahasiswa/login` | `MahasiswaLoginController@store` | — |

### 7.2 Mahasiswa Routes (auth + role:mahasiswa)
| Method | URI | Handler | Nama |
|--------|-----|---------|------|
| GET | `/mahasiswa/dashboard` | Inertia `mahasiswa/dashboard` | `mahasiswa.dashboard` |

### 7.3 Akademis Routes (auth + role:akademis)
| Method | URI | Handler | Nama |
|--------|-----|---------|------|
| GET | `/akademis/dashboard` | Inertia `akademis/dashboard` | `akademis.dashboard` |
| GET/POST/PUT/DELETE | `/akademis/kategori[/{kategori}]` | `KategoriController` | `akademis.kategori.*` |
| GET/POST/PUT/DELETE | `/akademis/identitas-pt[/{identitasPt}]` | `IdentitasPtController` | `akademis.identitas-pt.*` |
| GET/POST/PUT/DELETE | `/akademis/jurusan[/{jurusan}]` | `JurusanController` | `akademis.jurusan.*` |
| GET/POST/PUT/DELETE | `/akademis/mahasiswa[/{mahasiswa}]` | `MahasiswaController` | `akademis.mahasiswa.*` |
| GET | `/akademis/pengajuan` | `PengajuanController@index` | `akademis.pengajuan.index` |
| GET | `/akademis/pengajuan/{pengajuan}` | `PengajuanController@show` | `akademis.pengajuan.show` |
| PATCH | `/akademis/pengajuan/{pengajuan}/status` | `PengajuanController@updateStatus` | `akademis.pengajuan.status` |
| GET | `/akademis/skpi` | `SkpiController@index` | `akademis.skpi.index` |
| POST | `/akademis/skpi` | `SkpiController@store` | `akademis.skpi.store` |
| PATCH | `/akademis/skpi/{skpi}/batalkan` | `SkpiController@batalkan` | `akademis.skpi.batalkan` |
| GET | `/akademis/pengambilan` | `PengambilanController@index` | `akademis.pengambilan.index` |
| PATCH | `/akademis/pengambilan/{pengambilan}/ambil` | `PengambilanController@ambil` | `akademis.pengambilan.ambil` |
| GET | `/akademis/laporan` | `LaporanController@index` | `akademis.laporan.index` |

### 7.4 Ketua Routes (auth + role:ketua)
| Method | URI | Handler | Nama |
|--------|-----|---------|------|
| GET | `/ketua/dashboard` | Inertia `ketua/dashboard` | `ketua.dashboard` |
| GET | `/ketua/laporan` | `LaporanController@index` | `ketua.laporan.index` |

### 7.5 Settings Routes (auth, any role)
| Method | URI | Handler | Nama |
|--------|-----|---------|------|
| GET | `/settings/profile` | `ProfileController@edit` | `profile.edit` |
| PATCH | `/settings/profile` | `ProfileController@update` | `profile.update` |
| GET | `/settings/security` | `SecurityController@edit` | `security.edit` |
| PUT | `/settings/password` | `SecurityController@update` | `user-password.update` |
| GET | `/settings/appearance` | Inertia | `appearance.edit` |

---

## 8. Frontend Pages

### 8.1 Halaman per Role

**Mahasiswa:**
- `mahasiswa/dashboard.tsx` — Welcome screen sederhana

**Akademis:**
- `akademis/dashboard.tsx` — Welcome screen
- `akademis/mahasiswa/index.tsx` — DataTable CRUD mahasiswa
- `akademis/mahasiswa/create.tsx` — Form tambah mahasiswa
- `akademis/mahasiswa/edit.tsx` — Form edit mahasiswa
- `akademis/kategori/index.tsx` — DataTable CRUD kategori
- `akademis/kategori/create.tsx` — Form tambah kategori
- `akademis/kategori/edit.tsx` — Form edit kategori
- `akademis/identitas-pt/index.tsx` — DataTable CRUD identitas PT
- `akademis/identitas-pt/create.tsx` — Form tambah identitas PT
- `akademis/identitas-pt/edit.tsx` — Form edit identitas PT
- `akademis/jurusan/index.tsx` — DataTable CRUD jurusan
- `akademis/jurusan/create.tsx` — Form tambah jurusan
- `akademis/jurusan/edit.tsx` — Form edit jurusan
- `akademis/pengajuan/index.tsx` — DataTable pengajuan (view only)
- `akademis/pengajuan/show.tsx` — Detail pengajuan + update status
- `akademis/skpi/index.tsx` — Tabel siap terbit + tabel SKPI sudah terbit
- `akademis/pengambilan/index.tsx` — DataTable pengambilan + tombol "Ambil"
- `akademis/laporan/index.tsx` — Filter tahun/bulan + DataTable laporan + ringkasan

**Ketua:**
- `ketua/dashboard.tsx` — Welcome screen
- (Laporan menggunakan komponen yang sama dengan akademis)

### 8.2 Layout System

`app.tsx` menentukan layout berdasarkan nama halaman:
```
welcome          → null (tanpa layout)
auth/*           → AuthLayout (simple card)
settings/*       → AppLayout + SettingsLayout
lainnya          → AppLayout (sidebar)
```

Sidebar (`app-sidebar.tsx`) menampilkan menu berdasarkan `auth.user.role`:
```typescript
navByRole = {
    mahasiswa: [Dashboard, Profil Saya],
    akademis:  [Dashboard, Data Mahasiswa, Kategori, Identitas PT, Jurusan,
                Pengajuan, Pengambilan, Terbitkan SKPI, Laporan],
    ketua:     [Dashboard, Laporan],
}
```

### 8.3 UI Components (shadcn/ui)

Project menggunakan shadcn/ui dengan style `new-york`, Tailwind CSS v4, dan komponen:
`Button`, `Card`, `Badge`, `Input`, `Label`, `Select`, `Textarea`, `Checkbox`, `AlertDialog`, `DataTable`, `Sidebar`, `Tooltip`, `Separator`, `DropdownMenu`, `NavigationMenu`, `Avatar`, `Collapsible`, `Toggle`, `ToggleGroup`, `Spinner`, `Sonner (toast)`

---

## 9. Seeders

| Seeder | Data |
|--------|------|
| `IdentitasPtSeeder` | 3 institusi: STMIK, AMIK, AKPER (Jayanusa, Padang) |
| `JurusanSeeder` | 3 jurusan: MI (AMIK), SI (STMIK), SK (STMIK) |
| `KategoriSeeder` | 8 kategori kegiatan (Prestasi Akademik, Non-Akademik, Organisasi, dll) |
| `UserSeeder` | 2 user admin: `akademis`/`password`, `ketua`/`password` |

**User mahasiswa** dibuat otomatis saat login pertama kali via `FindOrCreateMahasiswaAction`.

---

## 10. Konvensi & Pola Kode

### 10.1 Backend
- **Model**: Menggunakan PHP 8 Attributes (`#[Fillable(...)]`) untuk mendefinisikan fillable fields
- **Controller**: Mengembalikan `Inertia::render()` untuk halaman, `RedirectResponse` untuk aksi
- **Validation**: Via Form Request classes di `app/Http/Requests/`
- **Route Model Binding**: Otomatis (e.g., `Pengajuan $pengajuan`)
- **Flash messages**: `->with('success', '...')` di redirect

### 10.2 Frontend
- **Type definitions**: Inline di setiap page component (bukan shared types)
- **DataTable**: Komponen reusable `@/components/data-table` dengan TanStack Table
- **Form handling**: `useForm` dari `@inertiajs/react`
- **State management**: React `useState` lokal, tidak ada global store
- **Confirmation dialogs**: Menggunakan `AlertDialog` dari shadcn/ui
- **Toast notifications**: `sonner` via `toast.success()`
- **Breadcrumbs**: Didefinisikan via `Page.layout.breadcrumbs` property
- **Path aliases**: `@/` → `resources/js/` (via tsconfig + vite)

### 10.3 Naming Conventions
- **Controller**: `{Entity}Controller` (singular resource)
- **Model**: Singular (`Mahasiswa`, `Pengajuan`)
- **Migration**: Timestamp-based, tabel menggunakan nama jamak Indonesia (`mahasiswa`, `pengajuan`)
- **Page**: Path sesuai URL (`akademis/pengajuan/index.tsx`)
- **Route names**: `{prefix}.{resource}.{action}` (e.g., `akademis.pengajuan.index`)

---

## 11. Perintah Penting

```bash
# Setup awal
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm install

# Development
npm run dev              # Vite dev server
php artisan serve        # Laravel dev server (jika tidak pakai Laragon)

# Build
npm run build

# SSR (jika diaktifkan)
npm run build:ssr

# Testing
php artisan test         # atau: vendor/bin/pest

# Linting
npm run lint             # ESLint fix
npm run format           # Prettier fix
npm run types:check      # TypeScript check

# Code style (PHP)
./vendor/bin/pint        # Laravel Pint (sesuai pint.json)
```

---

## 12. Fitur yang Belum/Dalam Pengembangan

1. **Pengajuan SKPI oleh Mahasiswa** — Route di sidebar sudah dikomentari (`// { title: 'Pengajuan SKPI', ... }`), halaman frontend belum ada
2. **Profil Mahasiswa** — Menu ada di sidebar (`/mahasiswa/profil`) tapi belum ada route & controller
3. **Upload Bukti Kegiatan** — Model & migration sudah ada, tapi belum ada UI upload
4. **Cetak/Export PDF Laporan** — Tombol `Printer` ada di UI, tapi belum ada implementasi cetak
5. **Passkeys** — Package `@laravel/passkeys` terinstall tapi belum diimplementasikan
6. **SSR** — Config `inertia.php` SSR enabled, tapi perlu `npm run build:ssr` dan SSR server

---

## 13. Environment Variables Penting

```env
APP_NAME="SKPI Jayanusa"
APP_URL=http://skpi-jayanusa.test    # Sesuaikan dengan Laragon
DB_DATABASE=skpi_jayanusa
VITE_APP_NAME="SKPI Jayanusa"
```

---

## 14. Catatan Teknis

- **Wayfinder**: Generate type-safe route helpers di `resources/js/routes/` dan `resources/js/wayfinder/`
- **React Compiler**: Menggunakan `babel-plugin-react-compiler` untuk optimasi otomatis
- **Tailwind v4**: Tidak perlu `tailwind.config.js`, konfigurasi via CSS (`@tailwindcss/vite`)
- **Session driver**: Database (tabel `sessions` ada di migration users)
- **External API**: `https://api.novinaldi.my.id/api/login-voting` untuk autentikasi mahasiswa (SSL verification disabled: `withoutVerifying()`)
- **Kode institusi**: STMIK (SI, SK), AMIK (MI), AKPER (belum ada jurusan)
