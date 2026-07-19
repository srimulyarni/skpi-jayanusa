import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LaporanFilterPanel } from './partials/filter-panel';

type Pengambilan = {
    id: number; tgl_pengambilan: string | null; status: string;
    skpi: {
        no_skpi: string; tgl_terbit: string;
        pengajuan_skpi: { mahasiswa: { nama: string; nobp: string; jurusan: { nama: string } | null } };
    } | null;
};

type Filters = { dari?: string; sampai?: string; kode?: string; status_ambil?: string };

export default function LaporanPengambilan({ data, filters }: { data: Pengambilan[]; filters: Filters }) {
    const [statusAmbil, setStatusAmbil] = useState(filters.status_ambil ?? '');

    function handleStatusChange(v: string) {
        setStatusAmbil(v);
        router.get('/validator/laporan/pengambilan', { ...filters, status_ambil: v === 'all' ? undefined : v }, { preserveState: true, replace: true });
    }

    return (
        <>
            <Head title="Laporan Pengambilan SKPI" />
            <div className="space-y-4 p-4 md:p-6">
                <h1 className="text-xl font-semibold">Laporan Pengambilan SKPI</h1>

                <LaporanFilterPanel baseUrl="/validator/laporan/pengambilan" filters={filters} pdfUrl="/validator/laporan/pengambilan/pdf">
                    <div className="grid gap-1">
                        <label className="text-xs">Status</label>
                        <Select value={statusAmbil || 'all'} onValueChange={handleStatusChange}>
                            <SelectTrigger className="w-40"><SelectValue placeholder="Semua" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua</SelectItem>
                                <SelectItem value="sudah">Sudah Diambil</SelectItem>
                                <SelectItem value="belum">Belum Diambil</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </LaporanFilterPanel>

                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">No</TableHead>
                                <TableHead>No. SKPI</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>NOBP</TableHead>
                                <TableHead>Jurusan</TableHead>
                                <TableHead>Tgl Terbit</TableHead>
                                <TableHead>Tgl Pengambilan</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground">Tidak ada data</TableCell></TableRow>
                            ) : data.map((p, i) => (
                                <TableRow key={p.id}>
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell className="font-mono text-sm">{p.skpi?.no_skpi ?? '-'}</TableCell>
                                    <TableCell className="font-medium">{p.skpi?.pengajuan_skpi?.mahasiswa?.nama ?? '-'}</TableCell>
                                    <TableCell>{p.skpi?.pengajuan_skpi?.mahasiswa?.nobp ?? '-'}</TableCell>
                                    <TableCell>{p.skpi?.pengajuan_skpi?.mahasiswa?.jurusan?.nama ?? '-'}</TableCell>
                                    <TableCell>{p.skpi?.tgl_terbit ? new Date(p.skpi.tgl_terbit).toLocaleDateString('id-ID') : '-'}</TableCell>
                                    <TableCell>{p.tgl_pengambilan ? new Date(p.tgl_pengambilan).toLocaleDateString('id-ID') : '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant={p.status === 'sudah_diambil' ? 'default' : 'outline'}>
                                            {p.status === 'sudah_diambil' ? 'Sudah' : 'Belum'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <p className="text-sm text-muted-foreground">Total: {data.length} data pengambilan</p>
            </div>
        </>
    );
}

LaporanPengambilan.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/validator/dashboard' },
        { title: 'Laporan Pengambilan', href: '/validator/laporan/pengambilan' },
    ],
};
