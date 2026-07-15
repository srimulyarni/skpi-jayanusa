import { Head, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LaporanFilterPanel } from './partials/filter-panel';
import { useState } from 'react';

type Kategori = { id: number; nama_kategori: string; tipe: string | null };
type Jurusan = { id: number; nama: string };
type Aktivitas = {
    id: number; nama_kegiatan: string; tahun_kegiatan: string; peran: string;
    juara: string | null; tingkat: string | null; status: string;
    mahasiswa: { nama: string; nobp: string; jurusan: { nama: string } | null };
    kategori: { nama_kategori: string; tipe: string | null };
};

const statusColors: Record<string, string> = {
    menunggu: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    disetujui: 'bg-green-100 text-green-800 border-green-300',
    ditolak: 'bg-red-100 text-red-800 border-red-300',
};

type Filters = { dari?: string; sampai?: string; kode?: string; kategori_id?: string; jurusan_id?: string; status?: string };

export default function LaporanAktivitas({
    data, filters, kategoriList, jurusanList,
}: {
    data: Aktivitas[]; filters: Filters;
    kategoriList: Kategori[]; jurusanList: Jurusan[];
}) {
    const [kategoriId, setKategoriId] = useState(filters.kategori_id ?? '');
    const [jurusanId, setJurusanId] = useState(filters.jurusan_id ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    function updateFilter(key: string, value: string) {
        const newFilters = { ...filters, [key]: value === 'all' ? undefined : value };
        if (key === 'kategori_id') setKategoriId(value === 'all' ? '' : value);
        if (key === 'jurusan_id') setJurusanId(value === 'all' ? '' : value);
        if (key === 'status') setStatus(value === 'all' ? '' : value);
        router.get('/validator/laporan/aktivitas', newFilters, { preserveState: true, replace: true });
    }

    return (
        <>
            <Head title="Laporan Aktivitas Siswa" />
            <div className="space-y-4 p-4 md:p-6">
                <h1 className="text-xl font-semibold">Laporan Aktivitas Siswa</h1>

                <LaporanFilterPanel baseUrl="/validator/laporan/aktivitas" filters={filters} pdfUrl="/validator/laporan/aktivitas/pdf">
                    <div className="grid gap-1">
                        <label className="text-xs">Kategori</label>
                        <Select value={kategoriId || 'all'} onValueChange={(v) => updateFilter('kategori_id', v)}>
                            <SelectTrigger className="w-44"><SelectValue placeholder="Semua Kategori" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Kategori</SelectItem>
                                {kategoriList.map((k) => <SelectItem key={k.id} value={String(k.id)}>{k.nama_kategori}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-1">
                        <label className="text-xs">Jurusan</label>
                        <Select value={jurusanId || 'all'} onValueChange={(v) => updateFilter('jurusan_id', v)}>
                            <SelectTrigger className="w-40"><SelectValue placeholder="Semua Jurusan" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Jurusan</SelectItem>
                                {jurusanList.map((j) => <SelectItem key={j.id} value={String(j.id)}>{j.nama}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-1">
                        <label className="text-xs">Status</label>
                        <Select value={status || 'all'} onValueChange={(v) => updateFilter('status', v)}>
                            <SelectTrigger className="w-36"><SelectValue placeholder="Semua Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="menunggu">Menunggu</SelectItem>
                                <SelectItem value="disetujui">Disetujui</SelectItem>
                                <SelectItem value="ditolak">Ditolak</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </LaporanFilterPanel>

                <div className="overflow-x-auto rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">No</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>NOBP</TableHead>
                                <TableHead>Jurusan</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead>Kegiatan</TableHead>
                                <TableHead>Tahun</TableHead>
                                <TableHead>Peran</TableHead>
                                <TableHead>Juara</TableHead>
                                <TableHead>Tingkat</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow><TableCell colSpan={11} className="text-center text-muted-foreground">Tidak ada data</TableCell></TableRow>
                            ) : data.map((a, i) => (
                                <TableRow key={a.id}>
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell className="font-medium">{a.mahasiswa.nama}</TableCell>
                                    <TableCell>{a.mahasiswa.nobp}</TableCell>
                                    <TableCell>{a.mahasiswa.jurusan?.nama ?? '-'}</TableCell>
                                    <TableCell>{a.kategori.nama_kategori}</TableCell>
                                    <TableCell>{a.nama_kegiatan}</TableCell>
                                    <TableCell className="text-center">{a.tahun_kegiatan}</TableCell>
                                    <TableCell>{a.peran}</TableCell>
                                    <TableCell>{a.juara ?? '-'}</TableCell>
                                    <TableCell className="text-center">{a.tingkat ? a.tingkat.charAt(0).toUpperCase() + a.tingkat.slice(1) : '-'}</TableCell>
                                    <TableCell><Badge variant="outline" className={statusColors[a.status] ?? ''}>{a.status}</Badge></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <p className="text-sm text-muted-foreground">Total: {data.length} aktivitas</p>
            </div>
        </>
    );
}

LaporanAktivitas.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/validator/dashboard' },
        { title: 'Laporan Aktivitas', href: '/validator/laporan/aktivitas' },
    ],
};
