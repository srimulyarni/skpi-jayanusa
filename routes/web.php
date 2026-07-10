<?php

use App\Http\Controllers\Akademis\IdentitasPtController;
use App\Http\Controllers\Akademis\JurusanController;
use App\Http\Controllers\Akademis\KategoriController;
use App\Http\Controllers\Akademis\LaporanController;
use App\Http\Controllers\Akademis\MahasiswaController;
use App\Http\Controllers\Akademis\PengajuanController;
use App\Http\Controllers\Akademis\PengambilanController;
use App\Http\Controllers\Akademis\SkpiController;
use App\Http\Controllers\Akademis\SkpiPdfController;
use App\Http\Controllers\Auth\MahasiswaLoginController;
use App\Http\Controllers\Mahasiswa\MahasiswaPengajuanController;
use App\Http\Controllers\Mahasiswa\MahasiswaProfileController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::get('/mahasiswa/login', [MahasiswaLoginController::class, 'show'])->name('mahasiswa.login');
Route::post('/mahasiswa/login', [MahasiswaLoginController::class, 'store']);

Route::middleware(['auth', 'role:mahasiswa'])->prefix('mahasiswa')->name('mahasiswa.')->group(function () {
    Route::inertia('dashboard', 'mahasiswa/dashboard')->name('dashboard');
    Route::get('profil', [MahasiswaProfileController::class, 'edit'])->name('profil.edit');
    Route::put('profil', [MahasiswaProfileController::class, 'update'])->name('profil.update');

    Route::get('pengajuan', [MahasiswaPengajuanController::class, 'index'])->name('pengajuan.index');
    Route::get('pengajuan/create', [MahasiswaPengajuanController::class, 'create'])->name('pengajuan.create');
    Route::post('pengajuan', [MahasiswaPengajuanController::class, 'store'])->name('pengajuan.store');
    Route::get('pengajuan/{pengajuan}', [MahasiswaPengajuanController::class, 'show'])->name('pengajuan.show');
    Route::get('pengajuan/{pengajuan}/edit', [MahasiswaPengajuanController::class, 'edit'])->name('pengajuan.edit');
    Route::put('pengajuan/{pengajuan}', [MahasiswaPengajuanController::class, 'update'])->name('pengajuan.update');
    Route::post('pengajuan/{pengajuan}/ajukan', [MahasiswaPengajuanController::class, 'ajukan'])->name('pengajuan.ajukan');

    Route::get('skpi/{skpi}/pdf', [SkpiPdfController::class, 'preview'])->name('skpi.pdf.preview');
    Route::get('skpi/{skpi}/pdf/download', [SkpiPdfController::class, 'download'])->name('skpi.pdf.download');
});

Route::middleware(['auth', 'role:akademis'])->prefix('akademis')->name('akademis.')->group(function () {
    Route::inertia('dashboard', 'akademis/dashboard')->name('dashboard');

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

    Route::get('pengajuan', [PengajuanController::class, 'index'])->name('pengajuan.index');
    Route::get('pengajuan/{pengajuan}', [PengajuanController::class, 'show'])->name('pengajuan.show');
    Route::patch('pengajuan/{pengajuan}/status', [PengajuanController::class, 'updateStatus'])->name('pengajuan.status');

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
    Route::post('skpi', [SkpiController::class, 'store'])->name('skpi.store');
    Route::patch('skpi/{skpi}/batalkan', [SkpiController::class, 'batalkan'])->name('skpi.batalkan');
    Route::get('skpi/{skpi}/pdf', [SkpiPdfController::class, 'preview'])->name('skpi.pdf.preview');
    Route::get('skpi/{skpi}/pdf/download', [SkpiPdfController::class, 'download'])->name('skpi.pdf.download');

    Route::get('pengambilan', [PengambilanController::class, 'index'])->name('pengambilan.index');
    Route::patch('pengambilan/{pengambilan}/ambil', [PengambilanController::class, 'ambil'])->name('pengambilan.ambil');

    Route::get('laporan', [LaporanController::class, 'index'])->name('laporan.index');
});

Route::middleware(['auth', 'role:ketua'])->prefix('ketua')->name('ketua.')->group(function () {
    Route::inertia('dashboard', 'ketua/dashboard')->name('dashboard');
    Route::get('laporan', [LaporanController::class, 'index'])->name('laporan.index');
});

require __DIR__.'/settings.php';
