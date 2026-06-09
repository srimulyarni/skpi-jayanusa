<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('skpi', function (Blueprint $table) {
            $table->id();
            $table->string('no_skpi')->unique()->nullable();
            $table->foreignId('pengajuan_id')->constrained('pengajuan')->cascadeOnDelete();
            $table->foreignId('identitas_pt_id')->constrained('identitas_pt')->restrictOnDelete();
            $table->date('tgl_terbit')->nullable();
            $table->enum('status', ['draft', 'diterbitkan', 'dibatalkan'])->default('draft');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('skpi');
    }
};
