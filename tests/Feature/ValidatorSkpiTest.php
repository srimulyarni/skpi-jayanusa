<?php

use App\Models\IdentitasPt;
use App\Models\Jurusan;
use App\Models\Mahasiswa;
use App\Models\PengajuanSkpi;
use App\Models\Pengambilan;
use App\Models\PeriodeSkpi;
use App\Models\Skpi;
use App\Models\User;

test('validator can view skpi list', function () {
    $user = User::factory()->validator()->create();
    Skpi::factory()->count(2)->create();
    $this->actingAs($user)->get(route('validator.skpi.index'))->assertOk();
});

test('validator can issue skpi for approved pengajuan', function () {
    $user = User::factory()->validator()->create();
    $identitasPt = IdentitasPt::factory()->create(['kode_institusi' => 'STMIK']);
    $jurusan = Jurusan::factory()->create(['identitas_pt_id' => $identitasPt->id]);
    $mhs = Mahasiswa::factory()->create(['jurusan_id' => $jurusan->id]);
    $periode = PeriodeSkpi::factory()->create();
    $pengajuan = PengajuanSkpi::factory()->disetujui()->create(['mahasiswa_id' => $mhs->id, 'periode_skpi_id' => $periode->id]);

    $this->actingAs($user)->post(route('validator.skpi.store'), [
        'pengajuan_skpi_id' => $pengajuan->id,
    ])->assertSessionHas('success');

    $this->assertDatabaseHas('skpi', ['pengajuan_skpi_id' => $pengajuan->id, 'status' => 'diterbitkan']);
    $this->assertDatabaseHas('pengambilan', ['mahasiswa_id' => $mhs->id, 'status' => 'belum_diambil']);
});

test('skpi cannot be issued twice for same pengajuan', function () {
    $user = User::factory()->validator()->create();
    $identitasPt = IdentitasPt::factory()->create();
    $jurusan = Jurusan::factory()->create(['identitas_pt_id' => $identitasPt->id]);
    $mhs = Mahasiswa::factory()->create(['jurusan_id' => $jurusan->id]);
    $periode = PeriodeSkpi::factory()->create();
    $pengajuan = PengajuanSkpi::factory()->disetujui()->create(['mahasiswa_id' => $mhs->id, 'periode_skpi_id' => $periode->id]);
    Skpi::factory()->create(['pengajuan_skpi_id' => $pengajuan->id, 'identitas_pt_id' => $identitasPt->id]);

    $this->actingAs($user)->post(route('validator.skpi.store'), [
        'pengajuan_skpi_id' => $pengajuan->id,
    ])->assertSessionHas('error');
});

test('skpi cannot be issued for non-approved pengajuan', function () {
    $user = User::factory()->validator()->create();
    $periode = PeriodeSkpi::factory()->create();
    $pengajuan = PengajuanSkpi::factory()->create(['status' => 'menunggu', 'periode_skpi_id' => $periode->id]);

    $this->actingAs($user)->post(route('validator.skpi.store'), [
        'pengajuan_skpi_id' => $pengajuan->id,
    ])->assertSessionHas('error');
});

test('validator can cancel skpi', function () {
    $user = User::factory()->validator()->create();
    $skpi = Skpi::factory()->create(['status' => 'diterbitkan']);
    $this->actingAs($user)->patch(route('validator.skpi.batalkan', $skpi))->assertSessionHas('success');
    $this->assertDatabaseHas('skpi', ['id' => $skpi->id, 'status' => 'dibatalkan']);
});

test('already cancelled skpi cannot be cancelled again', function () {
    $user = User::factory()->validator()->create();
    $skpi = Skpi::factory()->dibatalkan()->create();
    $this->actingAs($user)->patch(route('validator.skpi.batalkan', $skpi))->assertSessionHas('error');
});

test('skpi cannot be cancelled if already picked up', function () {
    $user = User::factory()->validator()->create();
    $skpi = Skpi::factory()->create(['status' => 'diterbitkan']);
    Pengambilan::factory()->sudahDiambil()->create(['skpi_id' => $skpi->id]);
    $this->actingAs($user)->patch(route('validator.skpi.batalkan', $skpi))->assertSessionHas('error');
});

test('mahasiswa cannot access validator skpi routes', function () {
    $user = User::factory()->create();
    $this->actingAs($user)->get(route('validator.skpi.index'))->assertStatus(403);
});
