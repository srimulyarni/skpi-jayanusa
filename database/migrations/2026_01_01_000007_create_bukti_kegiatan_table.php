<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bukti_kegiatan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('detail_pengajuan_id')->constrained('detail_pengajuan')->cascadeOnDelete();
            $table->string('nama_file');
            $table->string('path_file');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bukti_kegiatan');
    }
};
