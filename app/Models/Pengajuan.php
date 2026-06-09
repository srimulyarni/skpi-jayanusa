<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable([
    'mahasiswa_id', 'no_registrasi', 'tgl_pengajuan',
    'status', 'catatan_akademis',
])]
class Pengajuan extends Model
{
    use HasFactory;

    protected $table = 'pengajuan';

    protected function casts(): array
    {
        return [
            'tgl_pengajuan' => 'date',
        ];
    }

    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class);
    }

    public function detailPengajuan(): HasMany
    {
        return $this->hasMany(DetailPengajuan::class);
    }

    public function skpi(): HasOne
    {
        return $this->hasOne(Skpi::class);
    }
}
