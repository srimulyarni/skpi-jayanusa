import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';
import { DataTablePagination } from '@/components/data-table-pagination';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type IdentitasPt = {
    id: number; kode_institusi: string; nama_pt: string;
    nama_singkat: string; nama_pimpinan: string; akreditasi_institusi: string;
};

interface PaginationLink { url: string | null; label: string; active: boolean }
interface PaginatedData {
    data: IdentitasPt[]; current_page: number; last_page: number;
    per_page: number; total: number; links: PaginationLink[];
}

export default function IdentitasPtIndex({
    identitas, instansiList, filters,
}: {
    identitas: PaginatedData;
    instansiList: string[];
    filters: { search?: string; kode_institusi?: string };
}) {
    const [openHapus, setOpenHapus] = useState(false);
    const [selected, setSelected] = useState<IdentitasPt | null>(null);
    const [search, setSearch] = useState(filters.search ?? '');
    const [localInstansi, setLocalInstansi] = useState(filters.kode_institusi ?? '__all__');
    const isInitialMount = useRef(true);

    const apply = () => {
        const params: Record<string, string | undefined> = {
            search: search || undefined,
            kode_institusi: localInstansi === '__all__' ? undefined : localInstansi,
        };
        Object.keys(params).forEach((k) => {
            if (!params[k]) delete params[k];
        });
        router.get('/validator/identitas-pt', params, { preserveState: true, preserveScroll: true, replace: true });
    };

    const reset = () => {
        setSearch('');
        setLocalInstansi('__all__');
        router.get('/validator/identitas-pt', {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    const debouncedSearch = useDebouncedCallback((value: string) => {
        const params: Record<string, string | undefined> = {
            search: value || undefined,
            kode_institusi: localInstansi === '__all__' ? undefined : localInstansi,
        };
        Object.keys(params).forEach((k) => {
            if (!params[k]) delete params[k];
        });
        router.get('/validator/identitas-pt', params, { preserveState: true, preserveScroll: true, replace: true });
    }, 500);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;

            return;
        }
        debouncedSearch(search);
    }, [search, debouncedSearch]);

    function hapus() {
        if (!selected) {
return;
}

        router.delete(`/validator/identitas-pt/${selected.id}`, {
            onSuccess: () => {
 setOpenHapus(false); toast.success('Berhasil!'); 
},
        });
    }

    return (
        <>
            <Head title="Identitas PT" />
            <div className="space-y-4 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Identitas PT</h1>
                    <Button size="sm" asChild>
                        <Link href="/validator/identitas-pt/create"><Plus className="mr-1 h-4 w-4" /> Tambah</Link>
                    </Button>
                </div>

                <div className="flex flex-wrap items-end gap-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground">Cari</label>
                        <Input placeholder="Nama / Kode..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-48" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground">Instansi</label>
                        <Select value={localInstansi} onValueChange={setLocalInstansi}>
                            <SelectTrigger className="w-44"><SelectValue placeholder="Semua" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="__all__">Semua Instansi</SelectItem>
                                {instansiList.map((kode) => (
                                    <SelectItem key={kode} value={kode}>{kode}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button onClick={apply} size="sm">
                        <Search className="mr-1 h-4 w-4" />
                        Terapkan
                    </Button>

                    {filters.kode_institusi && (
                        <Button variant="ghost" size="sm" onClick={reset}>
                            Reset
                        </Button>
                    )}
                </div>

                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">No</TableHead>
                                <TableHead>Kode</TableHead>
                                <TableHead>Nama PT</TableHead>
                                <TableHead>Pimpinan</TableHead>
                                <TableHead>Akreditasi</TableHead>
                                <TableHead className="w-24">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {identitas.data.length ? identitas.data.map((item, i) => (
                                <TableRow key={item.id}>
                                    <TableCell>{(identitas.current_page - 1) * identitas.per_page + i + 1}</TableCell>
                                    <TableCell className="font-medium">{item.kode_institusi}</TableCell>
                                    <TableCell>{item.nama_singkat}</TableCell>
                                    <TableCell>{item.nama_pimpinan}</TableCell>
                                    <TableCell>{item.akreditasi_institusi}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="icon" variant="ghost" asChild>
                                                <Link href={`/validator/identitas-pt/${item.id}/edit`}><Pencil className="h-4 w-4" /></Link>
                                            </Button>
                                            <Button size="icon" variant="ghost" onClick={() => {
 setSelected(item); setOpenHapus(true); 
}}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">Tidak ada data</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <DataTablePagination data={identitas} />
            </div>

            <AlertDialog open={openHapus} onOpenChange={setOpenHapus}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>Identitas <strong>{selected?.kode_institusi}</strong> akan dihapus permanen.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={hapus} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

IdentitasPtIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/validator/dashboard' },
        { title: 'Identitas PT', href: '/validator/identitas-pt' },
    ],
};
