import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LaporanFilterPanel } from './partials/filter-panel';

type Skpi = {
    id: number; no_skpi: string; tgl_terbit: string; status: string;
    pengajuan_skpi: { mahasiswa: { nama: string; nobp: string; jurusan: { nama: string } | null } };
    pengambilan: { status: string } | null;
};

type Filters = { dari?: string; sampai?: string; kode?: string; status_ambil?: string; status?: string };

export default function LaporanPenerbitan({ data, filters }: { data: Skpi[]; filters: Filters }) {
    const [statusAmbil, setStatusAmbil] = useState(filters.status_ambil ?? '');
    const [statusSkpi, setStatusSkpi] = useState(filters.status ?? '');

    function handleStatusChange(v: string) {
        setStatusAmbil(v);
        router.get('/validator/laporan/penerbitan', { ...filters, status_ambil: v === 'all' ? undefined : v }, { preserveState: true, replace: true });
    }

    function handleStatusSkpiChange(v: string) {
        setStatusSkpi(v);
        router.get('/validator/laporan/penerbitan', { ...filters, status: v === 'all' ? undefined : v }, { preserveState: true, replace: true });
    }

    const totalTerbit = data.filter((s) => s.status === 'diterbitkan').length;
    const totalBatal = data.filter((s) => s.status === 'dibatalkan').length;

    return (
        <>
            <Head title="Laporan Penerbitan SKPI" />
            <div className="space-y-4 p-4 md:p-6">
                <h1 className="text-xl font-semibold">Laporan Penerbitan SKPI</h1>

                <LaporanFilterPanel baseUrl="/validator/laporan/penerbitan" filters={filters} pdfUrl="/validator/laporan/penerbitan/pdf">
                    <div className="grid gap-1">
                        <label className="text-xs">Status SKPI</label>
                        <Select value={statusSkpi || 'all'} onValueChange={handleStatusSkpiChange}>
                            <SelectTrigger className="w-40"><SelectValue placeholder="Semua" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua</SelectItem>
                                <SelectItem value="diterbitkan">Diterbitkan</SelectItem>
                                <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-1">
                        <label className="text-xs">Pengambilan</label>
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
                                <TableHead>Status SKPI</TableHead>
                                <TableHead>Pengambilan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground">Tidak ada data</TableCell></TableRow>
                            ) : data.map((s, i) => (
                                <TableRow key={s.id}>
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell className="font-mono text-sm">{s.no_skpi}</TableCell>
                                    <TableCell className="font-medium">{s.pengajuan_skpi?.mahasiswa?.nama ?? '-'}</TableCell>
                                    <TableCell>{s.pengajuan_skpi?.mahasiswa?.nobp ?? '-'}</TableCell>
                                    <TableCell>{s.pengajuan_skpi?.mahasiswa?.jurusan?.nama ?? '-'}</TableCell>
                                    <TableCell>{new Date(s.tgl_terbit).toLocaleDateString('id-ID')}</TableCell>
                                    <TableCell>
                                        <Badge variant={s.status === 'dibatalkan' ? 'destructive' : 'default'}>
                                            {s.status === 'dibatalkan' ? 'Dibatalkan' : 'Diterbitkan'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={s.pengambilan?.status === 'sudah_diambil' ? 'default' : 'outline'}>
                                            {s.pengambilan?.status === 'sudah_diambil' ? 'Sudah' : 'Belum'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <p className="text-sm text-muted-foreground">
                    Total: {data.length} SKPI · {totalTerbit} diterbitkan · {totalBatal} dibatalkan
                </p>
            </div>
        </>
    );
}

LaporanPenerbitan.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/validator/dashboard' },
        { title: 'Laporan Penerbitan', href: '/validator/laporan/penerbitan' },
    ],
};
