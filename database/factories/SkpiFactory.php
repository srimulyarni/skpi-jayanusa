<?php

namespace Database\Factories;

use App\Models\IdentitasPt;
use App\Models\PengajuanSkpi;
use App\Models\Skpi;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Skpi>
 */
class SkpiFactory extends Factory
{
    protected $model = Skpi::class;

    public function definition(): array
    {
        return [
            'no_skpi' => fake()->unique()->numerify('SKPI/####/##/####/XXXX'),
            'pengajuan_skpi_id' => PengajuanSkpi::factory(),
            'identitas_pt_id' => IdentitasPt::factory(),
            'tgl_terbit' => fake()->dateTimeBetween('-3 months', 'now'),
            'status' => 'diterbitkan',
        ];
    }

    public function dibatalkan(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'dibatalkan',
        ]);
    }
}
