<?php

namespace Database\Seeders;

use App\Models\BuktiKegiatan;
use App\Models\DetailPengajuan;
use App\Models\Jurusan;
use App\Models\Kategori;
use App\Models\Mahasiswa;
use App\Models\Pengajuan;
use App\Models\Pengambilan;
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
            ['nobp' => '230001001', 'nama' => 'Ahmad Rizki Pratama', 'jk' => 'L', 'jurusan' => $jurusanMI, 'tahun_masuk' => '2023', 'lengkap' => true],
            ['nobp' => '231001002', 'nama' => 'Siti Nurhaliza', 'jk' => 'P', 'jurusan' => $jurusanSI, 'tahun_masuk' => '2023', 'lengkap' => true],
            ['nobp' => '232001003', 'nama' => 'Muhammad Fadil', 'jk' => 'L', 'jurusan' => $jurusanSK, 'tahun_masuk' => null, 'lengkap' => false],
            ['nobp' => '230001004', 'nama' => 'Putri Amelia', 'jk' => 'P', 'jurusan' => $jurusanMI, 'tahun_masuk' => null, 'lengkap' => false],
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
            ]);
            $mahasiswas[] = $mhs;
        }

        $kegiatan = [
            ['idx' => 0, 'nama' => 'Juara 1 Olimpiade Matematika', 'peran' => 'Peserta'],
            ['idx' => 2, 'nama' => 'Ketua BEM STMIK Jayanusa', 'peran' => 'Ketua'],
            ['idx' => 5, 'nama' => 'Sertifikasi Junior Web Developer', 'peran' => 'Peserta'],
        ];

        $pengajuanConfigs = [
            ['mhs' => 0, 'status' => 'disetujui', 'tgl' => '2026-01-15', 'keg' => [0, 2], 'catatan' => null, 'terbit' => true, 'ambil' => true],
            ['mhs' => 1, 'status' => 'disetujui', 'tgl' => '2026-02-10', 'keg' => [1], 'catatan' => null, 'terbit' => true, 'ambil' => false],
            ['mhs' => 0, 'status' => 'diproses', 'tgl' => '2026-04-20', 'keg' => [0], 'catatan' => null, 'terbit' => false, 'ambil' => false],
            ['mhs' => 2, 'status' => 'revisi', 'tgl' => '2026-05-18', 'keg' => [1, 2], 'catatan' => 'Bukti kurang jelas.', 'terbit' => false, 'ambil' => false],
            ['mhs' => 3, 'status' => 'ditolak', 'tgl' => '2026-06-01', 'keg' => [0], 'catatan' => 'Kategori tidak sesuai.', 'terbit' => false, 'ambil' => false],
            ['mhs' => 3, 'status' => 'draft', 'tgl' => null, 'keg' => [1], 'catatan' => null, 'terbit' => false, 'ambil' => false],
        ];

        $noUrut = 1;
        foreach ($pengajuanConfigs as $c) {
            $mhs = $mahasiswas[$c['mhs']];
            $isDraft = $c['status'] === 'draft';
            $p = Pengajuan::create([
                'mahasiswa_id' => $mhs->id,
                'no_registrasi' => $isDraft ? null : 'REG/'.date('Y', strtotime($c['tgl'])).'/'.sprintf('%04d', $noUrut++),
                'tgl_pengajuan' => $c['tgl'], 'status' => $c['status'], 'catatan_akademis' => $c['catatan'],
            ]);

            foreach ($c['keg'] as $ki) {
                $k = $kegiatan[$ki];
                $d = DetailPengajuan::create([
                    'pengajuan_id' => $p->id, 'kategori_id' => $kategoriIds[$k['idx']],
                    'nama_kegiatan' => $k['nama'], 'tahun_kegiatan' => '2025', 'peran' => $k['peran'],
                ]);
                BuktiKegiatan::create(['detail_pengajuan_id' => $d->id, 'nama_file' => 'bukti.jpg', 'path_file' => 'bukti/dummy.jpg']);
            }

            if ($c['terbit']) {
                $pt = $mhs->jurusan->identitasPt;
                $skpi = Skpi::create([
                    'no_skpi' => 'SKPI/2026/01/'.sprintf('%04d', $p->id).'/'.$pt->kode_institusi,
                    'pengajuan_id' => $p->id, 'identitas_pt_id' => $pt->id, 'tgl_terbit' => '2026-01-22', 'status' => 'diterbitkan',
                ]);
                Pengambilan::create([
                    'skpi_id' => $skpi->id, 'mahasiswa_id' => $mhs->id, 'tgl_pengambilan' => '2026-01-29',
                    'diambil_pada' => $c['ambil'] ? '2026-02-05 10:00:00' : null,
                    'status' => $c['ambil'] ? 'sudah_diambil' : 'belum_diambil',
                ]);
            }
        }
    }
}
