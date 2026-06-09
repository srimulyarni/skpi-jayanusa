<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            IdentitasPtSeeder::class,
            JurusanSeeder::class,
            KategoriSeeder::class,
            UserSeeder::class,
        ]);
    }
}
