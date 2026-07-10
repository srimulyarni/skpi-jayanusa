<?php

namespace Database\Factories;

use App\Models\Mahasiswa;
use App\Models\Pengambilan;
use App\Models\Skpi;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pengambilan>
 */
class PengambilanFactory extends Factory
{
    protected $model = Pengambilan::class;

    public function definition(): array
    {
        return [
            'skpi_id' => Skpi::factory(),
            'mahasiswa_id' => Mahasiswa::factory(),
            'tgl_pengambilan' => fake()->dateTimeBetween('-1 month', 'now'),
            'diambil_pada' => null,
            'status' => 'belum_diambil',
        ];
    }

    public function sudahDiambil(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'sudah_diambil',
            'diambil_pada' => now(),
        ]);
    }
}
