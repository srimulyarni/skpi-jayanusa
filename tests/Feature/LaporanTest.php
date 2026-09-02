<?php

use App\Models\PengajuanSkpi;
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

test('laporan penerbitan lists every pengajuan, including those without skpi', function () {
    $user = User::factory()->validator()->create();

    $belumTerbit = PengajuanSkpi::factory()->disetujui()->create();
    $sudahTerbit = PengajuanSkpi::factory()->disetujui()->create();
    Skpi::factory()->create(['pengajuan_skpi_id' => $sudahTerbit->id, 'status' => 'diterbitkan']);
    $dibatalkan = PengajuanSkpi::factory()->disetujui()->create();
    Skpi::factory()->dibatalkan()->create(['pengajuan_skpi_id' => $dibatalkan->id]);

    $response = $this->actingAs($user)->get(route('validator.laporan.penerbitan'));
    $response->assertOk();

    $rows = collect($response->viewData('page')['props']['data'])->keyBy('id');

    expect($rows)->toHaveCount(3)
        ->and($rows[$belumTerbit->id]['skpi'])->toBeNull()
        ->and($rows[$sudahTerbit->id]['skpi']['status'])->toBe('diterbitkan')
        ->and($rows[$dibatalkan->id]['skpi']['status'])->toBe('dibatalkan');
});

test('laporan penerbitan can filter by penerbitan status', function (string $status, string $kunci) {
    $user = User::factory()->validator()->create();

    $belumTerbit = PengajuanSkpi::factory()->disetujui()->create();
    $sudahTerbit = PengajuanSkpi::factory()->disetujui()->create();
    Skpi::factory()->create(['pengajuan_skpi_id' => $sudahTerbit->id, 'status' => 'diterbitkan']);

    $harapan = ['belum_terbit' => $belumTerbit, 'diterbitkan' => $sudahTerbit];

    $response = $this->actingAs($user)
        ->get(route('validator.laporan.penerbitan', ['status' => $status]));
    $response->assertOk();

    $ids = collect($response->viewData('page')['props']['data'])->pluck('id');

    expect($ids)->toContain($harapan[$kunci]->id)->toHaveCount(1);
})->with([
    ['belum_terbit', 'belum_terbit'],
    ['diterbitkan', 'diterbitkan'],
]);

test('laporan penerbitan pdf renders', function () {
    $user = User::factory()->validator()->create();

    PengajuanSkpi::factory()->disetujui()->create();
    $terbit = PengajuanSkpi::factory()->disetujui()->create();
    Skpi::factory()->create(['pengajuan_skpi_id' => $terbit->id, 'status' => 'diterbitkan']);

    $response = $this->actingAs($user)->get(route('validator.laporan.penerbitan.pdf'));

    $response->assertOk();
    expect($response->headers->get('content-type'))->toContain('application/pdf');
});
