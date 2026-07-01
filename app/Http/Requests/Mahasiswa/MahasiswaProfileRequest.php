<?php

namespace App\Http\Requests\Mahasiswa;

use Illuminate\Foundation\Http\FormRequest;

class MahasiswaProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'foto' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'tempat_lahir' => ['required', 'string', 'max:100'],
            'tanggal_lahir' => ['required', 'date'],
            'jk' => ['required', 'in:L,P'],
            'nohp' => ['required', 'string', 'max:20', 'regex:/^[0-9]+$/'],
            'alamat' => ['required', 'string'],
            'nomor_ijazah' => ['required', 'string', 'max:100'],
            'tahun_lulus' => ['nullable', 'digits:4'],
        ];
    }
}
