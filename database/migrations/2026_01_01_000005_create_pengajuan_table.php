<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengajuan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahasiswa_id')->constrained('mahasiswa')->cascadeOnDelete();
            $table->string('no_registrasi')->unique()->nullable();
            $table->date('tgl_pengajuan')->nullable();
            $table->enum('status', ['draft', 'menunggu', 'diproses', 'disetujui', 'revisi', 'ditolak'])->default('draft');
            $table->text('catatan_akademis')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengajuan');
    }
};
