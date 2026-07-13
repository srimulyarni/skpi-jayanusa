<?php

use App\Models\Aktivitas;
use App\Models\Mahasiswa;
use App\Models\User;

test('validator can view validasi aktivitas list', function () {
    $user = User::factory()->validator()->create();
    Aktivitas::factory()->count(3)->create();
    $this->actingAs($user)->get(route('validator.validasi-aktivitas.index'))->assertOk();
});

test('validator can view aktivitas detail', function () {
    $user = User::factory()->validator()->create();
    $aktivitas = Aktivitas::factory()->create();
    $this->actingAs($user)->get(route('validator.validasi-aktivitas.show', $aktivitas))->assertOk();
});

test('validator can approve aktivitas', function () {
    $user = User::factory()->validator()->create();
    $aktivitas = Aktivitas::factory()->create(['status' => 'menunggu']);
    $this->actingAs($user)->patch(route('validator.validasi-aktivitas.approve', $aktivitas))->assertRedirect(route('validator.validasi-aktivitas.index'));
    $this->assertDatabaseHas('aktivitas', ['id' => $aktivitas->id, 'status' => 'disetujui', 'catatan_validator' => null]);
});

test('validator can reject aktivitas with catatan', function () {
    $user = User::factory()->validator()->create();
    $aktivitas = Aktivitas::factory()->create(['status' => 'menunggu']);
    $this->actingAs($user)->patch(route('validator.validasi-aktivitas.reject', $aktivitas), [
        'catatan_validator' => 'Bukti kurang jelas.',
    ])->assertRedirect(route('validator.validasi-aktivitas.index'));
    $this->assertDatabaseHas('aktivitas', ['id' => $aktivitas->id, 'status' => 'ditolak', 'catatan_validator' => 'Bukti kurang jelas.']);
});

test('reject requires catatan_validator', function () {
    $user = User::factory()->validator()->create();
    $aktivitas = Aktivitas::factory()->create(['status' => 'menunggu']);
    $this->actingAs($user)->patch(route('validator.validasi-aktivitas.reject', $aktivitas), [
        'catatan_validator' => '',
    ])->assertSessionHasErrors('catatan_validator');
});

test('mahasiswa cannot access validasi aktivitas routes', function () {
    $user = User::factory()->create();
    $aktivitas = Aktivitas::factory()->create();
    $this->actingAs($user)->get(route('validator.validasi-aktivitas.index'))->assertStatus(403);
    $this->actingAs($user)->get(route('validator.validasi-aktivitas.show', $aktivitas))->assertStatus(403);
});
