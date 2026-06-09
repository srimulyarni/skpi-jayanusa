<?php

namespace App\Actions;

use App\Models\Jurusan;
use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class FindOrCreateMahasiswaAction
{
    public function execute(array $apiData, string $plainPassword): User
    {
        $nobp = $apiData['nobp'];

        $user = User::where('username', $nobp)->first();

        if (!$user) {
            $user = User::create([
                'username' => $nobp,
                'password' => Hash::make($plainPassword),
                'role'     => 'mahasiswa',
            ]);

            $kodeJurusan = substr($nobp, 2, 3);
            $jurusan = Jurusan::where('kode', $kodeJurusan)->first();

            Mahasiswa::create([
                'nobp'       => $nobp,
                'nama'       => $apiData['nama'] ?? $nobp,
                'jurusan_id' => $jurusan?->id,
                'user_id'    => $user->id,
            ]);
        } else {
            $user->update(['password' => Hash::make($plainPassword)]);
        }

        return $user;
    }
}
