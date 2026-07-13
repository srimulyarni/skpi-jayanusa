<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable([
    'no_skpi', 'pengajuan_skpi_id', 'identitas_pt_id',
    'tgl_terbit', 'status',
])]
class Skpi extends Model
{
    use HasFactory;

    protected $table = 'skpi';

    protected function casts(): array
    {
        return [
            'tgl_terbit' => 'date',
        ];
    }

    public function pengajuanSkpi(): BelongsTo
    {
        return $this->belongsTo(PengajuanSkpi::class, 'pengajuan_skpi_id');
    }

    public function identitasPt(): BelongsTo
    {
        return $this->belongsTo(IdentitasPt::class);
    }

    public function pengambilan(): HasOne
    {
        return $this->hasOne(Pengambilan::class);
    }
}
