<?php

use App\Models\Aktivitas;
use App\Models\Kategori;
use App\Models\Mahasiswa;
use App\Models\PengajuanSkpi;
use App\Models\PeriodeSkpi;
use App\Models\User;

test('mahasiswa can view pengajuan skpi list', function () {
    $user = User::factory()->create();
    $mhs = Mahasiswa::factory()->create(['user_id' => $user->id, 'kompre_status' => true]);
    $this->actingAs($user)->get(route('mahasiswa.skpi.index'))->assertOk();
});

test('mahasiswa without kompre cannot create pengajuan skpi', function () {
    $user = User::factory()->create();
    Mahasiswa::factory()->create(['user_id' => $user->id, 'kompre_status' => false]);
    $this->actingAs($user)->get(route('mahasiswa.skpi.create'))->assertRedirect(route('mahasiswa.skpi.index'));
});

test('mahasiswa with kompre can create pengajuan skpi when periode aktif', function () {
    $user = User::factory()->create();
    Mahasiswa::factory()->create(['user_id' => $user->id, 'kompre_status' => true]);
    PeriodeSkpi::factory()->create(['status' => 'aktif', 'tgl_mulai' => now()->subDay(), 'tgl_selesai' => now()->addDay()]);
    $this->actingAs($user)->get(route('mahasiswa.skpi.create'))->assertOk();
});

test('mahasiswa without active periode cannot create pengajuan skpi', function () {
    $user = User::factory()->create();
    Mahasiswa::factory()->create(['user_id' => $user->id, 'kompre_status' => true]);
    $this->actingAs($user)->get(route('mahasiswa.skpi.create'))->assertRedirect(route('mahasiswa.skpi.index'));
});

test('mahasiswa can store pengajuan skpi with selected aktivitas', function () {
    $user = User::factory()->create();
    $mhs = Mahasiswa::factory()->create(['user_id' => $user->id, 'kompre_status' => true]);
    $periode = PeriodeSkpi::factory()->create(['status' => 'aktif', 'tgl_mulai' => now()->subDay(), 'tgl_selesai' => now()->addDay()]);
    $kategori = Kategori::factory()->create();
    $a1 = Aktivitas::factory()->disetujui()->create(['mahasiswa_id' => $mhs->id, 'kategori_id' => $kategori->id]);
    $a2 = Aktivitas::factory()->disetujui()->create(['mahasiswa_id' => $mhs->id, 'kategori_id' => $kategori->id]);

    $this->actingAs($user)->post(route('mahasiswa.skpi.store'), [
        'aktivitas_ids' => [$a1->id, $a2->id],
    ])->assertRedirect(route('mahasiswa.skpi.index'));

    $this->assertDatabaseHas('pengajuan_skpi', ['mahasiswa_id' => $mhs->id, 'status' => 'menunggu']);
    $pengajuan = PengajuanSkpi::where('mahasiswa_id', $mhs->id)->first();
    $this->assertNotNull($pengajuan->no_registrasi);
    $this->assertEquals(2, $pengajuan->aktivitas()->count());
});

test('mahasiswa cannot submit pengajuan skpi with empty aktivitas', function () {
    $user = User::factory()->create();
    $mhs = Mahasiswa::factory()->create(['user_id' => $user->id, 'kompre_status' => true]);
    PeriodeSkpi::factory()->create(['status' => 'aktif', 'tgl_mulai' => now()->subDay(), 'tgl_selesai' => now()->addDay()]);

    $this->actingAs($user)->post(route('mahasiswa.skpi.store'), [
        'aktivitas_ids' => [],
    ])->assertSessionHasErrors('aktivitas_ids');
});

test('mahasiswa cannot submit duplicate active pengajuan skpi', function () {
    $user = User::factory()->create();
    $mhs = Mahasiswa::factory()->create(['user_id' => $user->id, 'kompre_status' => true]);
    $periode = PeriodeSkpi::factory()->create(['status' => 'aktif', 'tgl_mulai' => now()->subDay(), 'tgl_selesai' => now()->addDay()]);
    PengajuanSkpi::factory()->create(['mahasiswa_id' => $mhs->id, 'periode_skpi_id' => $periode->id, 'status' => 'menunggu']);

    $this->actingAs($user)->get(route('mahasiswa.skpi.create'))->assertRedirect(route('mahasiswa.skpi.index'));
});

test('mahasiswa can view pengajuan skpi detail', function () {
    $user = User::factory()->create();
    $mhs = Mahasiswa::factory()->create(['user_id' => $user->id]);
    $pengajuan = PengajuanSkpi::factory()->create(['mahasiswa_id' => $mhs->id]);
    $this->actingAs($user)->get(route('mahasiswa.skpi.show', $pengajuan))->assertOk();
});

test('mahasiswa cannot view other mahasiswa pengajuan skpi', function () {
    $user = User::factory()->create();
    Mahasiswa::factory()->create(['user_id' => $user->id]);
    $otherMhs = Mahasiswa::factory()->create();
    $pengajuan = PengajuanSkpi::factory()->create(['mahasiswa_id' => $otherMhs->id]);
    $this->actingAs($user)->get(route('mahasiswa.skpi.show', $pengajuan))->assertStatus(403);
});
