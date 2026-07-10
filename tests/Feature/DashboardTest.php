<?php

use App\Models\Mahasiswa;
use App\Models\User;

test('mahasiswa guests are redirected to login', function () {
    $response = $this->get(route('mahasiswa.dashboard'));

    $response->assertRedirect(route('login'));
});

test('akademis guests are redirected to login', function () {
    $response = $this->get(route('akademis.dashboard'));

    $response->assertRedirect(route('login'));
});

test('mahasiswa can visit their dashboard', function () {
    $user = User::factory()->create();
    Mahasiswa::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->get(route('mahasiswa.dashboard'));

    $response->assertOk();
});

test('akademis can visit their dashboard', function () {
    $user = User::factory()->akademis()->create();

    $response = $this->actingAs($user)->get(route('akademis.dashboard'));

    $response->assertOk();
});

test('mahasiswa cannot access akademis dashboard', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('akademis.dashboard'));

    $response->assertStatus(403);
});

test('akademis cannot access mahasiswa dashboard', function () {
    $user = User::factory()->akademis()->create();

    $response = $this->actingAs($user)->get(route('mahasiswa.dashboard'));

    $response->assertStatus(403);
});
