<?php

use App\Http\Controllers\Validator\DashboardController;
use App\Http\Controllers\Validator\IdentitasPtController;
use App\Http\Controllers\Validator\JurusanController;
use App\Http\Controllers\Validator\KategoriController;
use App\Http\Controllers\Validator\LaporanController;
use App\Http\Controllers\Ketua\KetuaDashboardController;
use App\Http\Controllers\Validator\MahasiswaController;
use App\Http\Controllers\Validator\PengambilanController;
use App\Http\Controllers\Validator\PeriodeSkpiController;
use App\Http\Controllers\Validator\SkpiController;
use App\Http\Controllers\Validator\SkpiPdfController;
use App\Http\Controllers\Validator\ValidasiAktivitasController;
use App\Http\Controllers\Auth\MahasiswaLoginController;
use App\Http\Controllers\Mahasiswa\MahasiswaAktivitasController;
use App\Http\Controllers\Mahasiswa\MahasiswaBuktiPengajuanPdfController;
use App\Http\Controllers\Mahasiswa\MahasiswaDashboardController;
use App\Http\Controllers\Mahasiswa\MahasiswaPengajuanSkpiController;
use App\Http\Controllers\Mahasiswa\MahasiswaProfileController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::get('/mahasiswa/login', [MahasiswaLoginController::class, 'show'])->name('mahasiswa.login');
Route::post('/mahasiswa/login', [MahasiswaLoginController::class, 'store']);

Route::middleware(['auth', 'role:mahasiswa'])->prefix('mahasiswa')->name('mahasiswa.')->group(function () {
    Route::get('dashboard', MahasiswaDashboardController::class)->name('dashboard');
    Route::get('profil', [MahasiswaProfileController::class, 'edit'])->name('profil.edit');
    Route::put('profil', [MahasiswaProfileController::class, 'update'])->name('profil.update');

    Route::get('aktivitas', [MahasiswaAktivitasController::class, 'index'])->name('aktivitas.index');
    Route::get('aktivitas/create', [MahasiswaAktivitasController::class, 'create'])->name('aktivitas.create');
    Route::post('aktivitas', [MahasiswaAktivitasController::class, 'store'])->name('aktivitas.store');
    Route::get('aktivitas/{aktivitas}', [MahasiswaAktivitasController::class, 'show'])->name('aktivitas.show');
    Route::get('aktivitas/{aktivitas}/edit', [MahasiswaAktivitasController::class, 'edit'])->name('aktivitas.edit');
    Route::put('aktivitas/{aktivitas}', [MahasiswaAktivitasController::class, 'update'])->name('aktivitas.update');
    Route::delete('aktivitas/{aktivitas}', [MahasiswaAktivitasController::class, 'destroy'])->name('aktivitas.destroy');

    Route::get('skpi', [MahasiswaPengajuanSkpiController::class, 'index'])->name('skpi.index');
    Route::get('skpi/create', [MahasiswaPengajuanSkpiController::class, 'create'])->name('skpi.create');
    Route::post('skpi', [MahasiswaPengajuanSkpiController::class, 'store'])->name('skpi.store');
    Route::get('skpi/{pengajuanSkpi}', [MahasiswaPengajuanSkpiController::class, 'show'])->name('skpi.show');
    Route::patch('skpi/{pengajuanSkpi}/batalkan', [MahasiswaPengajuanSkpiController::class, 'batalkan'])->name('skpi.batalkan');

    Route::get('skpi/{skpi}/pdf', [SkpiPdfController::class, 'preview'])->name('skpi.pdf.preview');
    Route::get('skpi/{skpi}/pdf/download', [SkpiPdfController::class, 'download'])->name('skpi.pdf.download');

    Route::get('skpi/{pengajuanSkpi}/bukti-pdf', [MahasiswaBuktiPengajuanPdfController::class, 'preview'])->name('skpi.bukti-pdf.preview');
    Route::get('skpi/{pengajuanSkpi}/bukti-pdf/download', [MahasiswaBuktiPengajuanPdfController::class, 'download'])->name('skpi.bukti-pdf.download');
});

Route::middleware(['auth', 'role:validator'])->prefix('validator')->name('validator.')->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::get('kategori', [KategoriController::class, 'index'])->name('kategori.index');
    Route::get('kategori/create', [KategoriController::class, 'create'])->name('kategori.create');
    Route::post('kategori', [KategoriController::class, 'store'])->name('kategori.store');
    Route::get('kategori/{kategori}/edit', [KategoriController::class, 'edit'])->name('kategori.edit');
    Route::put('kategori/{kategori}', [KategoriController::class, 'update'])->name('kategori.update');
    Route::delete('kategori/{kategori}', [KategoriController::class, 'destroy'])->name('kategori.destroy');

    Route::get('identitas-pt', [IdentitasPtController::class, 'index'])->name('identitas-pt.index');
    Route::get('identitas-pt/create', [IdentitasPtController::class, 'create'])->name('identitas-pt.create');
    Route::post('identitas-pt', [IdentitasPtController::class, 'store'])->name('identitas-pt.store');
    Route::get('identitas-pt/{identitasPt}/edit', [IdentitasPtController::class, 'edit'])->name('identitas-pt.edit');
    Route::put('identitas-pt/{identitasPt}', [IdentitasPtController::class, 'update'])->name('identitas-pt.update');
    Route::delete('identitas-pt/{identitasPt}', [IdentitasPtController::class, 'destroy'])->name('identitas-pt.destroy');

    Route::get('mahasiswa', [MahasiswaController::class, 'index'])->name('mahasiswa.index');
    Route::get('mahasiswa/{mahasiswa}/edit', [MahasiswaController::class, 'edit'])->name('mahasiswa.edit');
    Route::put('mahasiswa/{mahasiswa}', [MahasiswaController::class, 'update'])->name('mahasiswa.update');
    Route::delete('mahasiswa/{mahasiswa}', [MahasiswaController::class, 'destroy'])->name('mahasiswa.destroy');

    Route::get('jurusan', [JurusanController::class, 'index'])->name('jurusan.index');
    Route::get('jurusan/create', [JurusanController::class, 'create'])->name('jurusan.create');
    Route::post('jurusan', [JurusanController::class, 'store'])->name('jurusan.store');
    Route::get('jurusan/{jurusan}/edit', [JurusanController::class, 'edit'])->name('jurusan.edit');
    Route::put('jurusan/{jurusan}', [JurusanController::class, 'update'])->name('jurusan.update');
    Route::delete('jurusan/{jurusan}', [JurusanController::class, 'destroy'])->name('jurusan.destroy');

    Route::get('skpi', [SkpiController::class, 'index'])->name('skpi.index');
    Route::get('skpi/{pengajuanSkpi}', [SkpiController::class, 'show'])->name('skpi.show');
    Route::post('skpi', [SkpiController::class, 'store'])->name('skpi.store');
    Route::patch('skpi/{pengajuanSkpi}/approve', [SkpiController::class, 'approve'])->name('skpi.approve');
    Route::patch('skpi/{pengajuanSkpi}/reject', [SkpiController::class, 'reject'])->name('skpi.reject');
    Route::get('skpi/{skpi}/pdf', [SkpiPdfController::class, 'preview'])->name('skpi.pdf.preview');
    Route::get('skpi/{skpi}/pdf/download', [SkpiPdfController::class, 'download'])->name('skpi.pdf.download');

    Route::get('pengambilan', [PengambilanController::class, 'index'])->name('pengambilan.index');
    Route::patch('pengambilan/{pengambilan}/ambil', [PengambilanController::class, 'ambil'])->name('pengambilan.ambil');
    Route::patch('pengambilan/{skpi}/batalkan', [PengambilanController::class, 'batalkan'])->name('pengambilan.batalkan');

    Route::get('laporan', fn () => redirect()->route('validator.laporan.kategori'));
    Route::get('laporan/kategori', [LaporanController::class, 'kategori'])->name('laporan.kategori');
    Route::get('laporan/kategori/pdf', [LaporanController::class, 'kategoriPdf'])->name('laporan.kategori.pdf');
    Route::get('laporan/pengajuan', [LaporanController::class, 'pengajuan'])->name('laporan.pengajuan');
    Route::get('laporan/pengajuan/pdf', [LaporanController::class, 'pengajuanPdf'])->name('laporan.pengajuan.pdf');
    Route::get('laporan/penerbitan', [LaporanController::class, 'penerbitan'])->name('laporan.penerbitan');
    Route::get('laporan/penerbitan/pdf', [LaporanController::class, 'penerbitanPdf'])->name('laporan.penerbitan.pdf');
    Route::get('laporan/pengambilan', [LaporanController::class, 'pengambilan'])->name('laporan.pengambilan');
    Route::get('laporan/pengambilan/pdf', [LaporanController::class, 'pengambilanPdf'])->name('laporan.pengambilan.pdf');
    Route::get('laporan/aktivitas', [LaporanController::class, 'aktivitas'])->name('laporan.aktivitas');
    Route::get('laporan/aktivitas/pdf', [LaporanController::class, 'aktivitasPdf'])->name('laporan.aktivitas.pdf');

    Route::get('validasi-aktivitas', [ValidasiAktivitasController::class, 'index'])->name('validasi-aktivitas.index');
    Route::get('validasi-aktivitas/{aktivitas}', [ValidasiAktivitasController::class, 'show'])->name('validasi-aktivitas.show');
    Route::patch('validasi-aktivitas/{aktivitas}/approve', [ValidasiAktivitasController::class, 'approve'])->name('validasi-aktivitas.approve');
    Route::patch('validasi-aktivitas/{aktivitas}/reject', [ValidasiAktivitasController::class, 'reject'])->name('validasi-aktivitas.reject');

    Route::get('periode-skpi', [PeriodeSkpiController::class, 'index'])->name('periode-skpi.index');
    Route::get('periode-skpi/create', [PeriodeSkpiController::class, 'create'])->name('periode-skpi.create');
    Route::post('periode-skpi', [PeriodeSkpiController::class, 'store'])->name('periode-skpi.store');
    Route::get('periode-skpi/{periodeSkpi}/edit', [PeriodeSkpiController::class, 'edit'])->name('periode-skpi.edit');
    Route::put('periode-skpi/{periodeSkpi}', [PeriodeSkpiController::class, 'update'])->name('periode-skpi.update');
    Route::delete('periode-skpi/{periodeSkpi}', [PeriodeSkpiController::class, 'destroy'])->name('periode-skpi.destroy');
});

Route::middleware(['auth', 'role:ketua'])->prefix('ketua')->name('ketua.')->group(function () {
    Route::get('dashboard', KetuaDashboardController::class)->name('dashboard');
    Route::get('laporan', fn () => redirect()->route('ketua.laporan.pengajuan'));
    Route::get('laporan/kategori', [LaporanController::class, 'kategori'])->name('laporan.kategori');
    Route::get('laporan/kategori/pdf', [LaporanController::class, 'kategoriPdf'])->name('laporan.kategori.pdf');
    Route::get('laporan/pengajuan', [LaporanController::class, 'pengajuan'])->name('laporan.pengajuan');
    Route::get('laporan/pengajuan/pdf', [LaporanController::class, 'pengajuanPdf'])->name('laporan.pengajuan.pdf');
    Route::get('laporan/penerbitan', [LaporanController::class, 'penerbitan'])->name('laporan.penerbitan');
    Route::get('laporan/penerbitan/pdf', [LaporanController::class, 'penerbitanPdf'])->name('laporan.penerbitan.pdf');
    Route::get('laporan/pengambilan', [LaporanController::class, 'pengambilan'])->name('laporan.pengambilan');
    Route::get('laporan/pengambilan/pdf', [LaporanController::class, 'pengambilanPdf'])->name('laporan.pengambilan.pdf');
    Route::get('laporan/aktivitas', [LaporanController::class, 'aktivitas'])->name('laporan.aktivitas');
    Route::get('laporan/aktivitas/pdf', [LaporanController::class, 'aktivitasPdf'])->name('laporan.aktivitas.pdf');
});

require __DIR__.'/settings.php';
