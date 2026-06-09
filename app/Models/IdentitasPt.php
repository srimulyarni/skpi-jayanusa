<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'kode_institusi', 'nama_pt', 'nama_singkat', 'nama_en',
    'alamat', 'nomor_sk', 'akreditasi_institusi',
    'nama_pimpinan', 'nidn', 'logo',
])]
class IdentitasPt extends Model
{
    use HasFactory;

    protected $table = 'identitas_pt';

    public function jurusan(): HasMany
    {
        return $this->hasMany(Jurusan::class);
    }

    public function skpi(): HasMany
    {
        return $this->hasMany(Skpi::class);
    }
}
