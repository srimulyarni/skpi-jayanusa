<?php

use App\Models\User;

test('validator can manage kategori', function () {
    $user = User::factory()->validator()->create();
    $this->actingAs($user)->post(route('validator.kategori.store'), [
        'nama_kategori' => 'Akademik',
        'tipe' => 'lainnya',
        'status' => 'aktif',
    ])->assertRedirect();
    $this->assertDatabaseHas('kategori', ['nama_kategori' => 'Akademik']);
    $this->actingAs($user)->get(route('validator.kategori.index'))->assertOk();
});

test('mahasiswa cannot manage kategori', function () {
    $user = User::factory()->create();
    $this->actingAs($user)->get(route('validator.kategori.index'))->assertStatus(403);
});

test('validator can manage jurusan', function () {
    $user = User::factory()->validator()->create();
    $this->actingAs($user)->get(route('validator.jurusan.index'))->assertOk();
});

test('validator can manage identitas pt', function () {
    $user = User::factory()->validator()->create();
    $this->actingAs($user)->get(route('validator.identitas-pt.index'))->assertOk();
});
