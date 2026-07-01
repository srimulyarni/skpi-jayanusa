<?php

namespace App\Http\Requests\Akademis;

use Illuminate\Foundation\Http\FormRequest;

class IdentitasPtRequest extends FormRequest
{
    public function rules(): array
    {
        $uniqueRule = $this->isMethod('post')
            ? 'unique:identitas_pt,kode_institusi'
            : 'unique:identitas_pt,kode_institusi,'.$this->route('identitasPt')?->id;

        return [
            'kode_institusi' => ['required', 'string', 'max:20', $uniqueRule],
            'nama_pt' => ['required', 'string', 'max:255'],
            'nama_singkat' => ['required', 'string', 'max:50'],
            'nama_en' => ['required', 'string', 'max:255'],
            'alamat' => ['required', 'string'],
            'nomor_sk' => ['required', 'string', 'max:100'],
            'akreditasi_institusi' => ['required', 'string', 'in:Unggul,Baik Sekali,Baik,Tidak Terakreditasi'],
            'nama_pimpinan' => ['required', 'string', 'max:255'],
            'nidn' => ['required', 'string', 'max:20'],
            'gelar' => ['nullable', 'string', 'max:50'],
        ];
    }
}
