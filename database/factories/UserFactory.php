<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'username' => fake()->unique()->numerify('#########'),
            'password' => static::$password ??= Hash::make('password'),
            'role' => 'mahasiswa',
            'remember_token' => Str::random(10),
        ];
    }

    public function akademis(): static
    {
        return $this->state(fn (array $attributes) => [
            'username' => 'akademis_'.fake()->unique()->numerify('###'),
            'role' => 'akademis',
        ]);
    }

    public function ketua(): static
    {
        return $this->state(fn (array $attributes) => [
            'username' => 'ketua_'.fake()->unique()->numerify('###'),
            'role' => 'ketua',
        ]);
    }
}
