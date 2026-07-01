<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class MahasiswaLoginRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'nobp' => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }
}
