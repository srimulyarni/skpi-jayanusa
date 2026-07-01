<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('identitas_pt', function (Blueprint $table) {
            $table->id();
            $table->string('kode_institusi', 20)->unique();
            $table->string('nama_pt');
            $table->string('nama_singkat');
            $table->string('nama_en');
            $table->text('alamat');
            $table->string('nomor_sk');
            $table->string('akreditasi_institusi');
            $table->string('nama_pimpinan');
            $table->string('nidn');
            $table->string('gelar')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('identitas_pt');
    }
};
