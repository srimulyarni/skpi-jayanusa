<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'mahasiswa_id', 'kategori_id', 'nama_kegiatan', 'tahun_kegiatan',
    'peran', 'bukti_link', 'juara', 'tingkat', 'status', 'catatan_validator',
])]
class Aktivitas extends Model
{
    use HasFactory;

    protected $table = 'aktivitas';

    protected function casts(): array
    {
        return [];
    }

    protected function namaKegiatan(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::make(
            set: fn (mixed $value) => strtoupper((string) $value),
        );
    }

    protected function peran(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::make(
            set: fn (mixed $value) => strtoupper((string) $value),
        );
    }

    protected function juara(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::make(
            set: fn (mixed $value) => strtoupper((string) $value),
        );
    }

    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class);
    }

    public function kategori(): BelongsTo
    {
        return $this->belongsTo(Kategori::class);
    }
}
