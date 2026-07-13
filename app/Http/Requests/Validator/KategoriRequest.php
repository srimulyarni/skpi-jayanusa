<?php

namespace App\Http\Requests\Validator;

use Illuminate\Foundation\Http\FormRequest;

class KategoriRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'nama_kategori' => ['required', 'string', 'max:255'],
            'tipe' => ['required', 'in:lomba,lainnya'],
            'status' => ['required', 'in:aktif,nonaktif'],
        ];
    }
}
