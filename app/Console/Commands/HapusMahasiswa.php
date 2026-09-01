<?php

namespace App\Console\Commands;

use App\Models\Aktivitas;
use App\Models\Mahasiswa;
use App\Models\PengajuanSkpi;
use App\Models\Pengambilan;
use App\Models\Skpi;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class HapusMahasiswa extends Command
{
    protected $signature = 'mahasiswa:hapus
        {nobp* : satu atau beberapa NOBP yang akan dihapus}
        {--dry-run : tampilkan dampaknya saja, tidak menghapus apa pun}';

    protected $description = 'Hapus mahasiswa beserta aktivitas, pengajuan, SKPI, dan pengambilannya';

    public function handle(): int
    {
        $daftarNobp = $this->argument('nobp');
        $dryRun = (bool) $this->option('dry-run');

        $mahasiswa = Mahasiswa::with('jurusan')->whereIn('nobp', $daftarNobp)->get();

        $tidakKetemu = collect($daftarNobp)->diff($mahasiswa->pluck('nobp'));

        if ($tidakKetemu->isNotEmpty()) {
            $this->warn('NOBP tidak ditemukan, dilewati: '.$tidakKetemu->implode(', '));
        }

        if ($mahasiswa->isEmpty()) {
            $this->error('Tidak ada mahasiswa yang cocok. Tidak ada yang dihapus.');

            return self::FAILURE;
        }

        $idMahasiswa = $mahasiswa->pluck('id');
        $idPengajuan = PengajuanSkpi::whereIn('mahasiswa_id', $idMahasiswa)->pluck('id');
        $skpi = Skpi::whereIn('pengajuan_skpi_id', $idPengajuan)->get();
        $sudahDiambil = Pengambilan::whereIn('skpi_id', $skpi->pluck('id'))
            ->where('status', 'sudah_diambil')
            ->count();

        $this->newLine();
        $this->line('Mahasiswa yang akan DIHAPUS beserta seluruh datanya:');

        $this->table(
            ['NOBP', 'Nama', 'Jurusan', 'Aktivitas', 'Pengajuan', 'SKPI'],
            $mahasiswa->map(fn (Mahasiswa $m) => [
                $m->nobp,
                $m->nama,
                $m->jurusan?->nama ?? '-',
                Aktivitas::where('mahasiswa_id', $m->id)->count(),
                PengajuanSkpi::where('mahasiswa_id', $m->id)->count(),
                Skpi::whereIn('pengajuan_skpi_id', PengajuanSkpi::where('mahasiswa_id', $m->id)->pluck('id'))->count(),
            ])->all()
        );

        if ($skpi->isNotEmpty()) {
            $this->line('Nomor SKPI yang ikut terhapus: <comment>'.$skpi->pluck('no_skpi')->implode(', ').'</comment>');
        }

        if ($sudahDiambil > 0) {
            $this->newLine();
            $this->error("PERHATIAN: {$sudahDiambil} SKPI berstatus 'sudah_diambil'.");
            $this->error('Artinya dokumen fisiknya kemungkinan sudah dipegang orang. Pastikan ini memang data uji coba.');
        }

        if ($dryRun) {
            $this->newLine();
            $this->info('Mode --dry-run: tidak ada data yang dihapus.');

            return self::SUCCESS;
        }

        $this->newLine();
        $this->error('Penghapusan ini TIDAK BISA dibatalkan. Pastikan database sudah di-backup.');

        if (! $this->confirm('Hapus '.$mahasiswa->count().' mahasiswa di atas?', false)) {
            $this->line('Dibatalkan.');

            return self::SUCCESS;
        }

        DB::transaction(function () use ($mahasiswa) {
            foreach ($mahasiswa as $m) {
                if ($m->foto) {
                    Storage::disk('public')->delete($m->foto);
                }

                $m->user()->delete();
            }
        });

        $this->newLine();
        $this->info($mahasiswa->count().' mahasiswa dihapus beserta aktivitas, pengajuan, SKPI, dan pengambilannya.');
        $this->line('Sisa mahasiswa di database: '.Mahasiswa::count());

        return self::SUCCESS;
    }
}
