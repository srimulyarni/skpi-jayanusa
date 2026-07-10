<?php

use App\Models\Pengajuan;
use App\Models\User;

test('akademis can view pengajuan list', function () {
    $user = User::factory()->akademis()->create();
    Pengajuan::factory()->count(3)->create();

    $response = $this->actingAs($user)->get(route('akademis.pengajuan.index'));

    $response->assertOk();
});

test('akademis pengajuan list excludes drafts', function () {
    $user = User::factory()->akademis()->create();
    Pengajuan::factory()->count(2)->create(['status' => 'menunggu']);
    Pengajuan::factory()->count(2)->draft()->create();

    $response = $this->actingAs($user)->get(route('akademis.pengajuan.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->has('pengajuan')
        ->where('pengajuan.total', 2));
});

test('akademis can view pengajuan detail', function () {
    $user = User::factory()->akademis()->create();
    $pengajuan = Pengajuan::factory()->create();

    $response = $this->actingAs($user)->get(route('akademis.pengajuan.show', $pengajuan));

    $response->assertOk();
});

test('akademis can update pengajuan status', function () {
    $user = User::factory()->akademis()->create();
    $pengajuan = Pengajuan::factory()->create(['status' => 'menunggu']);

    $response = $this->actingAs($user)->patch(route('akademis.pengajuan.status', $pengajuan), [
        'status' => 'diproses',
    ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('pengajuan', ['id' => $pengajuan->id, 'status' => 'diproses']);
});

test('akademis can approve pengajuan', function () {
    $user = User::factory()->akademis()->create();
    $pengajuan = Pengajuan::factory()->create(['status' => 'diproses']);

    $response = $this->actingAs($user)->patch(route('akademis.pengajuan.status', $pengajuan), [
        'status' => 'disetujui',
    ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('pengajuan', ['id' => $pengajuan->id, 'status' => 'disetujui']);
});

test('akademis can request revision with catatan', function () {
    $user = User::factory()->akademis()->create();
    $pengajuan = Pengajuan::factory()->create(['status' => 'diproses']);

    $response = $this->actingAs($user)->patch(route('akademis.pengajuan.status', $pengajuan), [
        'status' => 'revisi',
        'catatan_akademis' => 'Bukti kurang jelas.',
    ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('pengajuan', [
        'id' => $pengajuan->id,
        'status' => 'revisi',
        'catatan_akademis' => 'Bukti kurang jelas.',
    ]);
});

test('revisi status requires catatan_akademis', function () {
    $user = User::factory()->akademis()->create();
    $pengajuan = Pengajuan::factory()->create(['status' => 'diproses']);

    $response = $this->actingAs($user)->patch(route('akademis.pengajuan.status', $pengajuan), [
        'status' => 'revisi',
    ]);

    $response->assertSessionHasErrors('catatan_akademis');
});

test('mahasiswa cannot access akademis pengajuan routes', function () {
    $user = User::factory()->create();
    $pengajuan = Pengajuan::factory()->create();

    $this->actingAs($user)->get(route('akademis.pengajuan.index'))->assertStatus(403);
    $this->actingAs($user)->get(route('akademis.pengajuan.show', $pengajuan))->assertStatus(403);
});
