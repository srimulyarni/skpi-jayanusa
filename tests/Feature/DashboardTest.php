<?php

use App\Models\Mahasiswa;
use App\Models\User;

test('mahasiswa guests are redirected to login', function () {
    $response = $this->get(route('mahasiswa.dashboard'));
    $response->assertRedirect(route('login'));
});

test('validator guests are redirected to login', function () {
    $response = $this->get(route('validator.dashboard'));
    $response->assertRedirect(route('login'));
});

test('mahasiswa can visit their dashboard', function () {
    $user = User::factory()->create();
    Mahasiswa::factory()->create(['user_id' => $user->id]);
    $this->actingAs($user)->get(route('mahasiswa.dashboard'))->assertOk();
});

test('validator can visit their dashboard', function () {
    $user = User::factory()->validator()->create();
    $this->actingAs($user)->get(route('validator.dashboard'))->assertOk();
});

test('mahasiswa cannot access validator dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user)->get(route('validator.dashboard'))->assertStatus(403);
});

test('validator cannot access mahasiswa dashboard', function () {
    $user = User::factory()->validator()->create();
    $this->actingAs($user)->get(route('mahasiswa.dashboard'))->assertStatus(403);
});
