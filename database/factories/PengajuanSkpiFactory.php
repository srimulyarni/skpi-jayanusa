<?php

namespace Database\Factories;

use App\Models\Mahasiswa;
use App\Models\PengajuanSkpi;
use App\Models\PeriodeSkpi;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PengajuanSkpi>
 */
class PengajuanSkpiFactory extends Factory
{
    protected $model = PengajuanSkpi::class;

    public function definition(): array
    {
        return [
            'mahasiswa_id' => Mahasiswa::factory(),
            'periode_skpi_id' => PeriodeSkpi::factory(),
            'no_registrasi' => fake()->unique()->numerify('REG/####/##/####'),
            'tgl_pengajuan' => fake()->dateTimeBetween('-3 months', 'now'),
            'status' => 'menunggu',
            'catatan_validator' => null,
        ];
    }

    public function disetujui(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'disetujui',
        ]);
    }
}
