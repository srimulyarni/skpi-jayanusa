<?php

namespace Database\Factories;

use App\Models\IdentitasPt;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<IdentitasPt>
 */
class IdentitasPtFactory extends Factory
{
    protected $model = IdentitasPt::class;

    public function definition(): array
    {
        return [
            'kode_institusi' => fake()->unique()->lexify('????'),
            'nama_pt' => fake()->company().' '.fake()->randomElement(['Indonesia', 'Nusantara', 'Jaya']),
            'nama_singkat' => fake()->unique()->lexify('???'),
            'nama_en' => fake()->company(),
            'alamat' => fake()->address(),
            'nomor_sk' => fake()->numerify('SK/###/####'),
            'akreditasi_institusi' => fake()->randomElement(['Unggul', 'Baik Sekali', 'Baik']),
            'nama_pimpinan' => fake()->name(),
            'nidn' => fake()->numerify('##########'),
            'gelar' => fake()->randomElement(['Dr.', 'Prof.', null]),
        ];
    }
}
