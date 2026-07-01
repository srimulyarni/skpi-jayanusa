<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'nobp', 'nama', 'tempat_lahir', 'tanggal_lahir', 'jk',
    'alamat', 'nohp', 'foto', 'jurusan_id',
    'nomor_ijazah', 'tahun_lulus', 'user_id',
])]
class Mahasiswa extends Model
{
    use HasFactory;

    protected $table = 'mahasiswa';

    protected function casts(): array
    {
        return [
            'tanggal_lahir' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function jurusan(): BelongsTo
    {
        return $this->belongsTo(Jurusan::class);
    }

    public function pengajuan(): HasMany
    {
        return $this->hasMany(Pengajuan::class);
    }

    public function pengambilan(): HasMany
    {
        return $this->hasMany(Pengambilan::class);
    }
}
