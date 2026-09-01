<?php

use App\Models\IdentitasPt;
use App\Models\Jurusan;
use App\Models\User;

test('validator can manage kategori', function () {
    $user = User::factory()->validator()->create();
    $this->actingAs($user)->post(route('validator.kategori.store'), [
        'nama_kategori' => 'Akademik',
        'tipe' => 'lainnya',
        'status' => 'aktif',
    ])->assertRedirect();
    $this->assertDatabaseHas('kategori', ['nama_kategori' => 'Akademik']);
    $this->actingAs($user)->get(route('validator.kategori.index'))->assertOk();
});

test('mahasiswa cannot manage kategori', function () {
    $user = User::factory()->create();
    $this->actingAs($user)->get(route('validator.kategori.index'))->assertStatus(403);
});

test('validator can manage jurusan', function () {
    $user = User::factory()->validator()->create();
    $this->actingAs($user)->get(route('validator.jurusan.index'))->assertOk();
});

test('validator can store jurusan', function () {
    $user = User::factory()->validator()->create();
    $identitasPt = IdentitasPt::factory()->create();

    $this->actingAs($user)->post(route('validator.jurusan.store'), [
        'kode' => '300',
        'nama' => 'Teknik Informatika',
        'singkatan' => 'TI',
        'identitas_pt_id' => $identitasPt->id,
    ])->assertRedirect(route('validator.jurusan.index'));

    $this->assertDatabaseHas('jurusan', ['kode' => '300', 'nama' => 'Teknik Informatika']);
});

test('validator can update jurusan', function () {
    $user = User::factory()->validator()->create();
    $jurusan = Jurusan::factory()->create();

    $this->actingAs($user)->put(route('validator.jurusan.update', $jurusan), [
        'kode' => $jurusan->kode,
        'nama' => 'Nama Jurusan Baru',
        'singkatan' => 'NJB',
        'identitas_pt_id' => $jurusan->identitas_pt_id,
    ])->assertRedirect(route('validator.jurusan.index'));

    $this->assertDatabaseHas('jurusan', ['id' => $jurusan->id, 'nama' => 'Nama Jurusan Baru']);
});

test('validator can manage identitas pt', function () {
    $user = User::factory()->validator()->create();
    $this->actingAs($user)->get(route('validator.identitas-pt.index'))->assertOk();
});

test('validator can store identitas pt', function () {
    $user = User::factory()->validator()->create();

    $this->actingAs($user)->post(route('validator.identitas-pt.store'), [
        'kode_institusi' => 'STMIK',
        'nama_pt' => 'STMIK Jayanusa',
        'nama_singkat' => 'STMIK',
        'nama_en' => 'Jayanusa College of Informatics',
        'alamat' => 'Jl. Damar No. 69E, Padang',
        'nomor_sk' => 'SK/001/2026',
        'akreditasi_institusi' => 'Baik Sekali',
        'nama_pimpinan' => 'Budi Santoso',
        'nidn' => '1234567890',
        'gelar' => 'S.Kom',
    ])->assertRedirect(route('validator.identitas-pt.index'));

    $this->assertDatabaseHas('identitas_pt', ['kode_institusi' => 'STMIK']);
});

test('validator can update identitas pt', function () {
    $user = User::factory()->validator()->create();
    $identitasPt = IdentitasPt::factory()->create();

    $this->actingAs($user)->put(route('validator.identitas-pt.update', $identitasPt), [
        'kode_institusi' => $identitasPt->kode_institusi,
        'nama_pt' => 'Nama PT Diperbarui',
        'nama_singkat' => $identitasPt->nama_singkat,
        'nama_en' => $identitasPt->nama_en,
        'alamat' => $identitasPt->alamat,
        'nomor_sk' => $identitasPt->nomor_sk,
        'akreditasi_institusi' => 'Unggul',
        'nama_pimpinan' => $identitasPt->nama_pimpinan,
        'nidn' => $identitasPt->nidn,
        'gelar' => $identitasPt->gelar,
    ])->assertRedirect(route('validator.identitas-pt.index'));

    $this->assertDatabaseHas('identitas_pt', [
        'id' => $identitasPt->id,
        'nama_pt' => 'Nama PT Diperbarui',
        'akreditasi_institusi' => 'Unggul',
    ]);
});
