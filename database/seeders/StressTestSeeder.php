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

        $this->command->info("Seeding {$total} pengajuan...");

        $mhsIds = DB::table('mahasiswa')->where('nobp', 'like', '99%')->pluck('id')->toArray();
        $statuses = ['draft', 'menunggu', 'diproses', 'disetujui', 'revisi', 'ditolak'];
        $pengajuanId = (int) DB::table('pengajuan')->max('id') + 1;
        $startPengajuanId = $pengajuanId;

        for ($i = 0; $i < $total; $i += $chunkSize) {
            $rows = [];
            $batch = min($chunkSize, $total - $i);

            for ($j = 0; $j < $batch; $j++) {
                $seq = $i + $j;
                $status = $statuses[$seq % count($statuses)];
                $isDraft = $status === 'draft';
                $rows[] = [
                    'id' => $pengajuanId,
                    'mahasiswa_id' => $mhsIds[$seq % count($mhsIds)],
                    'no_registrasi' => $isDraft ? null : 'REG/STRESS/'.$pengajuanId,
                    'tgl_pengajuan' => $isDraft ? null : now()->subDays(rand(0, 365))->toDateString(),
                    'status' => $status,
                    'catatan_akademis' => $status === 'revisi' ? 'Revisi otomatis.' : null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
                $pengajuanId++;
            }

            DB::table('pengajuan')->insert($rows);
        }

        $this->command->info('Seeding '.($total * 2).' detail_pengajuan + bukti_kegiatan...');

        $detailId = (int) DB::table('detail_pengajuan')->max('id') + 1;
        $buktiId = (int) DB::table('bukti_kegiatan')->max('id') + 1;
        $pengajuanIds = range($startPengajuanId, $startPengajuanId + $total - 1);

        for ($i = 0; $i < $total; $i += $chunkSize) {
            $details = [];
            $buktis = [];
            $batch = min($chunkSize, $total - $i);

            for ($j = 0; $j < $batch; $j++) {
                $pid = $pengajuanIds[$i + $j];

                for ($k = 0; $k < 2; $k++) {
                    $details[] = [
                        'id' => $detailId,
                        'pengajuan_id' => $pid,
                        'kategori_id' => $kategoriIds[($i + $j + $k) % count($kategoriIds)],
                        'nama_kegiatan' => 'Kegiatan Stress Test '.$detailId,
                        'tahun_kegiatan' => (string) (2024 + (($i + $j) % 3)),
                        'peran' => ($i + $j) % 2 === 0 ? 'Peserta' : 'Ketua',
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];

                    $buktis[] = [
                        'detail_pengajuan_id' => $detailId,
                        'nama_file' => 'bukti_stress_'.$detailId.'.jpg',
                        'path_file' => 'bukti-kegiatan/stress_'.$detailId.'.jpg',
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];

                    $detailId++;
                }
            }

            DB::table('detail_pengajuan')->insert($details);
            DB::table('bukti_kegiatan')->insert($buktis);
        }

        $this->command->info('Seeding ~'.round($total * 0.2).' skpi + pengambilan...');

        $disetujuiIds = DB::table('pengajuan')
            ->whereBetween('id', [$startPengajuanId, $startPengajuanId + $total - 1])
            ->where('status', 'disetujui')
            ->pluck('id')
            ->toArray();

        $skpiId = (int) DB::table('skpi')->max('id') + 1;
        $skpiCount = 0;

        for ($i = 0; $i < count($disetujuiIds); $i += $chunkSize) {
            $skpis = [];
            $pengambilans = [];
            $batch = min($chunkSize, count($disetujuiIds) - $i);

            for ($j = 0; $j < $batch; $j++) {
                $pid = $disetujuiIds[$i + $j];
                $mhsId = DB::table('pengajuan')->where('id', $pid)->value('mahasiswa_id');
                $ptId = $identitasPtIds[($i + $j) % count($identitasPtIds)];

                $skpis[] = [
                    'id' => $skpiId,
                    'no_skpi' => 'SKPI/STRESS/'.$skpiId.'/TEST',
                    'pengajuan_id' => $pid,
                    'identitas_pt_id' => $ptId,
                    'tgl_terbit' => now()->subDays(rand(0, 180))->toDateString(),
                    'status' => 'diterbitkan',
                    'created_at' => $now,
                    'updated_at' => $now,
                ];

                $pengambilans[] = [
                    'skpi_id' => $skpiId,
                    'mahasiswa_id' => $mhsId,
                    'tgl_pengambilan' => now()->subDays(rand(0, 90))->toDateString(),
                    'status' => 'belum_diambil',
                    'created_at' => $now,
                    'updated_at' => $now,
                ];

                $skpiId++;
                $skpiCount++;
            }

            DB::table('skpi')->insert($skpis);
            DB::table('pengambilan')->insert($pengambilans);
        }

        $this->command->info("Done! Users: {$total}, Mahasiswa: {$total}, Pengajuan: {$total}, Detail: ".($total * 2).', Bukti: '.($total * 2).", SKPI: {$skpiCount}, Pengambilan: {$skpiCount}");
    }
}
