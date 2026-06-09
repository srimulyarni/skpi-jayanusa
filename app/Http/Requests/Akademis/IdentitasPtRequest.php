<?php

namespace App\Http\Requests\Akademis;

use Illuminate\Foundation\Http\FormRequest;

class IdentitasPtRequest extends FormRequest
{
    public function rules(): array
    {
        $isCreate = $this->isMethod('post');

        return [
            'kode_institusi'       => $isCreate ? ['required', 'string', 'in:STMIK,AMIK,AKPER', 'unique:identitas_pt,kode_institusi'] : [],
            'nama_pt'              => ['required', 'string', 'max:255'],
            'nama_singkat'         => ['required', 'string', 'max:50'],
            'nama_en'              => ['required', 'string', 'max:255'],
            'alamat'               => ['required', 'string'],
            'nomor_sk'             => ['required', 'string', 'max:100'],
            'akreditasi_institusi' => ['required', 'string', 'max:10'],
            'nama_pimpinan'        => ['required', 'string', 'max:255'],
            'nidn'                 => ['required', 'string', 'max:20'],
            'logo'                 => ['nullable', 'string', 'max:255'],
        ];
    }
}
