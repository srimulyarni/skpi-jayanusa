<?php

use App\Models\User;

test('role middleware allows matching role', function () {
    $user = User::factory()->create(['role' => 'mahasiswa']);

    $response = $this->actingAs($user)->get(route('mahasiswa.dashboard'));

    $response->assertOk();
});

test('role middleware blocks non-matching role', function () {
    $user = User::factory()->create(['role' => 'mahasiswa']);

    $response = $this->actingAs($user)->get(route('akademis.dashboard'));

    $response->assertStatus(403);
});

test('role middleware blocks unauthenticated users', function () {
    $response = $this->get(route('mahasiswa.dashboard'));

    $response->assertRedirect(route('login'));
});

test('ketua role can access ketua routes', function () {
    $user = User::factory()->ketua()->create();

    $response = $this->actingAs($user)->get(route('ketua.dashboard'));

    $response->assertOk();
});

test('mahasiswa role cannot access ketua routes', function () {
    $user = User::factory()->create(['role' => 'mahasiswa']);

    $response = $this->actingAs($user)->get(route('ketua.dashboard'));

    $response->assertStatus(403);
});
