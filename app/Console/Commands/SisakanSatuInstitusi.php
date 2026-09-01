<?php

namespace App\Console\Commands;

use App\Models\IdentitasPt;
use App\Models\Jurusan;
use App\Models\Mahasiswa;
use App\Models\Skpi;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SisakanSatuInstitusi extends Command
{
    protected $signature = 'institusi:sisakan
        {kode : kode_institusi yang dipertahankan, contoh: STMIK}
        {--dry-run : tampilkan dampaknya saja, tidak mengubah data}';

    protected $description = 'Pindahkan semua jurusan & SKPI ke satu institusi, lalu hapus institusi lainnya';

    public function handle(): int
    {
        $kode = $this->argument('kode');
        $dryRun = (bool) $this->option('dry-run');

        $target = IdentitasPt::where('kode_institusi', $kode)->first();

        if (! $target) {
            $this->error("Identitas PT dengan kode '{$kode}' tidak ditemukan.");
            $this->line('Kode yang tersedia: '.IdentitasPt::pluck('kode_institusi')->implode(', '));

            return self::FAILURE;
        }

        $lain = IdentitasPt::where('id', '!=', $target->id)->get();

        if ($lain->isEmpty()) {
            $this->info("Sudah tunggal. '{$kode}' adalah satu-satunya Identitas PT.");

            return self::SUCCESS;
        }

        $idLain = $lain->pluck('id');
        $jurusan = Jurusan::whereIn('identitas_pt_id', $idLain)->get();
        $skpi = Skpi::whereIn('identitas_pt_id', $idLain)->get();
        $jumlahMahasiswa = Mahasiswa::whereIn('jurusan_id', $jurusan->pluck('id'))->count();

        $this->newLine();
        $this->line("Institusi yang dipertahankan : <info>{$target->kode_institusi}</info> — {$target->nama_pt}");
        $this->line('Institusi yang akan DIHAPUS  : <comment>'.$lain->pluck('kode_institusi')->implode(', ').'</comment>');
        $this->newLine();

        $this->line('Yang akan dipindahkan ke '.$target->kode_institusi.':');
        $this->table(
            ['Jenis', 'Jumlah', 'Rincian'],
            [
                ['Jurusan', $jurusan->count(), $jurusan->pluck('nama')->implode(', ') ?: '-'],
                ['SKPI terbit', $skpi->count(), $skpi->pluck('no_skpi')->implode(', ') ?: '-'],
                ['Mahasiswa terdampak', $jumlahMahasiswa, 'ikut jurusan di atas, data tidak berubah'],
            ]
        );

        if ($skpi->isNotEmpty()) {
            $this->warn('Nomor SKPI di atas TIDAK diubah — akhirannya tetap kode institusi lama,');
            $this->warn('sementara kop suratnya akan mengikuti '.$target->kode_institusi.'.');
        }

        if ($dryRun) {
            $this->newLine();
            $this->info('Mode --dry-run: tidak ada data yang diubah.');

            return self::SUCCESS;
        }

        $this->newLine();
        $this->error('Penghapusan Identitas PT TIDAK BISA dibatalkan. Pastikan database sudah di-backup.');

        if (! $this->confirm('Lanjutkan?', false)) {
            $this->line('Dibatalkan.');

            return self::SUCCESS;
        }

        DB::transaction(function () use ($target, $idLain, $jurusan, $skpi) {
            Jurusan::whereIn('identitas_pt_id', $idLain)->update(['identitas_pt_id' => $target->id]);
            Skpi::whereIn('identitas_pt_id', $idLain)->update(['identitas_pt_id' => $target->id]);
            IdentitasPt::whereIn('id', $idLain)->delete();

            $this->newLine();
            $this->info($jurusan->count().' jurusan dipindahkan.');
            $this->info($skpi->count().' SKPI diarahkan ulang.');
            $this->info($idLain->count().' Identitas PT dihapus.');
        });

        $this->newLine();
        $this->info("Selesai. Sekarang hanya tersisa: {$target->kode_institusi}.");

        return self::SUCCESS;
    }
}
