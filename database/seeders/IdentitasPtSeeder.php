<?php

namespace Database\Seeders;

use App\Models\IdentitasPt;
use Illuminate\Database\Seeder;

class IdentitasPtSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'kode_institusi' => 'STMIK',
                'nama_pt' => 'Sekolah Tinggi Manajemen Informatika dan Komputer Jayanusa',
                'nama_singkat' => 'STMIK Jayanusa',
                'nama_en' => 'Jayanusa College of Informatics Management and Computer',
                'alamat' => 'Jl. Olo Ladang No. 1, Padang, Sumatera Barat',
                'nomor_sk' => '117/D/O/2001',
                'akreditasi_institusi' => 'Baik',
                'nama_pimpinan' => 'Dr. H. Andi Mustari, M.Kom',
                'nidn' => '1001016801',
                'gelar' => 'S.Kom',
            ],
            [
                'kode_institusi' => 'AMIK',
                'nama_pt' => 'Akademi Manajemen Informatika dan Komputer Jayanusa',
                'nama_singkat' => 'AMIK Jayanusa',
                'nama_en' => 'Jayanusa College of Informatics Management and Computer',
                'alamat' => 'Jl. Olo Ladang No. 1, Padang, Sumatera Barat',
                'nomor_sk' => '118/D/O/2001',
                'akreditasi_institusi' => 'Baik',
                'nama_pimpinan' => 'Dr. H. Andi Mustari, M.Kom',
                'nidn' => '1001016801',
                'gelar' => 'A.Md',
            ],
            [
                'kode_institusi' => 'AKPER',
                'nama_pt' => 'Akademi Keperawatan Jayanusa',
                'nama_singkat' => 'AKPER Jayanusa',
                'nama_en' => 'Jayanusa College of Nursing',
                'alamat' => 'Jl. Olo Ladang No. 1, Padang, Sumatera Barat',
                'nomor_sk' => '119/D/O/2001',
                'akreditasi_institusi' => 'Baik',
                'nama_pimpinan' => 'Dr. H. Andi Mustari, M.Kom',
                'nidn' => '1001016801',
                'gelar' => 'A.Md.Kep',
            ],
        ];

        foreach ($data as $item) {
            IdentitasPt::create($item);
        }
    }
}
