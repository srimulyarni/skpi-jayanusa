<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['detail_pengajuan_id', 'nama_file', 'path_file'])]
class BuktiKegiatan extends Model
{
    use HasFactory;

    protected $table = 'bukti_kegiatan';

    public function detailPengajuan(): BelongsTo
    {
        return $this->belongsTo(DetailPengajuan::class);
    }
}
