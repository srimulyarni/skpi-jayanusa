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
            'tempat_lahir' => ['nullable', 'string', 'max:100'],
            'tanggal_lahir' => ['nullable', 'date'],
            'jk' => ['nullable', 'in:L,P'],
            'alamat' => ['nullable', 'string'],
            'nohp' => ['nullable', 'string', 'max:20', 'regex:/^[0-9]+$/'],
            'foto' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'nomor_ijazah' => ['nullable', 'string', 'max:100'],
            'tahun_masuk' => ['nullable', 'digits:4'],
        ];
    }
}
