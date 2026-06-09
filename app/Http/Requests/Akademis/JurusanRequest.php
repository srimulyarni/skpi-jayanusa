<?php

namespace App\Http\Requests\Akademis;

use Illuminate\Foundation\Http\FormRequest;

class JurusanRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'kode'           => ['required', 'in:000,100,200'],
            'nama'           => ['required', 'string', 'max:255'],
            'singkatan'      => ['required', 'string', 'max:10'],
            'identitas_pt_id'=> ['required', 'exists:identitas_pt,id'],
        ];
    }
}
