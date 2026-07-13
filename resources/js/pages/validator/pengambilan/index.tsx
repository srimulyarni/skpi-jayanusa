import { Head, router } from '@inertiajs/react';
import { CheckCheck, Download, Eye, FileText, Search, XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { DataTablePagination } from '@/components/data-table-pagination';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Mahasiswa = { nobp: string; nama: string; jurusan: { nama: string } | null };
type SkpiData = { id: number; no_skpi: string; status: string; pengajuanSkpi?: { no_registrasi: string } };
type Pengambilan = {
    id: number; tgl_pengambilan: string; diambil_pada: string | null;
    status: 'belum_diambil' | 'sudah_diambil';
    skpi: SkpiData;
    mahasiswa: Mahasiswa;
};

interface PaginationLink { url: string | null; label: string; active: boolean }
interface PaginatedData {
    data: Pengambilan[]; current_page: number; last_page: number;
    per_page: number; total: number; links: PaginationLink[];
}

export default function PengambilanIndex({ pengambilan, filters }: {
    pengambilan: PaginatedData;
    filters: { search?: string; status?: string };
}) {
    const [openKonfirm, setOpenKonfirm] = useState(false);
    const [openBatalkan, setOpenBatalkan] = useState(false);
    const [selected, setSelected] = useState<Pengambilan | null>(null);
    const [search, setSearch] = useState(filters.search ?? '');

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        router.get('/validator/pengambilan', { ...filters, search }, { preserveState: true, replace: true });
    }

    function applyFilter(key: string, value: string | undefined) {
        router.get('/validator/pengambilan', { ...filters, [key]: value }, { preserveState: true, replace: true });
    }

    function ambil() {
        if (!selected) return;
        router.patch(`/validator/pengambilan/${selected.id}/ambil`, {}, {
            onSuccess: () => { setOpenKonfirm(false); toast.success('Berhasil ditandai diambil!'); },
        });
    }

    function batalkan() {
        if (!selected) return;
        router.patch(`/validator/pengambilan/${selected.skpi.id}/batalkan`, {}, {
            onSuccess: () => { setOpenBatalkan(false); toast.success('SKPI berhasil dibatalkan.'); },
        });
    }

    return (
        <>
            <Head title="Pengambilan SKPI" />

            <div className="space-y-4 p-4 md:p-6">
                <h1 className="text-xl font-semibold">Pengambilan SKPI</h1>

                <div className="flex flex-wrap items-end gap-3">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari no. SKPI / mahasiswa..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-64 pl-8"
                            />
                        </div>
                        <Button type="submit" variant="secondary" size="sm">Cari</Button>
                    </form>

                    <Select value={filters.status ?? 'all'} onValueChange={(v) => applyFilter('status', v === 'all' ? undefined : v)}>
                        <SelectTrigger className="w-44"><SelectValue placeholder="Semua Status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="belum_diambil">Belum Diambil</SelectItem>
                            <SelectItem value="sudah_diambil">Sudah Diambil</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">No</TableHead>
                                <TableHead>No. SKPI</TableHead>
                                <TableHead>Mahasiswa</TableHead>
                                <TableHead>Tgl Terbit</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Diambil Pada</TableHead>
                                <TableHead className="w-64">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pengambilan.data.length ? pengambilan.data.map((p, i) => (
                                <TableRow key={p.id}>
                                    <TableCell>{(pengambilan.current_page - 1) * pengambilan.per_page + i + 1}</TableCell>
                                    <TableCell className="font-mono text-sm">{p.skpi?.no_skpi}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{p.mahasiswa.nama}</div>
                                        <div className="text-xs text-muted-foreground">{p.mahasiswa.nobp}</div>
                                    </TableCell>
                                    <TableCell>{new Date(p.tgl_pengambilan).toLocaleDateString('id-ID')}</TableCell>
                                    <TableCell>
                                        <Badge variant={p.status === 'sudah_diambil' ? 'default' : 'outline'}>
                                            {p.status === 'sudah_diambil' ? 'Sudah Diambil' : 'Belum Diambil'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{p.diambil_pada ? new Date(p.diambil_pada).toLocaleDateString('id-ID') : '-'}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <Button size="sm" variant="outline" asChild>
                                                <a href={`/validator/skpi/${p.skpi.id}/pdf`} target="_blank" rel="noopener noreferrer">
                                                    <Eye className="mr-1 h-4 w-4" /> Lihat
                                                </a>
                                            </Button>
                                            <Button size="sm" variant="outline" asChild>
                                                <a href={`/validator/skpi/${p.skpi.id}/pdf/download`}>
                                                    <Download className="mr-1 h-4 w-4" /> Download
                                                </a>
                                            </Button>
                                            {p.status !== 'sudah_diambil' && (
                                                <>
                                                    <Button size="sm" variant="outline" onClick={() => { setSelected(p); setOpenKonfirm(true); }}>
                                                        <CheckCheck className="mr-1 h-4 w-4" /> Diambil
                                                    </Button>
                                                    {p.skpi.status === 'diterbitkan' && (
                                                        <Button size="sm" variant="destructive" onClick={() => { setSelected(p); setOpenBatalkan(true); }}>
                                                            <XCircle className="mr-1 h-4 w-4" /> Batalkan
                                                        </Button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">Tidak ada data</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <DataTablePagination data={pengambilan} />
            </div>

            <AlertDialog open={openKonfirm} onOpenChange={setOpenKonfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Pengambilan</AlertDialogTitle>
                        <AlertDialogDescription>SKPI atas nama <strong>{selected?.mahasiswa.nama}</strong> akan ditandai sudah diambil.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={ambil}>Konfirmasi</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={openBatalkan} onOpenChange={setOpenBatalkan}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Batalkan SKPI?</AlertDialogTitle>
                        <AlertDialogDescription>
                            SKPI <strong>{selected?.skpi.no_skpi}</strong> atas nama <strong>{selected?.mahasiswa.nama}</strong> akan dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={batalkan} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Batalkan
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

PengambilanIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/validator/dashboard' },
        { title: 'Pengambilan SKPI', href: '/validator/pengambilan' },
    ],
};
