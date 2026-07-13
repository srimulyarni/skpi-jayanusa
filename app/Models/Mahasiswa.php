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
    'nomor_ijazah', 'tahun_masuk', 'kompre_status', 'kompre_tanggal', 'user_id',
])]
class Mahasiswa extends Model
{
    use HasFactory;

    protected $table = 'mahasiswa';

    protected function casts(): array
    {
        return [
            'tanggal_lahir' => 'date',
            'kompre_status' => 'boolean',
            'kompre_tanggal' => 'date',
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

    public function aktivitas(): HasMany
    {
        return $this->hasMany(Aktivitas::class);
    }

    public function pengajuanSkpi(): HasMany
    {
        return $this->hasMany(PengajuanSkpi::class);
    }

    public function pengambilan(): HasMany
    {
        return $this->hasMany(Pengambilan::class);
    }
}
