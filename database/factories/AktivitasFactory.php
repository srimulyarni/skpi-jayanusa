<?php

namespace Database\Factories;

use App\Models\Aktivitas;
use App\Models\Kategori;
use App\Models\Mahasiswa;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Aktivitas>
 */
class AktivitasFactory extends Factory
{
    protected $model = Aktivitas::class;

    public function definition(): array
    {
        return [
            'mahasiswa_id' => Mahasiswa::factory(),
            'kategori_id' => Kategori::factory(),
            'nama_kegiatan' => fake()->words(3, true),
            'tahun_kegiatan' => (string) fake()->year(),
            'peran' => fake()->randomElement(['Peserta', 'Ketua', 'Anggota']),
            'bukti_link' => fake()->optional()->url(),
            'juara' => null,
            'tingkat' => null,
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

    public function ditolak(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'ditolak',
            'catatan_validator' => 'Ditolak.',
        ]);
    }
}
