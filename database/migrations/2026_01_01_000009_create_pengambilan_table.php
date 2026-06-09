<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengambilan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('skpi_id')->constrained('skpi')->cascadeOnDelete();
            $table->foreignId('mahasiswa_id')->constrained('mahasiswa')->cascadeOnDelete();
            $table->date('tgl_pengambilan');
            $table->timestamp('diambil_pada')->nullable();
            $table->enum('status', ['belum_diambil', 'sudah_diambil'])->default('belum_diambil');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengambilan');
    }
};
