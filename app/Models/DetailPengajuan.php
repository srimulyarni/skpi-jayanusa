<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'pengajuan_id', 'kategori_id', 'nama_kegiatan',
    'tahun_kegiatan', 'peran',
])]
class DetailPengajuan extends Model
{
    use HasFactory;

    protected $table = 'detail_pengajuan';

    public function pengajuan(): BelongsTo
    {
        return $this->belongsTo(Pengajuan::class);
    }

    public function kategori(): BelongsTo
    {
        return $this->belongsTo(Kategori::class);
    }

    public function buktiKegiatan(): HasMany
    {
        return $this->hasMany(BuktiKegiatan::class);
    }
}
