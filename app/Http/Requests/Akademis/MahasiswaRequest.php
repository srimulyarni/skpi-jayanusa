<?php

namespace App\Http\Requests\Akademis;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MahasiswaRequest extends FormRequest
{
    public function rules(): array
    {
        $mahasiswaId = $this->route('mahasiswa')?->id;

        return [
            'nobp'           => ['required', 'string', Rule::unique('mahasiswa', 'nobp')->ignore($mahasiswaId)],
            'nama'           => ['required', 'string', 'max:255'],
            'tempat_lahir'   => ['nullable', 'string', 'max:100'],
            'tanggal_lahir'  => ['nullable', 'date'],
            'jk'             => ['nullable', 'in:L,P'],
            'alamat'         => ['nullable', 'string'],
            'nohp'           => ['nullable', 'string', 'max:20'],
            'jurusan_id'     => ['required', 'exists:jurusan,id'],
            'akreditasi_prodi' => ['nullable', 'string', 'max:10'],
            'nomor_ijazah'   => ['nullable', 'string', 'max:100'],
            'gelar'          => ['nullable', 'string', 'max:50'],
            'tahun_lulus'    => ['nullable', 'string', 'max:4'],
        ];
    }
}
