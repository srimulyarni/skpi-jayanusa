<?php

namespace Database\Seeders;

use App\Models\Kategori;
use Illuminate\Database\Seeder;

class KategoriSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['nama' => 'Prestasi di Bidang Akademik', 'tipe' => 'lainnya'],
            ['nama' => 'Prestasi di Bidang Non-Akademik', 'tipe' => 'lainnya'],
            ['nama' => 'Organisasi Kemahasiswaan', 'tipe' => 'lainnya'],
            ['nama' => 'Kegiatan Ilmiah', 'tipe' => 'lainnya'],
            ['nama' => 'Pengabdian Masyarakat', 'tipe' => 'lainnya'],
            ['nama' => 'Pelatihan dan Sertifikasi', 'tipe' => 'lainnya'],
            ['nama' => 'Kompetisi dan Lomba', 'tipe' => 'lomba'],
            ['nama' => 'Seminar dan Workshop', 'tipe' => 'lainnya'],
        ];

        foreach ($data as $item) {
            Kategori::create([
                'nama_kategori' => $item['nama'],
                'tipe' => $item['tipe'],
                'status' => 'aktif',
            ]);
        }
    }
}
