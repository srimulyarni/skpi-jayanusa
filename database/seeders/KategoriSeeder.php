<?php

namespace Database\Seeders;

use App\Models\Kategori;
use Illuminate\Database\Seeder;

class KategoriSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            'Prestasi di Bidang Akademik',
            'Prestasi di Bidang Non-Akademik',
            'Organisasi Kemahasiswaan',
            'Kegiatan Ilmiah',
            'Pengabdian Masyarakat',
            'Pelatihan dan Sertifikasi',
            'Kompetisi dan Lomba',
            'Seminar dan Workshop',
        ];

        foreach ($data as $nama) {
            Kategori::create([
                'nama_kategori' => $nama,
                'status' => 'aktif',
            ]);
        }
    }
}
