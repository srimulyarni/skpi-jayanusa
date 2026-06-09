<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['kode', 'nama', 'singkatan', 'identitas_pt_id'])]
class Jurusan extends Model
{
    use HasFactory;

    protected $table = 'jurusan';

    public function identitasPt(): BelongsTo
    {
        return $this->belongsTo(IdentitasPt::class);
    }

    public function mahasiswa(): HasMany
    {
        return $this->hasMany(Mahasiswa::class);
    }
}
