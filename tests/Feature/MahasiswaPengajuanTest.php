<?php

use App\Models\Kategori;
use App\Models\Mahasiswa;
use App\Models\Pengajuan;
use App\Models\User;

test('mahasiswa can view pengajuan list', function () {
    $user = User::factory()->create();
    $mhs = Mahasiswa::factory()->create(['user_id' => $user->id]);
    Pengajuan::factory()->count(3)->create(['mahasiswa_id' => $mhs->id]);

    $response = $this->actingAs($user)->get(route('mahasiswa.pengajuan.index'));

    $response->assertOk();
});

test('mahasiswa cannot create pengajuan when one is active', function () {
    $user = User::factory()->create();
    $mhs = Mahasiswa::factory()->create(['user_id' => $user->id]);
    Pengajuan::factory()->create(['mahasiswa_id' => $mhs->id, 'status' => 'menunggu']);

    $response = $this->actingAs($user)->get(route('mahasiswa.pengajuan.create'));

    $response->assertRedirect(route('mahasiswa.pengajuan.index'));
});

test('mahasiswa cannot create pengajuan when draft exists', function () {
    $user = User::factory()->create();
    $mhs = Mahasiswa::factory()->create(['user_id' => $user->id]);
    Pengajuan::factory()->draft()->create(['mahasiswa_id' => $mhs->id]);

    $response = $this->actingAs($user)->get(route('mahasiswa.pengajuan.create'));

    $response->assertRedirect(route('mahasiswa.pengajuan.index'));
});

test('mahasiswa can view their own pengajuan', function () {
    $user = User::factory()->create();
    $mhs = Mahasiswa::factory()->create(['user_id' => $user->id]);
    $pengajuan = Pengajuan::factory()->create(['mahasiswa_id' => $mhs->id]);

    $response = $this->actingAs($user)->get(route('mahasiswa.pengajuan.show', $pengajuan));

    $response->assertOk();
});

test('mahasiswa cannot view other mahasiswa pengajuan', function () {
    $user = User::factory()->create();
    $mhs = Mahasiswa::factory()->create(['user_id' => $user->id]);

    $otherMhs = Mahasiswa::factory()->create();
    $otherPengajuan = Pengajuan::factory()->create(['mahasiswa_id' => $otherMhs->id]);

    $response = $this->actingAs($user)->get(route('mahasiswa.pengajuan.show', $otherPengajuan));

    $response->assertStatus(403);
});

test('mahasiswa can store pengajuan as draft', function () {
    $user = User::factory()->create();
    $mhs = Mahasiswa::factory()->create(['user_id' => $user->id]);
    $kategori = Kategori::factory()->create();

    $response = $this->actingAs($user)->post(route('mahasiswa.pengajuan.store'), [
        'kegiatan' => [
            [
                'kategori_id' => $kategori->id,
                'nama_kegiatan' => 'Test Kegiatan',
                'tahun_kegiatan' => '2026',
                'peran' => 'Peserta',
            ],
        ],
    ]);

    $response->assertRedirect(route('mahasiswa.pengajuan.index'));
    $this->assertDatabaseHas('pengajuan', ['mahasiswa_id' => $mhs->id, 'status' => 'draft', 'no_registrasi' => null, 'tgl_pengajuan' => null]);
    $this->assertDatabaseHas('detail_pengajuan', ['nama_kegiatan' => 'Test Kegiatan']);
});

test('mahasiswa can ajukan draft pengajuan', function () {
    $user = User::factory()->create();
    $mhs = Mahasiswa::factory()->create(['user_id' => $user->id, 'nomor_ijazah' => null]);
    $kategori = Kategori::factory()->create();
    $pengajuan = Pengajuan::factory()->draft()->create(['mahasiswa_id' => $mhs->id]);
    $pengajuan->detailPengajuan()->create(['kategori_id' => $kategori->id, 'nama_kegiatan' => 'Test', 'tahun_kegiatan' => '2026', 'peran' => 'Peserta']);

    $response = $this->actingAs($user)->post(route('mahasiswa.pengajuan.ajukan', $pengajuan), [
        'nomor_ijazah' => 'IJZ-123',
    ]);

    $response->assertRedirect(route('mahasiswa.pengajuan.index'));
    $this->assertDatabaseHas('pengajuan', ['id' => $pengajuan->id, 'status' => 'menunggu']);
    $this->assertDatabaseHas('mahasiswa', ['id' => $mhs->id, 'nomor_ijazah' => 'IJZ-123']);
    $this->assertNotNull($pengajuan->fresh()->no_registrasi);
    $this->assertNotNull($pengajuan->fresh()->tgl_pengajuan);
});

test('mahasiswa cannot ajukan draft without nomor ijazah', function () {
    $user = User::factory()->create();
    $mhs = Mahasiswa::factory()->create(['user_id' => $user->id, 'nomor_ijazah' => null]);
    $kategori = Kategori::factory()->create();
    $pengajuan = Pengajuan::factory()->draft()->create(['mahasiswa_id' => $mhs->id]);
    $pengajuan->detailPengajuan()->create(['kategori_id' => $kategori->id, 'nama_kegiatan' => 'Test', 'tahun_kegiatan' => '2026', 'peran' => 'Peserta']);

    $response = $this->actingAs($user)->post(route('mahasiswa.pengajuan.ajukan', $pengajuan), [
        'nomor_ijazah' => '',
    ]);

    $response->assertSessionHasErrors('nomor_ijazah');
    $this->assertDatabaseHas('pengajuan', ['id' => $pengajuan->id, 'status' => 'draft']);
});

test('mahasiswa cannot ajukan draft without kegiatan', function () {
    $user = User::factory()->create();
    $mhs = Mahasiswa::factory()->create(['user_id' => $user->id, 'nomor_ijazah' => null]);
    $pengajuan = Pengajuan::factory()->draft()->create(['mahasiswa_id' => $mhs->id]);

    $response = $this->actingAs($user)->post(route('mahasiswa.pengajuan.ajukan', $pengajuan), [
        'nomor_ijazah' => 'IJZ-123',
    ]);

    $response->assertSessionHas('error');
    $this->assertDatabaseHas('pengajuan', ['id' => $pengajuan->id, 'status' => 'draft']);
});

test('mahasiswa cannot ajukan non-draft pengajuan', function () {
    $user = User::factory()->create();
    $mhs = Mahasiswa::factory()->create(['user_id' => $user->id]);
    $pengajuan = Pengajuan::factory()->create(['mahasiswa_id' => $mhs->id, 'status' => 'menunggu']);

    $response = $this->actingAs($user)->post(route('mahasiswa.pengajuan.ajukan', $pengajuan), [
        'nomor_ijazah' => 'IJZ-123',
    ]);

    $response->assertSessionHas('error');
});

test('mahasiswa can edit draft pengajuan', function () {
    $user = User::factory()->create();
    $mhs = Mahasiswa::factory()->create(['user_id' => $user->id]);
    $kategori = Kategori::factory()->create();
    $pengajuan = Pengajuan::factory()->draft()->create(['mahasiswa_id' => $mhs->id]);
    $pengajuan->detailPengajuan()->create(['kategori_id' => $kategori->id, 'nama_kegiatan' => 'Old', 'tahun_kegiatan' => '2025', 'peran' => 'Peserta']);

    $response = $this->actingAs($user)->get(route('mahasiswa.pengajuan.edit', $pengajuan));

    $response->assertOk();
});

test('mahasiswa can update draft pengajuan', function () {
    $user = User::factory()->create();
    $mhs = Mahasiswa::factory()->create(['user_id' => $user->id]);
    $kategori = Kategori::factory()->create();
    $pengajuan = Pengajuan::factory()->draft()->create(['mahasiswa_id' => $mhs->id]);

    $response = $this->actingAs($user)->put(route('mahasiswa.pengajuan.update', $pengajuan), [
        'kegiatan' => [
            [
                'kategori_id' => $kategori->id,
                'nama_kegiatan' => 'Updated Kegiatan',
                'tahun_kegiatan' => '2026',
                'peran' => 'Ketua',
            ],
        ],
    ]);

    $response->assertRedirect(route('mahasiswa.pengajuan.index'));
    $this->assertDatabaseHas('pengajuan', ['id' => $pengajuan->id, 'status' => 'draft']);
    $this->assertDatabaseHas('detail_pengajuan', ['nama_kegiatan' => 'Updated Kegiatan']);
});

test('mahasiswa can update pengajuan with status menunggu', function () {
    $user = User::factory()->create();
    $mhs = Mahasiswa::factory()->create(['user_id' => $user->id]);
    $kategori = Kategori::factory()->create();
    $pengajuan = Pengajuan::factory()->create(['mahasiswa_id' => $mhs->id, 'status' => 'menunggu']);

    $response = $this->actingAs($user)->put(route('mahasiswa.pengajuan.update', $pengajuan), [
        'kegiatan' => [
            [
                'kategori_id' => $kategori->id,
                'nama_kegiatan' => 'Updated Kegiatan',
                'tahun_kegiatan' => '2026',
                'peran' => 'Ketua',
            ],
        ],
    ]);

    $response->assertRedirect(route('mahasiswa.pengajuan.index'));
    $this->assertDatabaseHas('detail_pengajuan', ['nama_kegiatan' => 'Updated Kegiatan']);
});

test('mahasiswa cannot update pengajuan with status disetujui', function () {
    $user = User::factory()->create();
    $mhs = Mahasiswa::factory()->create(['user_id' => $user->id]);
    $kategori = Kategori::factory()->create();
    $pengajuan = Pengajuan::factory()->disetujui()->create(['mahasiswa_id' => $mhs->id]);

    $response = $this->actingAs($user)->put(route('mahasiswa.pengajuan.update', $pengajuan), [
        'kegiatan' => [
            [
                'kategori_id' => $kategori->id,
                'nama_kegiatan' => 'Test',
                'tahun_kegiatan' => '2026',
                'peran' => 'Peserta',
            ],
        ],
    ]);

    $response->assertSessionHas('error');
});
