<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengajuan_skpi_aktivitas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pengajuan_skpi_id')->constrained('pengajuan_skpi')->cascadeOnDelete();
            $table->foreignId('aktivitas_id')->constrained('aktivitas')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['pengajuan_skpi_id', 'aktivitas_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengajuan_skpi_aktivitas');
    }
};
