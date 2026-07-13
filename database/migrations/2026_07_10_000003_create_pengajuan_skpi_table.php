<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengajuan_skpi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahasiswa_id')->constrained('mahasiswa')->cascadeOnDelete();
            $table->foreignId('periode_skpi_id')->constrained('periode_skpi')->restrictOnDelete();
            $table->string('no_registrasi')->unique()->nullable();
            $table->date('tgl_pengajuan')->nullable();
            $table->enum('status', ['menunggu', 'disetujui', 'revisi', 'ditolak'])->default('menunggu');
            $table->text('catatan_validator')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengajuan_skpi');
    }
};
