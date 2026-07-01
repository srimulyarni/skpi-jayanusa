<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Http\Requests\Mahasiswa\MahasiswaProfileRequest;
use App\Models\Mahasiswa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MahasiswaProfileController extends Controller
{
    public function edit(): Response
    {
        $mahasiswa = Mahasiswa::where('user_id', auth()->id())
            ->with('jurusan.identitasPt')
            ->firstOrFail();

        return Inertia::render('mahasiswa/profil', [
            'mahasiswa' => $mahasiswa,
        ]);
    }

    public function update(MahasiswaProfileRequest $request): RedirectResponse
    {
        $mahasiswa = Mahasiswa::where('user_id', auth()->id())->firstOrFail();
        $data = $request->validated();

        if ($request->hasFile('foto')) {
            if ($mahasiswa->foto) {
                Storage::disk('public')->delete($mahasiswa->foto);
            }
            $data['foto'] = $request->file('foto')->store('mahasiswa/foto', 'public');
        }

        $mahasiswa->update($data);

        return back()->with('success', 'Profil berhasil diperbarui.');
    }
}
