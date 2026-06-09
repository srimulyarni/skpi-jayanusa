# Laravel React Starter Kit — Stripped

Ini versi ramping dari [Laravel React Starter Kit](https://github.com/laravel/react-starter-kit) resmi. Fitur-fitur yang tidak selalu dibutuhkan sudah dihapus supaya kamu bisa langsung fokus bangun aplikasinya.

## Apa yang dihapus?

- **Register** — tidak ada halaman daftar akun baru
- **Forgot password & reset password** — alur lupa password dihilangkan
- **Email verification** — tidak ada konfirmasi email
- **Two-factor authentication (2FA)** — dihapus beserta semua UI-nya
- **Passkeys (WebAuthn)** — dihapus

Yang tersisa hanya **login** dan **logout**, plus halaman settings profil dan ganti password yang tetap berfungsi normal.

## Stack

- Laravel 13
- Inertia.js v2
- React
- Tailwind CSS
- Laravel Fortify (hanya fitur login)

## Kenapa dibuat?

Banyak proyek internal — sistem kampus, dashboard admin, aplikasi perusahaan — yang manajemen akunnya dilakukan admin, bukan user sendiri. Jadi fitur register mandiri, lupa password, dan 2FA justru jadi beban yang harus dihapus satu per satu setiap kali mulai project baru.

Repo ini menghemat langkah itu.

## Cara pakai

```bash
composer create-project --prefer-dist <vendor/repo> nama-project
cd nama-project
cp .env.example .env
php artisan key:generate
php artisan migrate
npm install && npm run dev
```

> Atau klik **Use this template** di halaman GitHub repo ini.

## Menambah user

Karena tidak ada halaman register, user dibuat lewat seeder atau Tinker:

```bash
php artisan tinker
```

```php
App\Models\User::create([
    'name' => 'Admin',
    'email' => 'admin@example.com',
    'password' => bcrypt('password'),
]);
```

## Credit

Dibuat di atas [laravel/react-starter-kit](https://github.com/laravel/react-starter-kit) — lisensi MIT.
