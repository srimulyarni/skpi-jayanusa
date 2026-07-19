<?php

namespace Database\Factories;

use App\Models\PeriodeSkpi;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PeriodeSkpi>
 */
class PeriodeSkpiFactory extends Factory
{
    protected $model = PeriodeSkpi::class;

    public function definition(): array
    {
        return [
            'nama' => 'Periode ' . fake()->monthName() . ' ' . fake()->year(),
            'kode' => now()->format('Y') . (now()->month <= 6 ? '1' : '2'),
            'tgl_mulai' => now()->subMonth(),
            'tgl_selesai' => now()->addMonth(),
            'max_aktivitas' => 10,
            'status' => 'aktif',
        ];
    }
}
