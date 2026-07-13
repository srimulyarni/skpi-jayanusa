<?php

namespace Database\Factories;

use App\Models\Kategori;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Kategori>
 */
class KategoriFactory extends Factory
{
    protected $model = Kategori::class;

    public function definition(): array
    {
        return [
            'nama_kategori' => fake()->unique()->words(2, true),
            'tipe' => 'lainnya',
            'status' => 'aktif',
        ];
    }

    public function lomba(): static
    {
        return $this->state(fn (array $attributes) => [
            'tipe' => 'lomba',
        ]);
    }

    public function nonaktif(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'nonaktif',
        ]);
    }
}
