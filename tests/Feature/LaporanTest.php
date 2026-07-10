<?php

use App\Models\User;

test('akademis can view laporan', function () {
    $user = User::factory()->akademis()->create();

    $response = $this->actingAs($user)->get(route('akademis.laporan.index'));

    $response->assertOk();
});

test('ketua can view laporan', function () {
    $user = User::factory()->ketua()->create();

    $response = $this->actingAs($user)->get(route('ketua.laporan.index'));

    $response->assertOk();
});

test('mahasiswa cannot view laporan', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get(route('akademis.laporan.index'))->assertStatus(403);
});

test('laporan filters by year', function () {
    $user = User::factory()->akademis()->create();

    $response = $this->actingAs($user)->get(route('akademis.laporan.index', ['tahun' => 2026]));

    $response->assertOk();
});
