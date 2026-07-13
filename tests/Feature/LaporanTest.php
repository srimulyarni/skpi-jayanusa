<?php

use App\Models\Mahasiswa;
use App\Models\Skpi;
use App\Models\User;

test('validator can view laporan', function () {
    $user = User::factory()->validator()->create();
    $this->actingAs($user)->get(route('validator.laporan.index'))->assertOk();
});

test('ketua can view laporan', function () {
    $user = User::factory()->ketua()->create();
    $this->actingAs($user)->get(route('ketua.laporan.index'))->assertOk();
});

test('laporan filters by year', function () {
    $user = User::factory()->validator()->create();
    $this->actingAs($user)->get(route('validator.laporan.index', ['tahun' => 2026]))->assertOk();
});

test('laporan filters by month', function () {
    $user = User::factory()->validator()->create();
    $this->actingAs($user)->get(route('validator.laporan.index', ['tahun' => 2026, 'bulan' => 7]))->assertOk();
});
