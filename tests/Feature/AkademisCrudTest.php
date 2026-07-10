<?php

use App\Models\User;

test('akademis can manage kategori', function () {
    $user = User::factory()->akademis()->create();

    // Create
    $response = $this->actingAs($user)->post(route('akademis.kategori.store'), [
        'nama_kategori' => 'Akademik',
        'status' => 'aktif',
    ]);
    $response->assertRedirect();
    $this->assertDatabaseHas('kategori', ['nama_kategori' => 'Akademik']);

    // Index
    $this->actingAs($user)->get(route('akademis.kategori.index'))->assertOk();
});

test('mahasiswa cannot manage kategori', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get(route('akademis.kategori.index'))->assertStatus(403);
});

test('akademis can manage jurusan', function () {
    $user = User::factory()->akademis()->create();

    $response = $this->actingAs($user)->get(route('akademis.jurusan.index'));
    $response->assertOk();
});

test('akademis can manage identitas pt', function () {
    $user = User::factory()->akademis()->create();

    $response = $this->actingAs($user)->get(route('akademis.identitas-pt.index'));
    $response->assertOk();
});
