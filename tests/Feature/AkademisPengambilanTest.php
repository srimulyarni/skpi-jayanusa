<?php

use App\Models\Pengambilan;
use App\Models\User;

test('akademis can view pengambilan list', function () {
    $user = User::factory()->akademis()->create();
    Pengambilan::factory()->count(3)->create();

    $response = $this->actingAs($user)->get(route('akademis.pengambilan.index'));

    $response->assertOk();
});

test('akademis can mark pengambilan as taken', function () {
    $user = User::factory()->akademis()->create();
    $pengambilan = Pengambilan::factory()->create(['status' => 'belum_diambil']);

    $response = $this->actingAs($user)->patch(route('akademis.pengambilan.ambil', $pengambilan));

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('pengambilan', [
        'id' => $pengambilan->id,
        'status' => 'sudah_diambil',
    ]);
});

test('mahasiswa cannot access pengambilan routes', function () {
    $user = User::factory()->create();
    $pengambilan = Pengambilan::factory()->create();

    $this->actingAs($user)->get(route('akademis.pengambilan.index'))->assertStatus(403);
});
