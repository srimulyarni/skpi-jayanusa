<?php

namespace App\Http\Requests\Akademis;

use Illuminate\Foundation\Http\FormRequest;

class KategoriRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'nama_kategori' => ['required', 'string', 'max:255'],
            'status'        => ['required', 'in:aktif,nonaktif'],
        ];
    }
}
