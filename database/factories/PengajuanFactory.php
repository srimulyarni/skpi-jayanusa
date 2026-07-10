<?php

namespace Database\Factories;

use App\Models\Mahasiswa;
use App\Models\Pengajuan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pengajuan>
 */
class PengajuanFactory extends Factory
{
    protected $model = Pengajuan::class;

    public function definition(): array
    {
        return [
            'mahasiswa_id' => Mahasiswa::factory(),
            'no_registrasi' => fake()->unique()->numerify('REG/####/##/####'),
            'tgl_pengajuan' => fake()->dateTimeBetween('-6 months', 'now'),
            'status' => 'menunggu',
            'catatan_akademis' => null,
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
            'no_registrasi' => null,
            'tgl_pengajuan' => null,
        ]);
    }

    public function disetujui(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'disetujui',
        ]);
    }

    public function diproses(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'diproses',
        ]);
    }

    public function revisi(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'revisi',
            'catatan_akademis' => 'Perlu revisi.',
        ]);
    }

    public function ditolak(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'ditolak',
            'catatan_akademis' => 'Ditolak.',
        ]);
    }
}
