<?php

namespace Database\Seeders;

use App\Models\BuktiKegiatan;
use App\Models\DetailPengajuan;
use App\Models\IdentitasPt;
use App\Models\Jurusan;
use App\Models\Kategori;
use App\Models\Mahasiswa;
use App\Models\Pengajuan;
use App\Models\Pengambilan;
use App\Models\Skpi;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        $kategoriIds = Kategori::pluck('id')->toArray();
        $jurusanMI = Jurusan::where('kode', '000')->first();
        $jurusanSI = Jurusan::where('kode', '100')->first();
        $jurusanSK = Jurusan::where('kode', '200')->first();
        $stmik = IdentitasPt::where('kode_institusi', 'STMIK')->first();
        $amik = IdentitasPt::where('kode_institusi', 'AMIK')->first();

        $mahasiswaData = [
            ['nobp' => '230001001', 'nama' => 'Ahmad Rizki Pratama', 'jk' => 'L', 'jurusan' => $jurusanMI, 'tahun_lulus' => '2026', 'profile_lengkap' => true],
            ['nobp' => '231001002', 'nama' => 'Siti Nurhaliza', 'jk' => 'P', 'jurusan' => $jurusanSI, 'tahun_lulus' => '2026', 'profile_lengkap' => true],
            ['nobp' => '232001003', 'nama' => 'Muhammad Fadil', 'jk' => 'L', 'jurusan' => $jurusanSK, 'tahun_lulus' => '2026', 'profile_lengkap' => true],
            ['nobp' => '230001004', 'nama' => 'Putri Amelia', 'jk' => 'P', 'jurusan' => $jurusanMI, 'tahun_lulus' => '2025', 'profile_lengkap' => true],
            ['nobp' => '231001005', 'nama' => 'Reza Firmansyah', 'jk' => 'L', 'jurusan' => $jurusanSI, 'tahun_lulus' => '2026', 'profile_lengkap' => true],
            ['nobp' => '232001006', 'nama' => 'Dewi Kartika', 'jk' => 'P', 'jurusan' => $jurusanSK, 'tahun_lulus' => '2026', 'profile_lengkap' => true],
            ['nobp' => '230001007', 'nama' => 'Andi Saputra', 'jk' => 'L', 'jurusan' => $jurusanMI, 'tahun_lulus' => '2026', 'profile_lengkap' => true],
            ['nobp' => '231001008', 'nama' => 'Rina Wati', 'jk' => 'P', 'jurusan' => $jurusanSI, 'tahun_lulus' => '2025', 'profile_lengkap' => true],
            ['nobp' => '232001009', 'nama' => 'Budi Santoso', 'jk' => 'L', 'jurusan' => $jurusanSK, 'tahun_lulus' => '2026', 'profile_lengkap' => true],
            ['nobp' => '230001010', 'nama' => 'Maya Putri', 'jk' => 'P', 'jurusan' => $jurusanMI, 'tahun_lulus' => null, 'profile_lengkap' => false],
        ];

        $mahasiswas = [];
        foreach ($mahasiswaData as $data) {
            $user = User::create([
                'username' => $data['nobp'],
                'password' => Hash::make('password'),
                'role' => 'mahasiswa',
            ]);

            $mhs = Mahasiswa::create([
                'nobp' => $data['nobp'],
                'nama' => $data['nama'],
                'tempat_lahir' => $data['profile_lengkap'] ? 'Padang' : null,
                'tanggal_lahir' => $data['profile_lengkap'] ? '2001-05-15' : null,
                'jk' => $data['jk'],
                'alamat' => $data['profile_lengkap'] ? 'Jl. Olo Ladang No. ' . rand(1, 100) . ', Padang' : null,
                'nohp' => $data['profile_lengkap'] ? '08' . rand(1000000000, 9999999999) : null,
                'jurusan_id' => $data['jurusan']->id,
                'nomor_ijazah' => $data['profile_lengkap'] ? 'IJZ-' . strtoupper(Str::random(8)) : null,
                'tahun_lulus' => $data['tahun_lulus'],
                'user_id' => $user->id,
            ]);

            $mahasiswas[] = $mhs;
        }

        $kegiatanTemplates = [
            ['kategori_idx' => 0, 'nama' => 'Juara 1 Olimpiade Matematika Tingkat Nasional', 'peran' => 'Peserta'],
            ['kategori_idx' => 1, 'nama' => 'Juara 2 Kompetisi Futsal Piala Rektor', 'peran' => 'Kapten Tim'],
            ['kategori_idx' => 2, 'nama' => 'Ketua BEM STMIK Jayanusa', 'peran' => 'Ketua'],
            ['kategori_idx' => 3, 'nama' => 'Presenter Seminar Nasional Sistem Informasi', 'peran' => 'Pemakalah'],
            ['kategori_idx' => 4, 'nama' => 'Relawan Pengabdian Masyarakat Pesisir Pantai', 'peran' => 'Anggota'],
            ['kategori_idx' => 5, 'nama' => 'Sertifikasi Junior Web Developer BNSP', 'peran' => 'Peserta'],
            ['kategori_idx' => 6, 'nama' => 'Juara 3 Hackathon Innovation Challenge', 'peran' => 'Leader Tim'],
            ['kategori_idx' => 7, 'nama' => 'Peserta Workshop Cloud Computing AWS', 'peran' => 'Peserta'],
        ];

        $pengajuanConfigs = [
            ['mhs_idx' => 0, 'status' => 'disetujui', 'tgl' => '2026-01-15', 'kegiatan' => [0, 5, 6], 'catatan' => null, 'terbitkan' => true, 'diambil' => true],
            ['mhs_idx' => 1, 'status' => 'disetujui', 'tgl' => '2026-02-10', 'kegiatan' => [1, 3], 'catatan' => null, 'terbitkan' => true, 'diambil' => false],
            ['mhs_idx' => 2, 'status' => 'disetujui', 'tgl' => '2026-03-05', 'kegiatan' => [2, 4], 'catatan' => null, 'terbitkan' => false, 'diambil' => false],
            ['mhs_idx' => 3, 'status' => 'diproses', 'tgl' => '2026-04-20', 'kegiatan' => [0, 7], 'catatan' => null, 'terbitkan' => false, 'diambil' => false],
            ['mhs_idx' => 4, 'status' => 'menunggu', 'tgl' => '2026-05-12', 'kegiatan' => [3, 6], 'catatan' => null, 'terbitkan' => false, 'diambil' => false],
            ['mhs_idx' => 5, 'status' => 'revisi', 'tgl' => '2026-05-18', 'kegiatan' => [1, 5], 'catatan' => 'Bukti kegiatan kurang jelas, mohon upload ulang dengan resolusi lebih tinggi.', 'terbitkan' => false, 'diambil' => false],
            ['mhs_idx' => 6, 'status' => 'ditolak', 'tgl' => '2026-06-01', 'kegiatan' => [7], 'catatan' => 'Kegiatan yang diajukan tidak sesuai dengan kategori yang dipilih. Silakan ajukan ulang dengan kategori yang tepat.', 'terbitkan' => false, 'diambil' => false],
            ['mhs_idx' => 7, 'status' => 'menunggu', 'tgl' => '2026-06-20', 'kegiatan' => [2, 4, 6], 'catatan' => null, 'terbitkan' => false, 'diambil' => false],
        ];

        foreach ($pengajuanConfigs as $config) {
            $mahasiswa = $mahasiswas[$config['mhs_idx']];
            $noReg = 'REG/' . date('Y', strtotime($config['tgl'])) . '/' . sprintf('%04d', $mahasiswa->id);

            $pengajuan = Pengajuan::create([
                'mahasiswa_id' => $mahasiswa->id,
                'no_registrasi' => $noReg,
                'tgl_pengajuan' => $config['tgl'],
                'status' => $config['status'],
                'catatan_akademis' => $config['catatan'],
            ]);

            foreach ($config['kegiatan'] as $kegiatanIdx) {
                $template = $kegiatanTemplates[$kegiatanIdx];
                $detail = DetailPengajuan::create([
                    'pengajuan_id' => $pengajuan->id,
                    'kategori_id' => $kategoriIds[$template['kategori_idx']],
                    'nama_kegiatan' => $template['nama'],
                    'tahun_kegiatan' => (string) date('Y', strtotime($config['tgl'])) - rand(0, 1),
                    'peran' => $template['peran'],
                ]);

                BuktiKegiatan::create([
                    'detail_pengajuan_id' => $detail->id,
                    'nama_file' => 'bukti_' . Str::slug($template['nama']) . '.jpg',
                    'path_file' => 'bukti/dummy_' . $detail->id . '.jpg',
                ]);
            }

            if ($config['terbitkan']) {
                $identitasPt = $mahasiswa->jurusan->identitasPt;
                $tahun = date('Y', strtotime($config['tgl']));
                $bulan = date('m', strtotime($config['tgl']));
                $urutan = Skpi::whereYear('created_at', $tahun)->whereMonth('created_at', $bulan)->count() + 1;
                $noSkpi = sprintf('SKPI/%s/%s/%04d/%s', $tahun, $bulan, $urutan, $identitasPt->kode_institusi);

                $skpi = Skpi::create([
                    'no_skpi' => $noSkpi,
                    'pengajuan_id' => $pengajuan->id,
                    'identitas_pt_id' => $identitasPt->id,
                    'tgl_terbit' => date('Y-m-d', strtotime($config['tgl'] . ' +7 days')),
                    'status' => 'diterbitkan',
                ]);

                Pengambilan::create([
                    'skpi_id' => $skpi->id,
                    'mahasiswa_id' => $mahasiswa->id,
                    'tgl_pengambilan' => date('Y-m-d', strtotime($config['tgl'] . ' +14 days')),
                    'diambil_pada' => $config['diambil'] ? date('Y-m-d H:i:s', strtotime($config['tgl'] . ' +21 days')) : null,
                    'status' => $config['diambil'] ? 'sudah_diambil' : 'belum_diambil',
                ]);
            }
        }
    }
}
