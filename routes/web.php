<?php

use App\Http\Controllers\Auth\MahasiswaLoginController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::get('/mahasiswa/login', [MahasiswaLoginController::class, 'show'])->name('mahasiswa.login');
Route::post('/mahasiswa/login', [MahasiswaLoginController::class, 'store']);

Route::middleware(['auth', 'role:mahasiswa'])->prefix('mahasiswa')->name('mahasiswa.')->group(function () {
    Route::inertia('dashboard', 'mahasiswa/dashboard')->name('dashboard');
});

Route::middleware(['auth', 'role:akademis'])->prefix('akademis')->name('akademis.')->group(function () {
    Route::inertia('dashboard', 'akademis/dashboard')->name('dashboard');
});

Route::middleware(['auth', 'role:ketua'])->prefix('ketua')->name('ketua.')->group(function () {
    Route::inertia('dashboard', 'ketua/dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
