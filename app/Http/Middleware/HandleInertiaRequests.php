<?php

namespace App\Http\Middleware;

use App\Models\PeriodeSkpi;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $nama = $user?->username;
        $avatar = null;
        $isProfileLengkap = false;
        $kompreStatus = false;
        $periodeAktif = false;
        $periodeInfo = null;
        if ($user?->role === 'mahasiswa') {
            $mhs = $user->mahasiswa;
            $nama = $mhs?->nama ?? $nama;
            $avatar = $mhs?->foto ? '/storage/'.$mhs->foto : null;
            $isProfileLengkap = $mhs
                && $mhs->tempat_lahir
                && $mhs->tanggal_lahir
                && $mhs->jk
                && $mhs->nohp
                && $mhs->alamat;
            $kompreStatus = $mhs && $mhs->kompre_status === true;
        }

        $periode = PeriodeSkpi::where('status', 'aktif')
            ->where('tgl_mulai', '<=', now())
            ->where('tgl_selesai', '>=', now())
            ->first();

        $periodeAktif = (bool) $periode;
        if ($periode) {
            $periodeInfo = [
                'nama' => $periode->nama,
                'kode' => $periode->kode,
            ];
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user ? [...$user->toArray(), 'nama' => $nama, 'avatar' => $avatar] : null,
                'isProfileLengkap' => $isProfileLengkap,
                'kompreStatus' => $kompreStatus,
                'periodeAktif' => $periodeAktif,
                'periodeInfo' => $periodeInfo,
            ],
            'recaptchaSiteKey' => config('services.recaptcha.site_key'),
            'recaptchaEnabled' => (bool) config('services.recaptcha.enabled'),
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
