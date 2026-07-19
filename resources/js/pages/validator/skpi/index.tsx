import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle, Eye, Search, XCircle } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useTour } from '@/hooks/use-tour';

type Mahasiswa = { nobp: string; nama: string; jurusan: { nama: string } | null };
type Pengajuan = {
    id: number; no_registrasi: string; tgl_pengajuan: string; status: string;
    catatan_validator: string | null; mahasiswa: Mahasiswa; periode_skpi: { nama: string };
};

interface PaginationLink { url: string | null; label: string; active: boolean }
interface PaginatedPengajuan {
    data: Pengajuan[]; current_page: number; last_page: number;
    per_page: number; total: number; links: PaginationLink[];
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
    menunggu: 'secondary', disetujui: 'default', ditolak: 'destructive',
};

export default function SkpiIndex({ pengajuan, filters }: {
    pengajuan: PaginatedPengajuan;
    filters: { search?: string; status?: string; kode?: string };
}) {
    const [openTerbitkan, setOpenTerbitkan] = useState(false);
    const [openReject, setOpenReject] = useState(false);
    const [selected, setSelected] = useState<Pengajuan | null>(null);
    const [catatanValidator, setCatatanValidator] = useState('');
    const [search, setSearch] = useState(filters.search ?? '');
    const [kode, setKode] = useState(filters.kode ?? '');

    useTour({
        tourKey: 'has_seen_validator_skpi_tour',
        steps: [
            { element: '[data-tour="skpi-filter"]', popover: { title: 'Pencarian & Filter', description: 'Cari pengajuan berdasarkan nomor registrasi atau nama mahasiswa. Filter berdasarkan status dan periode.', side: 'bottom', align: 'start' } },
            { element: '[data-tour="skpi-table"]', popover: { title: 'Daftar Pengajuan', description: 'Tabel pengajuan SKPI. Anda dapat menyetujui, menolak, atau menerbitkan SKPI dari sini.', side: 'top', align: 'start' } },
        ],
    });

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        applyFilters({ search });
    }

    function applyFilters(params: Record<string, string | undefined>) {
        router.get('/validator/skpi', { ...filters, ...params }, { preserveState: true, replace: true });
    }

    function approve(id: number) {
        router.patch(`/validator/skpi/${id}/approve`, {}, {
            onSuccess: () => toast.success('Pengajuan disetujui!'),
        });
    }

    function reject() {
        if (!selected) {
return;
}

        router.patch(`/validator/skpi/${selected.id}/reject`, { catatan_validator: catatanValidator }, {
            onSuccess: () => {
 setOpenReject(false); setCatatanValidator(''); toast.success('Pengajuan ditolak.'); 
},
        });
    }

    function terbitkan() {
        if (!selected) {
return;
}

        router.post('/validator/skpi', { pengajuan_skpi_id: selected.id }, {
            onSuccess: () => {
 setOpenTerbitkan(false); toast.success('SKPI berhasil diterbitkan!'); 
},
        });
    }

    return (
        <>
            <Head title="Pengajuan SKPI" />

            <div className="space-y-4 p-4 md:p-6">
                <h1 className="text-xl font-semibold">Pengajuan SKPI</h1>

                <div className="flex flex-wrap items-end gap-3" data-tour="skpi-filter">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari no. registrasi / mahasiswa..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-64 pl-8"
                            />
                        </div>
                        <Button type="submit" variant="secondary" size="sm">Cari</Button>
                    </form>

                    <Select value={filters.status ?? 'all'} onValueChange={(v) => applyFilters({ status: v === 'all' ? undefined : v })}>
                        <SelectTrigger className="w-40"><SelectValue placeholder="Semua Status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="menunggu">Menunggu</SelectItem>
                            <SelectItem value="disetujui">Disetujui</SelectItem>
                            <SelectItem value="ditolak">Ditolak</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="grid gap-1">
                        <Label className="text-xs">Kode Periode</Label>
                        <Input type="number" value={kode} onChange={(e) => setKode(e.target.value)} placeholder="20261" className="w-32" />
                    </div>
                    <Button onClick={() => applyFilters({ kode: kode || undefined })} size="sm">Terapkan</Button>
                    <Button onClick={() => {
 setKode(''); applyFilters({ kode: undefined }); 
}} variant="outline" size="sm">Reset</Button>
                </div>

                <div className="overflow-hidden rounded-md border" data-tour="skpi-table">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">No</TableHead>
                                <TableHead>No. Registrasi</TableHead>
                                <TableHead>Mahasiswa</TableHead>
                                <TableHead>Jurusan</TableHead>
                                <TableHead>Tgl Pengajuan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-48">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pengajuan.data.length ? pengajuan.data.map((p, i) => (
                                <TableRow key={p.id}>
                                    <TableCell>{(pengajuan.current_page - 1) * pengajuan.per_page + i + 1}</TableCell>
                                    <TableCell className="font-mono text-sm">{p.no_registrasi}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{p.mahasiswa.nama}</div>
                                        <div className="text-xs text-muted-foreground">{p.mahasiswa.nobp}</div>
                                    </TableCell>
                                    <TableCell>{p.mahasiswa.jurusan?.nama ?? '-'}</TableCell>
                                    <TableCell>{new Date(p.tgl_pengajuan).toLocaleDateString('id-ID')}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant[p.status] ?? 'secondary'}>{p.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <Button size="sm" variant="outline" asChild>
                                                <Link href={`/validator/skpi/${p.id}`}>
                                                    <Eye className="mr-1 h-4 w-4" /> Detail
                                                </Link>
                                            </Button>
                                            {p.status === 'menunggu' && (
                                                <>
                                                    <Button size="sm" onClick={() => approve(p.id)}>
                                                        <CheckCircle className="mr-1 h-4 w-4" /> Setujui
                                                    </Button>
                                                    <Button size="sm" variant="destructive" onClick={() => {
 setSelected(p); setOpenReject(true); 
}}>
                                                        <XCircle className="mr-1 h-4 w-4" /> Tolak
                                                    </Button>
                                                </>
                                            )}
                                            {p.status === 'disetujui' && (
                                                <Button size="sm" onClick={() => {
 setSelected(p); setOpenTerbitkan(true); 
}}>
                                                    <CheckCircle className="mr-1 h-4 w-4" /> Terbitkan
                                                </Button>
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

                <DataTablePagination data={pengajuan} />
            </div>

            <AlertDialog open={openTerbitkan} onOpenChange={setOpenTerbitkan}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Terbitkan SKPI?</AlertDialogTitle>
                        <AlertDialogDescription>
                            SKPI akan diterbitkan untuk <strong>{selected?.mahasiswa.nama}</strong>. Nomor SKPI di-generate otomatis.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={terbitkan}>Terbitkan</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={openReject} onOpenChange={setOpenReject}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tolak Pengajuan</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tolak pengajuan SKPI dari <strong>{selected?.mahasiswa.nama}</strong>. Berikan alasan penolakan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-2">
                        <Label htmlFor="catatan">Catatan Validator</Label>
                        <Textarea id="catatan" placeholder="Alasan penolakan..." value={catatanValidator} onChange={(e) => setCatatanValidator(e.target.value)} className="mt-1" />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setCatatanValidator('')}>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={reject} disabled={!catatanValidator.trim()} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Tolak
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

SkpiIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/validator/dashboard' },
        { title: 'Pengajuan SKPI', href: '/validator/skpi' },
    ],
};
