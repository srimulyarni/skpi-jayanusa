<?php

namespace App\Http\Requests\Akademis;

use Illuminate\Foundation\Http\FormRequest;

class PengajuanStatusRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'status'           => ['required', 'in:menunggu,diproses,disetujui,revisi,ditolak'],
            'catatan_akademis' => ['nullable', 'string'],
        ];
    }
}
