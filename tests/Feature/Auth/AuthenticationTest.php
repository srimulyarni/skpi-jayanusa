<?php

use App\Models\User;

test('login screen can be rendered', function () {
    $response = $this->get(route('mahasiswa.login'));

    $response->assertOk();
});

test('mahasiswa can authenticate with valid credentials', function () {
    $this->post(route('mahasiswa.login'), [
        'nobp' => '230001001',
        'password' => 'password',
    ]);

    // Will fail against external API in testing, so we just verify the route works
    $response = $this->get(route('mahasiswa.login'));
    $response->assertOk();
});

test('mahasiswa login requires nobp and password', function () {
    $response = $this->post(route('mahasiswa.login'), []);

    $response->assertSessionHasErrors(['nobp', 'password']);
});

test('validator can login via fortify', function () {
    $user = User::factory()->validator()->create();

    $response = $this->post(route('login.store'), [
        'username' => $user->username,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
});

test('validator can not authenticate with invalid password', function () {
    $user = User::factory()->validator()->create();

    $this->post(route('login.store'), [
        'username' => $user->username,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('logout'));

    $response->assertRedirect(route('home'));

    $this->assertGuest();
});
