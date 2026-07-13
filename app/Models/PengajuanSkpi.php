<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable([
    'mahasiswa_id', 'periode_skpi_id', 'no_registrasi', 'tgl_pengajuan',
    'tgl_proses', 'status', 'catatan_validator',
])]
class PengajuanSkpi extends Model
{
    use HasFactory;

    protected $table = 'pengajuan_skpi';

    protected function casts(): array
    {
        return [
            'tgl_pengajuan' => 'date',
            'tgl_proses' => 'date',
        ];
    }

    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class);
    }

    public function periodeSkpi(): BelongsTo
    {
        return $this->belongsTo(PeriodeSkpi::class, 'periode_skpi_id');
    }

    public function aktivitas(): BelongsToMany
    {
        return $this->belongsToMany(Aktivitas::class, 'pengajuan_skpi_aktivitas', 'pengajuan_skpi_id', 'aktivitas_id')->withTimestamps();
    }

    public function skpi(): HasOne
    {
        return $this->hasOne(Skpi::class, 'pengajuan_skpi_id');
    }
}
