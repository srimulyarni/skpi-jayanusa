<?php

use App\Models\Aktivitas;
use App\Models\Kategori;
use App\Models\Mahasiswa;
use App\Models\User;

test('mahasiswa can view aktivitas list', function () {
    $user = User::factory()->create();
    $mhs = Mahasiswa::factory()->create(['user_id' => $user->id]);
    Aktivitas::factory()->count(3)->create(['mahasiswa_id' => $mhs->id]);
    $this->actingAs($user)->get(route('mahasiswa.aktivitas.index'))->assertOk();
});

test('mahasiswa can create aktivitas', function () {
    $user = User::factory()->create();
    Mahasiswa::factory()->create(['user_id' => $user->id]);
    $kategori = Kategori::factory()->create();
    $this->actingAs($user)->get(route('mahasiswa.aktivitas.create'))->assertOk();
});

test('mahasiswa can store aktivitas', function () {
    $user = User::factory()->create();
    $mhs = Mahasiswa::factory()->create(['user_id' => $user->id]);
    $kategori = Kategori::factory()->create();
    $response = $this->actingAs($user)->post(route('mahasiswa.aktivitas.store'), [
        'kategori_id' => $kategori->id,
        'nama_kegiatan' => 'Test Kegiatan',
        'tahun_kegiatan' => '2026',
        'peran' => 'Peserta',
        'bukti_link' => 'https://drive.google.com/file/d/test/view',
    ]);
    $response->assertRedirect(route('mahasiswa.aktivitas.index'));
    $this->assertDatabaseHas('aktivitas', ['mahasiswa_id' => $mhs->id, 'nama_kegiatan' => 'Test Kegiatan', 'status' => 'menunggu']);
});

test('mahasiswa can store lomba aktivitas with juara and tingkat', function () {
    $user = User::factory()->create();
    Mahasiswa::factory()->create(['user_id' => $user->id]);
    $kategori = Kategori::factory()->lomba()->create();
    $this->actingAs($user)->post(route('mahasiswa.aktivitas.store'), [
        'kategori_id' => $kategori->id,
        'nama_kegiatan' => 'Lomba KTI',
        'tahun_kegiatan' => '2026',
        'peran' => 'Ketua',
        'juara' => 'Juara 1',
        'tingkat' => 'nasional',
    ])->assertRedirect(route('mahasiswa.aktivitas.index'));
    $this->assertDatabaseHas('aktivitas', ['nama_kegiatan' => 'Lomba KTI', 'juara' => 'Juara 1', 'tingkat' => 'nasional']);
});

test('mahasiswa can view their own aktivitas', function () {
    $user = User::factory()->create();
    $mhs = Mahasiswa::factory()->create(['user_id' => $user->id]);
    $aktivitas = Aktivitas::factory()->create(['mahasiswa_id' => $mhs->id]);
    $this->actingAs($user)->get(route('mahasiswa.aktivitas.show', $aktivitas))->assertOk();
});

test('mahasiswa cannot view other mahasiswa aktivitas', function () {
    $user = User::factory()->create();
    Mahasiswa::factory()->create(['user_id' => $user->id]);
    $otherMhs = Mahasiswa::factory()->create();
    $aktivitas = Aktivitas::factory()->create(['mahasiswa_id' => $otherMhs->id]);
    $this->actingAs($user)->get(route('mahasiswa.aktivitas.show', $aktivitas))->assertStatus(403);
});

test('mahasiswa can edit menunggu aktivitas', function () {
    $user = User::factory()->create();
    $mhs = Mahasiswa::factory()->create(['user_id' => $user->id]);
    $aktivitas = Aktivitas::factory()->create(['mahasiswa_id' => $mhs->id, 'status' => 'menunggu']);
    $this->actingAs($user)->get(route('mahasiswa.aktivitas.edit', $aktivitas))->assertOk();
});

test('mahasiswa cannot edit disetujui aktivitas', function () {
    $user = User::factory()->create();
    $mhs = Mahasiswa::factory()->create(['user_id' => $user->id]);
    $aktivitas = Aktivitas::factory()->disetujui()->create(['mahasiswa_id' => $mhs->id]);
    $this->actingAs($user)->get(route('mahasiswa.aktivitas.edit', $aktivitas))->assertRedirect(route('mahasiswa.aktivitas.index'));
});

test('mahasiswa can update aktivitas', function () {
    $user = User::factory()->create();
    $mhs = Mahasiswa::factory()->create(['user_id' => $user->id]);
    $kategori = Kategori::factory()->create();
    $aktivitas = Aktivitas::factory()->create(['mahasiswa_id' => $mhs->id, 'status' => 'menunggu']);
    $this->actingAs($user)->put(route('mahasiswa.aktivitas.update', $aktivitas), [
        'kategori_id' => $kategori->id,
        'nama_kegiatan' => 'Updated',
        'tahun_kegiatan' => '2026',
        'peran' => 'Ketua',
    ])->assertRedirect(route('mahasiswa.aktivitas.index'));
    $this->assertDatabaseHas('aktivitas', ['id' => $aktivitas->id, 'nama_kegiatan' => 'Updated', 'status' => 'menunggu']);
});

test('mahasiswa can delete menunggu aktivitas', function () {
    $user = User::factory()->create();
    $mhs = Mahasiswa::factory()->create(['user_id' => $user->id]);
    $aktivitas = Aktivitas::factory()->create(['mahasiswa_id' => $mhs->id, 'status' => 'menunggu']);
    $this->actingAs($user)->delete(route('mahasiswa.aktivitas.destroy', $aktivitas))->assertRedirect(route('mahasiswa.aktivitas.index'));
    $this->assertDatabaseMissing('aktivitas', ['id' => $aktivitas->id]);
});

test('mahasiswa cannot delete disetujui aktivitas', function () {
    $user = User::factory()->create();
    $mhs = Mahasiswa::factory()->create(['user_id' => $user->id]);
    $aktivitas = Aktivitas::factory()->disetujui()->create(['mahasiswa_id' => $mhs->id]);
    $this->actingAs($user)->delete(route('mahasiswa.aktivitas.destroy', $aktivitas))->assertSessionHas('error');
    $this->assertDatabaseHas('aktivitas', ['id' => $aktivitas->id]);
});
