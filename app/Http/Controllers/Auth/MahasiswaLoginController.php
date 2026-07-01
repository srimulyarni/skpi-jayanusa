<?php

namespace App\Http\Controllers\Auth;

use App\Actions\FindOrCreateMahasiswaAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\MahasiswaLoginRequest;
use App\Services\JayanusaAuthService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class MahasiswaLoginController extends Controller
{
    public function show(Request $request): Response|RedirectResponse
    {
        if (Auth::check()) {
            return redirect('/mahasiswa/dashboard');
        }

        return Inertia::render('auth/mahasiswa-login', [
            'status' => $request->session()->get('status'),
        ]);
    }

    public function store(
        MahasiswaLoginRequest $request,
        JayanusaAuthService $jayanusa,
        FindOrCreateMahasiswaAction $action,
    ): RedirectResponse {
        $apiData = $jayanusa->authenticate($request->nobp, $request->password);

        if (! $apiData) {
            return back()->withErrors(['nobp' => 'NOBP atau password salah.']);
        }

        $user = $action->execute($apiData, $request->password);

        Auth::login($user, $request->boolean('remember'));
        $request->session()->regenerate();

        return redirect('/mahasiswa/dashboard');
    }
}
