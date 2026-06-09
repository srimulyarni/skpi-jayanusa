<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'skpi_id', 'mahasiswa_id', 'tgl_pengambilan',
    'diambil_pada', 'status',
])]
class Pengambilan extends Model
{
    use HasFactory;

    protected $table = 'pengambilan';

    protected function casts(): array
    {
        return [
            'tgl_pengambilan' => 'date',
            'diambil_pada' => 'datetime',
        ];
    }

    public function skpi(): BelongsTo
    {
        return $this->belongsTo(Skpi::class);
    }

    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class);
    }
}
