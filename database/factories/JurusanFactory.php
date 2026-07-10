<?php

namespace Database\Factories;

use App\Models\IdentitasPt;
use App\Models\Jurusan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Jurusan>
 */
class JurusanFactory extends Factory
{
    protected $model = Jurusan::class;

    public function definition(): array
    {
        return [
            'kode' => fake()->unique()->numerify('###'),
            'nama' => fake()->unique()->words(2, true),
            'singkatan' => fake()->unique()->lexify('???'),
            'identitas_pt_id' => IdentitasPt::factory(),
        ];
    }
}
