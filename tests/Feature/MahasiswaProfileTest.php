<?php

use App\Models\Mahasiswa;
use App\Models\User;

test('mahasiswa can view their profile', function () {
    $user = User::factory()->create();
    Mahasiswa::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->get(route('mahasiswa.profil.edit'));

    $response->assertOk();
});

test('mahasiswa can update their profile', function () {
    $user = User::factory()->create();
    Mahasiswa::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->put(route('mahasiswa.profil.update'), [
        'tempat_lahir' => 'Padang',
        'tanggal_lahir' => '2001-05-15',
        'jk' => 'L',
        'nohp' => '081234567890',
        'alamat' => 'Jl. Test No. 123',
    ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('mahasiswa', [
        'user_id' => $user->id,
        'tempat_lahir' => 'Padang',
    ]);
});

test('mahasiswa profile validation requires mandatory fields', function () {
    $user = User::factory()->create();
    Mahasiswa::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->put(route('mahasiswa.profil.update'), []);

    $response->assertSessionHasErrors(['tempat_lahir', 'tanggal_lahir', 'jk', 'nohp', 'alamat']);
});
