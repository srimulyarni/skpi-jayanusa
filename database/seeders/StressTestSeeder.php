<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StressTestSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            IdentitasPtSeeder::class,
            JurusanSeeder::class,
            KategoriSeeder::class,
            UserSeeder::class,
        ]);

        $chunkSize = 1000;
        $total = 100_000;

        $jurusanIds = DB::table('jurusan')->pluck('id')->toArray();
        $kategoriIds = DB::table('kategori')->pluck('id')->toArray();
        $identitasPtIds = DB::table('identitas_pt')->pluck('id')->toArray();

        $now = now()->toDateTimeString();
        $password = Hash::make('password');

        $this->command->info("Seeding {$total} users + mahasiswa...");

        $userId = (int) DB::table('users')->max('id') + 1;
        $mhsId = (int) DB::table('mahasiswa')->max('id') + 1;

        for ($i = 0; $i < $total; $i += $chunkSize) {
            $users = [];
            $mahasiswas = [];
            $batch = min($chunkSize, $total - $i);

            for ($j = 0; $j < $batch; $j++) {
                $seq = $i + $j + 1;
                $nobp = sprintf('99%03d%04d', array_search($jurusanIds[$seq % count($jurusanIds)], $jurusanIds), $seq);

                $users[] = [
                    'id' => $userId,
                    'username' => $nobp,
                    'password' => $password,
                    'role' => 'mahasiswa',
                    'created_at' => $now,
                    'updated_at' => $now,
                ];

                $mahasiswas[] = [
                    'id' => $mhsId,
                    'nobp' => $nobp,
                    'nama' => 'Mahasiswa Test '.$seq,
                    'tempat_lahir' => 'Padang',
                    'tanggal_lahir' => '2001-01-15',
                    'jk' => $seq % 2 === 0 ? 'L' : 'P',
                    'alamat' => 'Jl. Stress Test No. '.$seq,
                    'nohp' => '08'.str_pad($seq, 10, '0', STR_PAD_LEFT),
                    'jurusan_id' => $jurusanIds[$seq % count($jurusanIds)],
                    'nomor_ijazah' => 'IJZ-STRESS-'.$seq,
                    'tahun_masuk' => (string) (2024 + ($seq % 3)),
                    'kompre_status' => $seq % 3 === 0,
                    'kompre_tanggal' => $seq % 3 === 0 ? '2026-06-15' : null,
                    'user_id' => $userId,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];

                $userId++;
                $mhsId++;
            }

            DB::table('users')->insert($users);
            DB::table('mahasiswa')->insert($mahasiswas);
        }

        $this->command->info("Seeding {$total} aktivitas...");

        $mhsIds = DB::table('mahasiswa')->where('nobp', 'like', '99%')->pluck('id')->toArray();
        $statuses = ['menunggu', 'disetujui', 'ditolak'];
        $aktivitasId = (int) DB::table('aktivitas')->max('id') + 1;

        for ($i = 0; $i < $total; $i += $chunkSize) {
            $rows = [];
            $batch = min($chunkSize, $total - $i);

            for ($j = 0; $j < $batch; $j++) {
                $seq = $i + $j;
                $status = $statuses[$seq % count($statuses)];
                $kategoriId = $kategoriIds[$seq % count($kategoriIds)];
                $isLomba = DB::table('kategori')->where('id', $kategoriId)->value('tipe') === 'lomba';

                $rows[] = [
                    'id' => $aktivitasId,
                    'mahasiswa_id' => $mhsIds[$seq % count($mhsIds)],
                    'kategori_id' => $kategoriId,
                    'nama_kegiatan' => 'Kegiatan Stress Test '.$aktivitasId,
                    'tahun_kegiatan' => (string) (2024 + ($seq % 3)),
                    'peran' => $seq % 2 === 0 ? 'Peserta' : 'Ketua',
                    'bukti_link' => 'https://drive.google.com/file/d/stress_'.$aktivitasId.'/view',
                    'juara' => $isLomba ? 'Juara '.(($seq % 3) + 1) : null,
                    'tingkat' => $isLomba ? ['universitas', 'wilayah', 'nasional'][$seq % 3] : null,
                    'status' => $status,
                    'catatan_validator' => $status === 'ditolak' ? 'Ditolak otomatis.' : null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
                $aktivitasId++;
            }

            DB::table('aktivitas')->insert($rows);
        }

        $this->command->info('Seeding periode SKPI + pengajuan SKPI...');

        DB::table('periode_skpi')->insert([
            'nama' => 'Periode Stress Test',
            'tgl_mulai' => now()->subMonth()->toDateString(),
            'tgl_selesai' => now()->addMonth()->toDateString(),
            'status' => 'aktif',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $periodeId = DB::table('periode_skpi')->where('nama', 'Periode Stress Test')->value('id');

        $disetujuiAktivitas = DB::table('aktivitas')
            ->where('status', 'disetujui')
            ->where('mahasiswa_id', '>', 0)
            ->groupBy('mahasiswa_id')
            ->pluck('mahasiswa_id')
            ->toArray();

        $pengajuanId = (int) DB::table('pengajuan_skpi')->max('id') + 1;
        $skpiId = (int) DB::table('skpi')->max('id') + 1;
        $skpiCount = 0;
        $batch = 0;

        foreach ($disetujuiAktivitas as $mhsId) {
            $rows = [];
            $rows[] = [
                'id' => $pengajuanId,
                'mahasiswa_id' => $mhsId,
                'periode_skpi_id' => $periodeId,
                'no_registrasi' => 'REG/STRESS/'.$pengajuanId,
                'tgl_pengajuan' => now()->subDays(rand(0, 30))->toDateString(),
                'status' => 'disetujui',
                'created_at' => $now,
                'updated_at' => $now,
            ];

            DB::table('pengajuan_skpi')->insert($rows);

            $aktivitasIds = DB::table('aktivitas')
                ->where('mahasiswa_id', $mhsId)
                ->where('status', 'disetujui')
                ->pluck('id')
                ->toArray();

            $pivotRows = [];
            foreach ($aktivitasIds as $aId) {
                $pivotRows[] = [
                    'pengajuan_skpi_id' => $pengajuanId,
                    'aktivitas_id' => $aId,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
            DB::table('pengajuan_skpi_aktivitas')->insert($pivotRows);

            $ptId = $identitasPtIds[$batch % count($identitasPtIds)];
            DB::table('skpi')->insert([
                'id' => $skpiId,
                'no_skpi' => 'SKPI/STRESS/'.$skpiId.'/TEST',
                'pengajuan_skpi_id' => $pengajuanId,
                'identitas_pt_id' => $ptId,
                'tgl_terbit' => now()->subDays(rand(0, 30))->toDateString(),
                'status' => 'diterbitkan',
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            DB::table('pengambilan')->insert([
                'skpi_id' => $skpiId,
                'mahasiswa_id' => $mhsId,
                'tgl_pengambilan' => now()->subDays(rand(0, 15))->toDateString(),
                'status' => 'belum_diambil',
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            $pengajuanId++;
            $skpiId++;
            $skpiCount++;
            $batch++;
        }

        $this->command->info("Done! Users: {$total}, Mahasiswa: {$total}, Aktivitas: {$total}, SKPI: {$skpiCount}");
    }
}
