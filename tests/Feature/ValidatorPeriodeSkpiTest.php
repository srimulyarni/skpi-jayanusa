<?php

use App\Models\PeriodeSkpi;
use App\Models\User;

test('validator can view periode skpi list', function () {
    $user = User::factory()->validator()->create();
    PeriodeSkpi::factory()->count(2)->create();
    $this->actingAs($user)->get(route('validator.periode-skpi.index'))->assertOk();
});

test('validator can create periode skpi', function () {
    $user = User::factory()->validator()->create();
    $this->actingAs($user)->get(route('validator.periode-skpi.create'))->assertOk();
});

test('validator can store periode skpi', function () {
    $user = User::factory()->validator()->create();
    $this->actingAs($user)->post(route('validator.periode-skpi.store'), [
        'nama' => 'Periode Juli 2026',
        'tgl_mulai' => '2026-07-01',
        'tgl_selesai' => '2026-12-31',
        'status' => 'aktif',
    ])->assertRedirect(route('validator.periode-skpi.index'));
    $this->assertDatabaseHas('periode_skpi', ['nama' => 'Periode Juli 2026', 'status' => 'aktif']);
});

test('validator can edit periode skpi', function () {
    $user = User::factory()->validator()->create();
    $periode = PeriodeSkpi::factory()->create();
    $this->actingAs($user)->get(route('validator.periode-skpi.edit', $periode))->assertOk();
});

test('validator can update periode skpi', function () {
    $user = User::factory()->validator()->create();
    $periode = PeriodeSkpi::factory()->create();
    $this->actingAs($user)->put(route('validator.periode-skpi.update', $periode), [
        'nama' => 'Updated Periode',
        'tgl_mulai' => '2026-08-01',
        'tgl_selesai' => '2026-12-31',
        'status' => 'nonaktif',
    ])->assertRedirect(route('validator.periode-skpi.index'));
    $this->assertDatabaseHas('periode_skpi', ['id' => $periode->id, 'nama' => 'Updated Periode', 'status' => 'nonaktif']);
});

test('validator can delete periode skpi', function () {
    $user = User::factory()->validator()->create();
    $periode = PeriodeSkpi::factory()->create();
    $this->actingAs($user)->delete(route('validator.periode-skpi.destroy', $periode))->assertRedirect(route('validator.periode-skpi.index'));
    $this->assertDatabaseMissing('periode_skpi', ['id' => $periode->id]);
});

test('mahasiswa cannot access periode skpi routes', function () {
    $user = User::factory()->create();
    $periode = PeriodeSkpi::factory()->create();
    $this->actingAs($user)->get(route('validator.periode-skpi.index'))->assertStatus(403);
    $this->actingAs($user)->get(route('validator.periode-skpi.create'))->assertStatus(403);
    $this->actingAs($user)->get(route('validator.periode-skpi.edit', $periode))->assertStatus(403);
});
