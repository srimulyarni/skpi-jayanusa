<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['nama_kategori', 'status'])]
class Kategori extends Model
{
    use HasFactory;

    protected $table = 'kategori';

    public function detailPengajuan(): HasMany
    {
        return $this->hasMany(DetailPengajuan::class);
    }
}
