<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('aktivitas', function (Blueprint $table) {
            $table->date('tgl_pengajuan')->nullable()->after('tingkat');
            $table->date('tgl_disetujui')->nullable()->after('tgl_pengajuan');
        });

        DB::table('aktivitas')->update(['tgl_pengajuan' => DB::raw('DATE(created_at)')]);

        DB::table('aktivitas')->where('status', 'disetujui')
            ->update(['tgl_disetujui' => DB::raw('DATE(updated_at)')]);
    }

    public function down(): void
    {
        Schema::table('aktivitas', function (Blueprint $table) {
            $table->dropColumn(['tgl_pengajuan', 'tgl_disetujui']);
        });
    }
};
