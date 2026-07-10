<?php

use App\Models\IdentitasPt;
use App\Models\Jurusan;
use App\Models\Mahasiswa;
use App\Models\Pengajuan;
use App\Models\Pengambilan;
use App\Models\Skpi;
use App\Models\User;

test('akademis can view skpi list', function () {
    $user = User::factory()->akademis()->create();
    Skpi::factory()->count(2)->create();

    $response = $this->actingAs($user)->get(route('akademis.skpi.index'));

    $response->assertOk();
});

test('akademis can issue skpi for approved pengajuan', function () {
    $user = User::factory()->akademis()->create();
    $identitasPt = IdentitasPt::factory()->create(['kode_institusi' => 'STMIK']);
    $jurusan = Jurusan::factory()->create(['identitas_pt_id' => $identitasPt->id]);
    $mhs = Mahasiswa::factory()->create(['jurusan_id' => $jurusan->id]);
    $pengajuan = Pengajuan::factory()->disetujui()->create(['mahasiswa_id' => $mhs->id]);

    $response = $this->actingAs($user)->post(route('akademis.skpi.store'), [
        'pengajuan_id' => $pengajuan->id,
    ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('skpi', ['pengajuan_id' => $pengajuan->id, 'status' => 'diterbitkan']);
    $this->assertDatabaseHas('pengambilan', ['mahasiswa_id' => $mhs->id, 'status' => 'belum_diambil']);
});

test('skpi cannot be issued twice for same pengajuan', function () {
    $user = User::factory()->akademis()->create();
    $identitasPt = IdentitasPt::factory()->create();
    $jurusan = Jurusan::factory()->create(['identitas_pt_id' => $identitasPt->id]);
    $mhs = Mahasiswa::factory()->create(['jurusan_id' => $jurusan->id]);
    $pengajuan = Pengajuan::factory()->disetujui()->create(['mahasiswa_id' => $mhs->id]);
    Skpi::factory()->create(['pengajuan_id' => $pengajuan->id, 'identitas_pt_id' => $identitasPt->id]);

    $response = $this->actingAs($user)->post(route('akademis.skpi.store'), [
        'pengajuan_id' => $pengajuan->id,
    ]);

    $response->assertSessionHas('error');
});

test('skpi cannot be issued for non-approved pengajuan', function () {
    $user = User::factory()->akademis()->create();
    $pengajuan = Pengajuan::factory()->create(['status' => 'menunggu']);

    $response = $this->actingAs($user)->post(route('akademis.skpi.store'), [
        'pengajuan_id' => $pengajuan->id,
    ]);

    $response->assertSessionHas('error');
});

test('akademis can cancel skpi', function () {
    $user = User::factory()->akademis()->create();
    $skpi = Skpi::factory()->create(['status' => 'diterbitkan']);

    $response = $this->actingAs($user)->patch(route('akademis.skpi.batalkan', $skpi));

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('skpi', ['id' => $skpi->id, 'status' => 'dibatalkan']);
});

test('already cancelled skpi cannot be cancelled again', function () {
    $user = User::factory()->akademis()->create();
    $skpi = Skpi::factory()->dibatalkan()->create();

    $response = $this->actingAs($user)->patch(route('akademis.skpi.batalkan', $skpi));

    $response->assertSessionHas('error');
});

test('skpi cannot be cancelled if already picked up', function () {
    $user = User::factory()->akademis()->create();
    $skpi = Skpi::factory()->create(['status' => 'diterbitkan']);
    Pengambilan::factory()->sudahDiambil()->create(['skpi_id' => $skpi->id]);

    $response = $this->actingAs($user)->patch(route('akademis.skpi.batalkan', $skpi));

    $response->assertSessionHas('error');
});
