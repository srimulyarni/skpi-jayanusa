<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class JayanusaAuthService
{
    public function authenticate(string $nobp, string $password): ?array
    {
        $response = Http::acceptJson()
            ->asJson()
            ->withoutVerifying()
            ->timeout(20)
            ->post('https://api.novinaldi.my.id/api/login-voting', [
                'username' => $nobp,
                'password' => $password,
            ]);

        if (! $response->successful() || ! $response->json('success')) {
            return null;
        }

        return $response->json('data');
    }
}
