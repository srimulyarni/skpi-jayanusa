<?php

namespace App\Http\Requests\Akademis;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMahasiswaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tempat_lahir'    => ['nullable', 'string', 'max:100'],
            'tanggal_lahir'   => ['nullable', 'date'],
            'jk'              => ['nullable', 'in:L,P'],
            'alamat'          => ['nullable', 'string'],
            'nohp'            => ['nullable', 'string', 'max:20'],
            'foto'            => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'akreditasi_prodi' => ['nullable', 'string', 'max:10'],
            'nomor_ijazah'   => ['nullable', 'string', 'max:100'],
            'gelar'          => ['nullable', 'string', 'max:50'],
            'tahun_lulus'    => ['nullable', 'string', 'max:4'],
        ];
    }
}
