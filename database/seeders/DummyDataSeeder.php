<?php

namespace Database\Seeders;

use App\Models\Aktivitas;
use App\Models\Jurusan;
use App\Models\Kategori;
use App\Models\Mahasiswa;
use App\Models\PengajuanSkpi;
use App\Models\Pengambilan;
use App\Models\PeriodeSkpi;
use App\Models\Skpi;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        $jurusanMI = Jurusan::where('kode', '000')->first();
        $jurusanSI = Jurusan::where('kode', '100')->first();
        $jurusanSK = Jurusan::where('kode', '200')->first();
        $kategoriIds = Kategori::pluck('id')->toArray();

        $mahasiswaData = [
            ['nobp' => '230001001', 'nama' => 'Ahmad Rizki Pratama', 'jk' => 'L', 'jurusan' => $jurusanMI, 'tahun_masuk' => '2023', 'lengkap' => true, 'kompre' => true],
            ['nobp' => '231001002', 'nama' => 'Siti Nurhaliza', 'jk' => 'P', 'jurusan' => $jurusanSI, 'tahun_masuk' => '2023', 'lengkap' => true, 'kompre' => true],
            ['nobp' => '232001003', 'nama' => 'Muhammad Fadil', 'jk' => 'L', 'jurusan' => $jurusanSK, 'tahun_masuk' => null, 'lengkap' => false, 'kompre' => false],
            ['nobp' => '230001004', 'nama' => 'Putri Amelia', 'jk' => 'P', 'jurusan' => $jurusanMI, 'tahun_masuk' => null, 'lengkap' => false, 'kompre' => false],
        ];

        $mahasiswas = [];
        foreach ($mahasiswaData as $d) {
            $user = User::create(['username' => $d['nobp'], 'password' => Hash::make('password'), 'role' => 'mahasiswa']);
            $mhs = Mahasiswa::create([
                'nobp' => $d['nobp'], 'nama' => $d['nama'], 'jk' => $d['jk'],
                'jurusan_id' => $d['jurusan']->id, 'tahun_masuk' => $d['tahun_masuk'], 'user_id' => $user->id,
                'tempat_lahir' => $d['lengkap'] ? 'Padang' : null,
                'tanggal_lahir' => $d['lengkap'] ? '2001-05-15' : null,
                'alamat' => $d['lengkap'] ? 'Jl. Olo Ladang No. 10, Padang' : null,
                'nohp' => $d['lengkap'] ? '081234567890' : null,
                'nomor_ijazah' => $d['lengkap'] ? 'IJZ-TEST1234' : null,
                'kompre_status' => $d['kompre'],
                'kompre_tanggal' => $d['kompre'] ? '2026-06-15' : null,
            ]);
            $mahasiswas[] = $mhs;
        }

        $kegiatan = [
            ['idx' => 0, 'nama' => 'Juara 1 Olimpiade Matematika', 'peran' => 'Peserta', 'juara' => 'Juara 1', 'tingkat' => 'nasional'],
            ['idx' => 2, 'nama' => 'Ketua BEM STMIK Jayanusa', 'peran' => 'Ketua', 'juara' => null, 'tingkat' => null],
            ['idx' => 5, 'nama' => 'Sertifikasi Junior Web Developer', 'peran' => 'Peserta', 'juara' => null, 'tingkat' => null],
        ];

        $aktivitasConfigs = [
            ['mhs' => 0, 'keg' => 0, 'status' => 'disetujui'],
            ['mhs' => 0, 'keg' => 1, 'status' => 'disetujui'],
            ['mhs' => 1, 'keg' => 2, 'status' => 'disetujui'],
            ['mhs' => 1, 'keg' => 0, 'status' => 'menunggu'],
            ['mhs' => 2, 'keg' => 1, 'status' => 'ditolak'],
            ['mhs' => 3, 'keg' => 0, 'status' => 'menunggu'],
        ];

        $aktivitasIds = [];
        foreach ($aktivitasConfigs as $c) {
            $mhs = $mahasiswas[$c['mhs']];
            $k = $kegiatan[$c['keg']];
            $a = Aktivitas::create([
                'mahasiswa_id' => $mhs->id,
                'kategori_id' => $kategoriIds[$k['idx']],
                'nama_kegiatan' => $k['nama'],
                'tahun_kegiatan' => '2025',
                'peran' => $k['peran'],
                'bukti_link' => 'https://drive.google.com/file/d/example/view',
                'juara' => $k['juara'],
                'tingkat' => $k['tingkat'],
                'status' => $c['status'],
                'catatan_validator' => $c['status'] === 'ditolak' ? 'Bukti kurang jelas.' : null,
            ]);
            $aktivitasIds[$c['mhs']][] = $a->id;
        }

        $periode = PeriodeSkpi::create([
            'nama' => 'Periode Juli 2026',
            'tgl_mulai' => '2026-07-01',
            'tgl_selesai' => '2026-12-31',
            'status' => 'aktif',
        ]);

        $ps1 = PengajuanSkpi::create([
            'mahasiswa_id' => $mahasiswas[0]->id,
            'periode_skpi_id' => $periode->id,
            'no_registrasi' => 'REG/2026/07/0001',
            'tgl_pengajuan' => '2026-07-10',
            'status' => 'disetujui',
        ]);
        $ps1->aktivitas()->attach($aktivitasIds[0]);

        $pt = $mahasiswas[0]->jurusan->identitasPt;
        $skpi = Skpi::create([
            'no_skpi' => 'SKPI/2026/07/0001/' . $pt->kode_institusi,
            'pengajuan_skpi_id' => $ps1->id,
            'identitas_pt_id' => $pt->id,
            'tgl_terbit' => '2026-07-15',
            'status' => 'diterbitkan',
        ]);
        Pengambilan::create([
            'skpi_id' => $skpi->id,
            'mahasiswa_id' => $mahasiswas[0]->id,
            'tgl_pengambilan' => '2026-07-20',
            'status' => 'belum_diambil',
        ]);
    }
}
