<?php

namespace Database\Factories;

use App\Models\DetailPengajuan;
use App\Models\Kategori;
use App\Models\Pengajuan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DetailPengajuan>
 */
class DetailPengajuanFactory extends Factory
{
    protected $model = DetailPengajuan::class;

    public function definition(): array
    {
        return [
            'pengajuan_id' => Pengajuan::factory(),
            'kategori_id' => Kategori::factory(),
            'nama_kegiatan' => fake()->sentence(3),
            'tahun_kegiatan' => (string) fake()->year(),
            'peran' => fake()->randomElement(['Peserta', 'Ketua', 'Anggota', 'Pemakalah']),
        ];
    }
}
