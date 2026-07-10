<?php

namespace Database\Factories;

use App\Models\BuktiKegiatan;
use App\Models\DetailPengajuan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BuktiKegiatan>
 */
class BuktiKegiatanFactory extends Factory
{
    protected $model = BuktiKegiatan::class;

    public function definition(): array
    {
        return [
            'detail_pengajuan_id' => DetailPengajuan::factory(),
            'nama_file' => fake()->fileName().'.jpg',
            'path_file' => 'bukti-kegiatan/'.fake()->uuid().'.jpg',
        ];
    }
}
