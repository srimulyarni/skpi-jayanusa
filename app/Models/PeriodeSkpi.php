<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'nama', 'kode', 'tgl_mulai', 'tgl_selesai', 'max_aktivitas', 'status',
])]
class PeriodeSkpi extends Model
{
    use HasFactory;

    protected $table = 'periode_skpi';

    protected function casts(): array
    {
        return [
            'tgl_mulai' => 'date',
            'tgl_selesai' => 'date',
            'max_aktivitas' => 'integer',
        ];
    }
}