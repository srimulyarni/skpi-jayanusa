<?php

namespace Database\Factories;

use App\Models\Jurusan;
use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Mahasiswa>
 */
class MahasiswaFactory extends Factory
{
    protected $model = Mahasiswa::class;

    public function definition(): array
    {
        return [
            'nobp' => fake()->unique()->numerify('#########'),
            'nama' => fake()->name(),
            'tempat_lahir' => fake()->city(),
            'tanggal_lahir' => fake()->dateTimeBetween('-25 years', '-18 years'),
            'jk' => fake()->randomElement(['L', 'P']),
            'alamat' => fake()->address(),
            'nohp' => '08'.fake()->numerify('##########'),
            'foto' => null,
            'jurusan_id' => Jurusan::factory(),
            'nomor_ijazah' => fake()->unique()->numerify('IJZ-########'),
            'tahun_masuk' => (string) fake()->year(),
            'kompre_status' => null,
            'kompre_tanggal' => null,
            'user_id' => User::factory(),
        ];
    }
}
