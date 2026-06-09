<?php

namespace Database\Seeders;

use App\Models\IdentitasPt;
use App\Models\Jurusan;
use Illuminate\Database\Seeder;

class JurusanSeeder extends Seeder
{
    public function run(): void
    {
        $stmik = IdentitasPt::where('kode_institusi', 'STMIK')->first();
        $amik = IdentitasPt::where('kode_institusi', 'AMIK')->first();

        $data = [
            [
                'kode' => '000',
                'nama' => 'Manajemen Informatika',
                'singkatan' => 'MI',
                'identitas_pt_id' => $amik->id,
            ],
            [
                'kode' => '100',
                'nama' => 'Sistem Informasi',
                'singkatan' => 'SI',
                'identitas_pt_id' => $stmik->id,
            ],
            [
                'kode' => '200',
                'nama' => 'Sistem Komputer',
                'singkatan' => 'SK',
                'identitas_pt_id' => $stmik->id,
            ],
        ];

        foreach ($data as $item) {
            Jurusan::create($item);
        }
    }
}
