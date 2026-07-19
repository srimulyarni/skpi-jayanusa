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

        $kategoris = Kategori::pluck('id', 'nama_kategori');

        // --- Mahasiswa ---
        $mahasiswaData = [
            [
                'nobp' => '230001001', 'nama' => 'Ahmad Rizki Pratama', 'jk' => 'L',
                'jurusan' => $jurusanMI, 'tahun_masuk' => '2023',
                'tempat_lahir' => 'Padang', 'tanggal_lahir' => '2001-05-15',
                'alamat' => 'Jl. Olo Ladang No. 10, Padang', 'nohp' => '081234567890',
                'nomor_ijazah' => 'IJZ-2026-001', 'kompre' => true, 'kompre_tanggal' => '2026-06-15',
            ],
            [
                'nobp' => '231001002', 'nama' => 'Siti Nurhaliza', 'jk' => 'P',
                'jurusan' => $jurusanSI, 'tahun_masuk' => '2023',
                'tempat_lahir' => 'Bukittinggi', 'tanggal_lahir' => '2002-03-20',
                'alamat' => 'Jl. Sudirman No. 25, Bukittinggi', 'nohp' => '081298765432',
                'nomor_ijazah' => 'IJZ-2026-002', 'kompre' => true, 'kompre_tanggal' => '2026-06-15',
            ],
            [
                'nobp' => '232001003', 'nama' => 'Muhammad Fadil', 'jk' => 'L',
                'jurusan' => $jurusanSK, 'tahun_masuk' => '2023',
                'tempat_lahir' => null, 'tanggal_lahir' => null,
                'alamat' => null, 'nohp' => null,
                'nomor_ijazah' => null, 'kompre' => false, 'kompre_tanggal' => null,
            ],
            [
                'nobp' => '230001004', 'nama' => 'Putri Amelia', 'jk' => 'P',
                'jurusan' => $jurusanMI, 'tahun_masuk' => '2023',
                'tempat_lahir' => null, 'tanggal_lahir' => null,
                'alamat' => null, 'nohp' => null,
                'nomor_ijazah' => null, 'kompre' => false, 'kompre_tanggal' => null,
            ],
            [
                'nobp' => '221001005', 'nama' => 'Rizky Aditya Pratama', 'jk' => 'L',
                'jurusan' => $jurusanSI, 'tahun_masuk' => '2022',
                'tempat_lahir' => 'Padang Panjang', 'tanggal_lahir' => '2000-11-08',
                'alamat' => 'Jl. M. Yamin No. 5, Padang Panjang', 'nohp' => '081376541234',
                'nomor_ijazah' => 'IJZ-2026-003', 'kompre' => true, 'kompre_tanggal' => '2026-05-20',
            ],
            [
                'nobp' => '220001006', 'nama' => 'Dewi Sartika', 'jk' => 'P',
                'jurusan' => $jurusanMI, 'tahun_masuk' => '2022',
                'tempat_lahir' => 'Solok', 'tanggal_lahir' => '2001-07-22',
                'alamat' => 'Jl. Ahmad Yani No. 8, Solok', 'nohp' => '081256784321',
                'nomor_ijazah' => 'IJZ-2026-004', 'kompre' => true, 'kompre_tanggal' => '2026-05-20',
            ],
        ];

        $mahasiswas = [];
        foreach ($mahasiswaData as $d) {
            $user = User::create([
                'username' => $d['nobp'],
                'password' => Hash::make('password'),
                'role' => 'mahasiswa',
            ]);
            $mhs = Mahasiswa::create([
                'nobp' => $d['nobp'],
                'nama' => $d['nama'],
                'jk' => $d['jk'],
                'jurusan_id' => $d['jurusan']->id,
                'tahun_masuk' => $d['tahun_masuk'],
                'user_id' => $user->id,
                'tempat_lahir' => $d['tempat_lahir'],
                'tanggal_lahir' => $d['tanggal_lahir'],
                'alamat' => $d['alamat'],
                'nohp' => $d['nohp'],
                'nomor_ijazah' => $d['nomor_ijazah'],
                'kompre_status' => $d['kompre'],
                'kompre_tanggal' => $d['kompre_tanggal'],
            ]);
            $mahasiswas[] = $mhs;
        }

        // --- Aktivitas ---
        // Ahmad Rizki (mhs[0]) — kompre lulus, profil lengkap
        $a1 = Aktivitas::create([
            'mahasiswa_id' => $mahasiswas[0]->id,
            'kategori_id' => $kategoris['Kompetisi dan Lomba'],
            'nama_kegiatan' => 'Juara 1 Olimpiade Matematika Tingkat Nasional',
            'tahun_kegiatan' => '2025',
            'peran' => 'Peserta',
            'bukti_link' => 'https://drive.google.com/file/d/example-olimpiade/view',
            'juara' => 'Juara 1',
            'tingkat' => 'nasional',
            'status' => 'disetujui',
        ]);
        $a2 = Aktivitas::create([
            'mahasiswa_id' => $mahasiswas[0]->id,
            'kategori_id' => $kategoris['Organisasi Kemahasiswaan'],
            'nama_kegiatan' => 'Ketua BEM STMIK Jayanusa',
            'tahun_kegiatan' => '2024',
            'peran' => 'Ketua',
            'bukti_link' => 'https://drive.google.com/file/d/example-bem/view',
            'status' => 'disetujui',
        ]);
        $a3 = Aktivitas::create([
            'mahasiswa_id' => $mahasiswas[0]->id,
            'kategori_id' => $kategoris['Pelatihan dan Sertifikasi'],
            'nama_kegiatan' => 'Sertifikasi Junior Web Developer BNSP',
            'tahun_kegiatan' => '2025',
            'peran' => 'Peserta',
            'bukti_link' => 'https://drive.google.com/file/d/example-sertifikasi/view',
            'status' => 'disetujui',
        ]);
        $a4 = Aktivitas::create([
            'mahasiswa_id' => $mahasiswas[0]->id,
            'kategori_id' => $kategoris['Seminar dan Workshop'],
            'nama_kegiatan' => 'Workshop Cloud Computing AWS',
            'tahun_kegiatan' => '2025',
            'peran' => 'Peserta',
            'bukti_link' => 'https://drive.google.com/file/d/example-aws/view',
            'status' => 'menunggu',
        ]);

        // Siti Nurhaliza (mhs[1]) — kompre lulus, profil lengkap
        $a5 = Aktivitas::create([
            'mahasiswa_id' => $mahasiswas[1]->id,
            'kategori_id' => $kategoris['Pelatihan dan Sertifikasi'],
            'nama_kegiatan' => 'Sertifikasi Database Administrator Oracle',
            'tahun_kegiatan' => '2025',
            'peran' => 'Peserta',
            'bukti_link' => 'https://drive.google.com/file/d/example-oracle/view',
            'status' => 'disetujui',
        ]);
        $a6 = Aktivitas::create([
            'mahasiswa_id' => $mahasiswas[1]->id,
            'kategori_id' => $kategoris['Kompetisi dan Lomba'],
            'nama_kegiatan' => 'Juara 2 Hackathon Nasional Digital Innovation',
            'tahun_kegiatan' => '2025',
            'peran' => 'Ketua Tim',
            'bukti_link' => 'https://drive.google.com/file/d/example-hackathon/view',
            'juara' => 'Juara 2',
            'tingkat' => 'nasional',
            'status' => 'disetujui',
        ]);
        $a7 = Aktivitas::create([
            'mahasiswa_id' => $mahasiswas[1]->id,
            'kategori_id' => $kategoris['Pengabdian Masyarakat'],
            'nama_kegiatan' => 'Pelatihan Komputer untuk Masyarakat Kurang Mampu',
            'tahun_kegiatan' => '2024',
            'peran' => 'Panitia',
            'bukti_link' => 'https://drive.google.com/file/d/example-pengabdian/view',
            'status' => 'disetujui',
        ]);
        $a8 = Aktivitas::create([
            'mahasiswa_id' => $mahasiswas[1]->id,
            'kategori_id' => $kategoris['Prestasi di Bidang Akademik'],
            'nama_kegiatan' => 'IPK 3.85 Cum Laude',
            'tahun_kegiatan' => '2026',
            'peran' => 'Mahasiswa',
            'bukti_link' => 'https://drive.google.com/file/d/example-ipk/view',
            'status' => 'menunggu',
        ]);

        // Muhammad Fadil (mhs[2]) — belum kompre, profil belum lengkap
        $a9 = Aktivitas::create([
            'mahasiswa_id' => $mahasiswas[2]->id,
            'kategori_id' => $kategoris['Organisasi Kemahasiswaan'],
            'nama_kegiatan' => 'Anggota Himpunan Mahasiswa Sistem Komputer',
            'tahun_kegiatan' => '2024',
            'peran' => 'Anggota',
            'bukti_link' => 'https://drive.google.com/file/d/example-hmsk/view',
            'status' => 'ditolak',
            'catatan_validator' => 'Bukti kurang jelas, upload ulang.',
        ]);
        $a10 = Aktivitas::create([
            'mahasiswa_id' => $mahasiswas[2]->id,
            'kategori_id' => $kategoris['Kegiatan Ilmiah'],
            'nama_kegiatan' => 'Presenter Seminar Nasional Sistem Informasi',
            'tahun_kegiatan' => '2025',
            'peran' => 'Presenter',
            'bukti_link' => 'https://drive.google.com/file/d/example-seminar/view',
            'status' => 'menunggu',
        ]);

        // Putri Amelia (mhs[3]) — belum kompre, profil belum lengkap
        $a11 = Aktivitas::create([
            'mahasiswa_id' => $mahasiswas[3]->id,
            'kategori_id' => $kategoris['Kompetisi dan Lomba'],
            'nama_kegiatan' => 'Juara 3 Lomba Desain Grafis Tingkat Universitas',
            'tahun_kegiatan' => '2025',
            'peran' => 'Peserta',
            'bukti_link' => 'https://drive.google.com/file/d/example-desain/view',
            'juara' => 'Juara 3',
            'tingkat' => 'universitas',
            'status' => 'menunggu',
        ]);

        // Rizky Aditya (mhs[4]) — kompre lulus, angkatan 2022
        $a12 = Aktivitas::create([
            'mahasiswa_id' => $mahasiswas[4]->id,
            'kategori_id' => $kategoris['Kompetisi dan Lomba'],
            'nama_kegiatan' => 'Juara 1 Kompetisi Cyber Security Tingkat Wilayah',
            'tahun_kegiatan' => '2024',
            'peran' => 'Ketua Tim',
            'bukti_link' => 'https://drive.google.com/file/d/example-cyber/view',
            'juara' => 'Juara 1',
            'tingkat' => 'wilayah',
            'status' => 'disetujui',
        ]);
        $a13 = Aktivitas::create([
            'mahasiswa_id' => $mahasiswas[4]->id,
            'kategori_id' => $kategoris['Prestasi di Bidang Non-Akademik'],
            'nama_kegiatan' => 'Atlet Futsal POMDA Sumbar',
            'tahun_kegiatan' => '2024',
            'peran' => 'Pemain',
            'bukti_link' => 'https://drive.google.com/file/d/example-futsal/view',
            'status' => 'disetujui',
        ]);
        $a14 = Aktivitas::create([
            'mahasiswa_id' => $mahasiswas[4]->id,
            'kategori_id' => $kategoris['Pelatihan dan Sertifikasi'],
            'nama_kegiatan' => 'Sertifikasi CCNA Cisco',
            'tahun_kegiatan' => '2025',
            'peran' => 'Peserta',
            'bukti_link' => 'https://drive.google.com/file/d/example-ccna/view',
            'status' => 'disetujui',
        ]);
        $a15 = Aktivitas::create([
            'mahasiswa_id' => $mahasiswas[4]->id,
            'kategori_id' => $kategoris['Kegiatan Ilmiah'],
            'nama_kegiatan' => 'Peneliti Muda Hibah Dikti',
            'tahun_kegiatan' => '2025',
            'peran' => 'Ketua Tim',
            'bukti_link' => 'https://drive.google.com/file/d/example-hibah/view',
            'status' => 'disetujui',
        ]);

        // Dewi Sartika (mhs[5]) — kompre lulus, angkatan 2022
        $a16 = Aktivitas::create([
            'mahasiswa_id' => $mahasiswas[5]->id,
            'kategori_id' => $kategoris['Organisasi Kemahasiswaan'],
            'nama_kegiatan' => 'Sekretaris DPM STMIK Jayanusa',
            'tahun_kegiatan' => '2024',
            'peran' => 'Sekretaris',
            'bukti_link' => 'https://drive.google.com/file/d/example-dpm/view',
            'status' => 'disetujui',
        ]);
        $a17 = Aktivitas::create([
            'mahasiswa_id' => $mahasiswas[5]->id,
            'kategori_id' => $kategoris['Seminar dan Workshop'],
            'nama_kegiatan' => 'Peserta Seminar Internasional ICITB 2025',
            'tahun_kegiatan' => '2025',
            'peran' => 'Peserta',
            'bukti_link' => 'https://drive.google.com/file/d/example-icitb/view',
            'status' => 'disetujui',
        ]);

        // --- Periode SKPI ---
        $periodeAktif = PeriodeSkpi::create([
            'nama' => 'Periode Juli 2026',
            'kode' => '20262',
            'tgl_mulai' => '2026-07-01',
            'tgl_selesai' => '2026-12-31',
            'max_aktivitas' => 10,
            'status' => 'aktif',
        ]);

        $periodeLalu = PeriodeSkpi::create([
            'nama' => 'Periode Januari 2026',
            'kode' => '20261',
            'tgl_mulai' => '2026-01-01',
            'tgl_selesai' => '2026-06-30',
            'max_aktivitas' => 8,
            'status' => 'nonaktif',
        ]);

        // --- Pengajuan SKPI (periode lalu, sudah selesai) ---
        $psLalu = PengajuanSkpi::create([
            'mahasiswa_id' => $mahasiswas[5]->id,
            'periode_skpi_id' => $periodeLalu->id,
            'no_registrasi' => 'REG/2026/03/0001',
            'tgl_pengajuan' => '2026-03-15',
            'tgl_proses' => '2026-03-20',
            'status' => 'disetujui',
        ]);
        $psLalu->aktivitas()->attach([$a16->id, $a17->id]);

        $ptDewi = $mahasiswas[5]->jurusan->identitasPt;
        $skpiLalu = Skpi::create([
            'no_skpi' => 'SKPI/2026/03/0001/' . $ptDewi->kode_institusi,
            'pengajuan_skpi_id' => $psLalu->id,
            'identitas_pt_id' => $ptDewi->id,
            'tgl_terbit' => '2026-03-25',
            'status' => 'diterbitkan',
        ]);
        Pengambilan::create([
            'skpi_id' => $skpiLalu->id,
            'mahasiswa_id' => $mahasiswas[5]->id,
            'tgl_pengambilan' => '2026-04-01',
            'status' => 'sudah_diambil',
            'diambil_pada' => '2026-04-05 10:00:00',
        ]);

        // --- Pengajuan SKPI (periode aktif, menunggu) ---
        $ps1 = PengajuanSkpi::create([
            'mahasiswa_id' => $mahasiswas[0]->id,
            'periode_skpi_id' => $periodeAktif->id,
            'no_registrasi' => 'REG/2026/07/0001',
            'tgl_pengajuan' => '2026-07-10',
            'status' => 'disetujui',
        ]);
        $ps1->aktivitas()->attach([$a1->id, $a2->id, $a3->id]);

        $ptAhmad = $mahasiswas[0]->jurusan->identitasPt;
        $skpi1 = Skpi::create([
            'no_skpi' => 'SKPI/2026/07/0001/' . $ptAhmad->kode_institusi,
            'pengajuan_skpi_id' => $ps1->id,
            'identitas_pt_id' => $ptAhmad->id,
            'tgl_terbit' => '2026-07-15',
            'status' => 'diterbitkan',
        ]);
        Pengambilan::create([
            'skpi_id' => $skpi1->id,
            'mahasiswa_id' => $mahasiswas[0]->id,
            'tgl_pengambilan' => '2026-07-20',
            'status' => 'belum_diambil',
        ]);

        // Rizky — pengajuan menunggu
        $ps2 = PengajuanSkpi::create([
            'mahasiswa_id' => $mahasiswas[4]->id,
            'periode_skpi_id' => $periodeAktif->id,
            'no_registrasi' => 'REG/2026/07/0002',
            'tgl_pengajuan' => '2026-07-12',
            'status' => 'menunggu',
        ]);
        $ps2->aktivitas()->attach([$a12->id, $a13->id, $a14->id, $a15->id]);

        // Siti — pengajuan menunggu
        $ps3 = PengajuanSkpi::create([
            'mahasiswa_id' => $mahasiswas[1]->id,
            'periode_skpi_id' => $periodeAktif->id,
            'no_registrasi' => 'REG/2026/07/0003',
            'tgl_pengajuan' => '2026-07-14',
            'status' => 'menunggu',
        ]);
        $ps3->aktivitas()->attach([$a5->id, $a6->id, $a7->id]);
    }
}
