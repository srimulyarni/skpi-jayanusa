<?php

use App\Models\Skpi;
use App\Models\User;

test('validator laporan index redirects to laporan kategori', function () {
    $user = User::factory()->validator()->create();
    $this->actingAs($user)->get('/validator/laporan')
        ->assertRedirect(route('validator.laporan.kategori'));
});

test('ketua laporan index redirects to laporan pengajuan', function () {
    $user = User::factory()->ketua()->create();
    $this->actingAs($user)->get('/ketua/laporan')
        ->assertRedirect(route('ketua.laporan.pengajuan'));
});

test('validator can view every laporan page', function (string $route) {
    $user = User::factory()->validator()->create();
    $this->actingAs($user)->get(route($route))->assertOk();
})->with([
    'validator.laporan.kategori',
    'validator.laporan.pengajuan',
    'validator.laporan.penerbitan',
    'validator.laporan.pengambilan',
    'validator.laporan.aktivitas',
]);

test('ketua can view every laporan page', function (string $route) {
    $user = User::factory()->ketua()->create();
    $this->actingAs($user)->get(route($route))->assertOk();
})->with([
    'ketua.laporan.kategori',
    'ketua.laporan.pengajuan',
    'ketua.laporan.penerbitan',
    'ketua.laporan.pengambilan',
    'ketua.laporan.aktivitas',
]);

test('mahasiswa cannot view laporan', function () {
    $user = User::factory()->create();
    $this->actingAs($user)->get(route('validator.laporan.kategori'))->assertStatus(403);
});

test('laporan penerbitan reports skpi status, not pengambilan status', function () {
    $user = User::factory()->validator()->create();
    $terbit = Skpi::factory()->create(['status' => 'diterbitkan']);
    $batal = Skpi::factory()->dibatalkan()->create();

    $response = $this->actingAs($user)->get(route('validator.laporan.penerbitan'));
    $response->assertOk();

    $rows = collect($response->viewData('page')['props']['data'])->keyBy('id');

    expect($rows)->toHaveKey($terbit->id)
        ->and($rows)->toHaveKey($batal->id)
        ->and($rows[$terbit->id]['status'])->toBe('diterbitkan')
        ->and($rows[$batal->id]['status'])->toBe('dibatalkan');
});

test('laporan penerbitan can filter by skpi status', function () {
    $user = User::factory()->validator()->create();
    $terbit = Skpi::factory()->create(['status' => 'diterbitkan']);
    $batal = Skpi::factory()->dibatalkan()->create();

    $response = $this->actingAs($user)
        ->get(route('validator.laporan.penerbitan', ['status' => 'dibatalkan']));
    $response->assertOk();

    $ids = collect($response->viewData('page')['props']['data'])->pluck('id');

    expect($ids)->toContain($batal->id)
        ->and($ids)->not->toContain($terbit->id);
});

test('laporan penerbitan pdf renders', function () {
    $user = User::factory()->validator()->create();
    Skpi::factory()->create(['status' => 'diterbitkan']);
    Skpi::factory()->dibatalkan()->create();

    $response = $this->actingAs($user)->get(route('validator.laporan.penerbitan.pdf'));

    $response->assertOk();
    expect($response->headers->get('content-type'))->toContain('application/pdf');
});

test('laporan penerbitan hides draft skpi by default', function () {
    $user = User::factory()->validator()->create();
    $draft = Skpi::factory()->create(['status' => 'draft']);
    $terbit = Skpi::factory()->create(['status' => 'diterbitkan']);

    $response = $this->actingAs($user)->get(route('validator.laporan.penerbitan'));
    $ids = collect($response->viewData('page')['props']['data'])->pluck('id');

    expect($ids)->toContain($terbit->id)
        ->and($ids)->not->toContain($draft->id);
});
