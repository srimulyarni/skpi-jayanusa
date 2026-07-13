<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('periode_skpi', function (Blueprint $table) {
            $table->string('kode', 10)->nullable()->after('nama');
            $table->integer('max_aktivitas')->nullable()->after('tgl_selesai');
        });

        DB::statement("ALTER TABLE pengajuan_skpi MODIFY status ENUM('menunggu', 'disetujui', 'revisi', 'ditolak', 'dibatalkan') DEFAULT 'menunggu'");

        Schema::table('pengajuan_skpi', function (Blueprint $table) {
            $table->date('tgl_proses')->nullable()->after('tgl_pengajuan');
        });
    }

    public function down(): void
    {
        Schema::table('pengajuan_skpi', function (Blueprint $table) {
            $table->dropColumn('tgl_proses');
        });

        DB::statement("ALTER TABLE pengajuan_skpi MODIFY status ENUM('menunggu', 'disetujui', 'revisi', 'ditolak') DEFAULT 'menunggu'");

        Schema::table('periode_skpi', function (Blueprint $table) {
            $table->dropColumn(['kode', 'max_aktivitas']);
        });
    }
};
