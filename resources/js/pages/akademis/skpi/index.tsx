import { Head, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { CheckCircle, ChevronLeft, ChevronRight, XCircle } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/data-table';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Mahasiswa = { nobp: string; nama: string; jurusan: { singkatan: string } };
type SiapTerbit = { id: number; no_registrasi: string; tgl_pengajuan: string; mahasiswa: Mahasiswa };
type Skpi = {
    id: number; no_skpi: string; tgl_terbit: string; status: string;
    pengajuan: { mahasiswa: Mahasiswa };
    pengambilan: { status: string } | null;
};

interface PaginationLink { url: string | null; label: string; active: boolean }
interface PaginatedSkpi {
    data: Skpi[]; current_page: number; last_page: number;
    per_page: number; total: number; links: PaginationLink[];
}

const statusSkpiVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
    diterbitkan: 'default', draft: 'secondary', dibatalkan: 'destructive',
};

export default function SkpiIndex({ skpi, siap_terbit, filters }: { skpi: PaginatedSkpi; siap_terbit: SiapTerbit[]; filters: { search?: string } }) {
    const [openTerbitkan, setOpenTerbitkan] = useState(false);
    const [openBatalkan, setOpenBatalkan] = useState(false);
    const [selectedPengajuan, setSelectedPengajuan] = useState<SiapTerbit | null>(null);
    const [selectedSkpi, setSelectedSkpi] = useState<Skpi | null>(null);
    const [search, setSearch] = useState(filters.search ?? '');

    const doSearch = useCallback((value: string) => {
        setSearch(value);
        router.get('/akademis/skpi', { search: value || undefined }, { preserveState: true, preserveScroll: true });
    }, []);

    function terbitkan() {
        if (!selectedPengajuan) {
return;
}

        router.post('/akademis/skpi', { pengajuan_id: selectedPengajuan.id }, {
            onSuccess: () => {
 setOpenTerbitkan(false); toast.success('Berhasil!'); 
},
        });
    }

    function batalkan() {
        if (!selectedSkpi) {
return;
}

        router.patch(`/akademis/skpi/${selectedSkpi.id}/batalkan`, {}, {
            onSuccess: () => {
 setOpenBatalkan(false); toast.success('Berhasil!'); 
},
        });
    }

    const kolumSiap: ColumnDef<SiapTerbit>[] = [
        {
            accessorKey: 'no_registrasi',
            header: 'No. Registrasi',
            cell: ({ row }) => <span className="font-mono text-sm">{row.original.no_registrasi}</span>,
        },
        {
            id: 'mahasiswa',
            header: 'Mahasiswa',
            accessorFn: (row) => row.mahasiswa.nama,
            cell: ({ row }) => (
                <div>
                    <div className="font-medium">{row.original.mahasiswa.nama}</div>
                    <div className="text-xs text-muted-foreground">{row.original.mahasiswa.nobp}</div>
                </div>
            ),
        },
        {
            id: 'jurusan',
            header: 'Jurusan',
            accessorFn: (row) => row.mahasiswa.jurusan?.singkatan ?? '-',
        },
        {
            accessorKey: 'tgl_pengajuan',
            header: 'Tgl Pengajuan',
            cell: ({ row }) => new Date(row.original.tgl_pengajuan).toLocaleDateString('id-ID'),
        },
        {
            id: 'aksi',
            header: 'Aksi',
            cell: ({ row }) => (
                <Button size="sm" onClick={() => {
 setSelectedPengajuan(row.original); setOpenTerbitkan(true); 
}}>
                    <CheckCircle className="mr-1 h-4 w-4" /> Terbitkan
                </Button>
            ),
        },
    ];

    return (
        <>
            <Head title="Terbitkan SKPI" />

            <div className="space-y-8 px-4 py-6">
                <div>
                    <h1 className="mb-4 text-xl font-semibold">Siap Diterbitkan</h1>
                    <DataTable columns={kolumSiap} data={siap_terbit} searchKey="mahasiswa" searchPlaceholder="Cari mahasiswa..." />
                </div>

                <div>
                    <h2 className="mb-4 text-xl font-semibold">SKPI Diterbitkan</h2>

                    <Input placeholder="Cari no. SKPI / mahasiswa..." value={search} onChange={(e) => doSearch(e.target.value)} className="mb-4 max-w-sm" />

                    <div className="overflow-hidden rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">No</TableHead>
                                    <TableHead>No. SKPI</TableHead>
                                    <TableHead>Mahasiswa</TableHead>
                                    <TableHead>Tgl Terbit</TableHead>
                                    <TableHead>Status SKPI</TableHead>
                                    <TableHead>Pengambilan</TableHead>
                                    <TableHead className="w-16">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {skpi.data.length ? skpi.data.map((s, i) => (
                                    <TableRow key={s.id}>
                                        <TableCell>{(skpi.current_page - 1) * skpi.per_page + i + 1}</TableCell>
                                        <TableCell className="font-mono text-sm">{s.no_skpi}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{s.pengajuan?.mahasiswa?.nama}</div>
                                            <div className="text-xs text-muted-foreground">{s.pengajuan?.mahasiswa?.nobp}</div>
                                        </TableCell>
                                        <TableCell>{new Date(s.tgl_terbit).toLocaleDateString('id-ID')}</TableCell>
                                        <TableCell>
                                            <Badge variant={statusSkpiVariant[s.status] ?? 'secondary'}>{s.status}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={s.pengambilan?.status === 'sudah_diambil' ? 'default' : 'outline'}>
                                                {s.pengambilan?.status ?? '-'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {s.status === 'diterbitkan' && (
                                                <Button size="icon" variant="ghost" onClick={() => {
 setSelectedSkpi(s); setOpenBatalkan(true); 
}}>
                                                    <XCircle className="h-4 w-4 text-destructive" />
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">Tidak ada data</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {skpi.last_page > 1 && (
                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Menampilkan {((skpi.current_page - 1) * skpi.per_page) + 1} - {Math.min(skpi.current_page * skpi.per_page, skpi.total)} dari {skpi.total} data
                            </div>
                            <div className="flex gap-1">
                                {skpi.links.map((link, index) => {
                                    if (link.label === '&laquo; Previous') {
return <Button key={index} variant="outline" size="sm" disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}><ChevronLeft className="h-4 w-4" /></Button>;
}

                                    if (link.label === 'Next &raquo;') {
return <Button key={index} variant="outline" size="sm" disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}><ChevronRight className="h-4 w-4" /></Button>;
}

                                    return <Button key={index} variant={link.active ? 'default' : 'outline'} size="sm" disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}>{link.label}</Button>;
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <AlertDialog open={openTerbitkan} onOpenChange={setOpenTerbitkan}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            SKPI akan diterbitkan untuk <strong>{selectedPengajuan?.mahasiswa.nama}</strong>.
                            Nomor SKPI akan di-generate otomatis.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={terbitkan}>Terbitkan</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={openBatalkan} onOpenChange={setOpenBatalkan}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            SKPI <strong>{selectedSkpi?.no_skpi}</strong> akan dibatalkan.
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

SkpiIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/akademis/dashboard' },
        { title: 'Terbitkan SKPI', href: '/akademis/skpi' },
    ],
};
