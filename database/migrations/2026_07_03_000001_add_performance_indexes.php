<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pengajuan', function (Blueprint $table) {
            $table->index('status');
            $table->index('tgl_pengajuan');
            $table->index(['status', 'tgl_pengajuan']);
        });

        Schema::table('mahasiswa', function (Blueprint $table) {
            $table->index('tahun_masuk');
            $table->index('nama');
        });

        Schema::table('skpi', function (Blueprint $table) {
            $table->index('status');
            $table->index('tgl_terbit');
        });
    }

    public function down(): void
    {
        Schema::table('pengajuan', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['tgl_pengajuan']);
            $table->dropIndex(['status', 'tgl_pengajuan']);
        });

        Schema::table('mahasiswa', function (Blueprint $table) {
            $table->dropIndex(['tahun_masuk']);
            $table->dropIndex(['nama']);
        });

        Schema::table('skpi', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['tgl_terbit']);
        });
    }
};
