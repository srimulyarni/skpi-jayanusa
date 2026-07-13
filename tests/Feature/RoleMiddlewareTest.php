<?php

use App\Models\User;

test('role middleware allows matching role', function () {
    $user = User::factory()->create(['role' => 'mahasiswa']);
    $this->actingAs($user)->get(route('mahasiswa.dashboard'))->assertOk();
});

test('role middleware blocks non-matching role', function () {
    $user = User::factory()->create(['role' => 'mahasiswa']);
    $this->actingAs($user)->get(route('validator.dashboard'))->assertStatus(403);
});

test('role middleware blocks unauthenticated users', function () {
    $this->get(route('mahasiswa.dashboard'))->assertRedirect(route('login'));
});

test('ketua role can access ketua routes', function () {
    $user = User::factory()->ketua()->create();
    $this->actingAs($user)->get(route('ketua.dashboard'))->assertOk();
});

test('mahasiswa role cannot access ketua routes', function () {
    $user = User::factory()->create(['role' => 'mahasiswa']);
    $this->actingAs($user)->get(route('ketua.dashboard'))->assertStatus(403);
});
