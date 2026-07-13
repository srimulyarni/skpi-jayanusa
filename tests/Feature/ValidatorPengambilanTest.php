<?php

use App\Models\Pengambilan;
use App\Models\User;

test('validator can view pengambilan list', function () {
    $user = User::factory()->validator()->create();
    Pengambilan::factory()->count(3)->create();
    $this->actingAs($user)->get(route('validator.pengambilan.index'))->assertOk();
});

test('validator can mark pengambilan as taken', function () {
    $user = User::factory()->validator()->create();
    $pengambilan = Pengambilan::factory()->create(['status' => 'belum_diambil']);
    $this->actingAs($user)->patch(route('validator.pengambilan.ambil', $pengambilan))->assertSessionHas('success');
    $this->assertDatabaseHas('pengambilan', ['id' => $pengambilan->id, 'status' => 'sudah_diambil']);
});

test('mahasiswa cannot access pengambilan routes', function () {
    $user = User::factory()->create();
    $this->actingAs($user)->get(route('validator.pengambilan.index'))->assertStatus(403);
});
