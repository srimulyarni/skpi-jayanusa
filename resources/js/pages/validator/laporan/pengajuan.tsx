import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LaporanFilterPanel } from './partials/filter-panel';

type Mahasiswa = { nama: string; nobp: string; jurusan: { nama: string } | null };
type Periode = { id: number; nama: string };
type Pengajuan = {
    id: number; no_registrasi: string | null; tgl_pengajuan: string | null; status: string;
    mahasiswa: Mahasiswa; periode_skpi: Periode;
};

const statusColors: Record<string, string> = {
    menunggu: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    disetujui: 'bg-green-100 text-green-800 border-green-300',
    ditolak: 'bg-red-100 text-red-800 border-red-300',
    dibatalkan: 'bg-gray-100 text-gray-800 border-gray-300',
};

type Filters = { dari?: string; sampai?: string; kode?: string; status?: string };

export default function LaporanPengajuan({ data, filters }: { data: Pengajuan[]; filters: Filters }) {
    const [status, setStatus] = useState(filters.status ?? '');

    function handleStatusChange(v: string) {
        setStatus(v);
        router.get('/validator/laporan/pengajuan', { ...filters, status: v === 'all' ? undefined : v }, { preserveState: true, replace: true });
    }

    return (
        <>
            <Head title="Laporan Pengajuan SKPI" />
            <div className="space-y-4 p-4 md:p-6">
                <h1 className="text-xl font-semibold">Laporan Pengajuan SKPI</h1>

                <LaporanFilterPanel baseUrl="/validator/laporan/pengajuan" filters={filters} pdfUrl="/validator/laporan/pengajuan/pdf">
                    <div className="grid gap-1">
                        <label className="text-xs">Status</label>
                        <Select value={status || 'all'} onValueChange={handleStatusChange}>
                            <SelectTrigger className="w-40"><SelectValue placeholder="Semua Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="menunggu">Menunggu</SelectItem>
                                <SelectItem value="disetujui">Disetujui</SelectItem>
                                <SelectItem value="ditolak">Ditolak</SelectItem>
                                <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </LaporanFilterPanel>

                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">No</TableHead>
                                <TableHead>No. Registrasi</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>NOBP</TableHead>
                                <TableHead>Jurusan</TableHead>
                                <TableHead>Periode</TableHead>
                                <TableHead>Tgl Pengajuan</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground">Tidak ada data</TableCell></TableRow>
                            ) : data.map((p, i) => (
                                <TableRow key={p.id}>
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell className="font-mono text-sm">{p.no_registrasi ?? '-'}</TableCell>
                                    <TableCell className="font-medium">{p.mahasiswa.nama}</TableCell>
                                    <TableCell>{p.mahasiswa.nobp}</TableCell>
                                    <TableCell>{p.mahasiswa.jurusan?.nama ?? '-'}</TableCell>
                                    <TableCell>{p.periode_skpi.nama}</TableCell>
                                    <TableCell>{p.tgl_pengajuan ? new Date(p.tgl_pengajuan).toLocaleDateString('id-ID') : '-'}</TableCell>
                                    <TableCell><Badge variant="outline" className={statusColors[p.status] ?? ''}>{p.status}</Badge></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <p className="text-sm text-muted-foreground">Total: {data.length} pengajuan</p>
            </div>
        </>
    );
}

LaporanPengajuan.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/validator/dashboard' },
        { title: 'Laporan Pengajuan', href: '/validator/laporan/pengajuan' },
    ],
};
