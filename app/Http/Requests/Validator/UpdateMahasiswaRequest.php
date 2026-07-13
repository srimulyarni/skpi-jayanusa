<?php

namespace App\Http\Requests\Validator;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMahasiswaRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'nama' => ['sometimes', 'string', 'max:255'],
            'tempat_lahir' => ['nullable', 'string', 'max:100'],
            'tanggal_lahir' => ['nullable', 'date'],
            'jk' => ['nullable', 'in:L,P'],
            'alamat' => ['nullable', 'string'],
            'nohp' => ['nullable', 'string', 'max:20'],
            'foto' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'jurusan_id' => ['nullable', 'exists:jurusan,id'],
            'nomor_ijazah' => ['nullable', 'string', 'max:100'],
            'tahun_masuk' => ['nullable', 'digits:4'],
            'kompre_status' => ['nullable', 'boolean'],
            'kompre_tanggal' => ['nullable', 'date'],
        ];
    }
}
