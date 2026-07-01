import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
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
    const isInitialMount = useRef(true);

    const applyFilters = (overrides: Record<string, string | undefined>) => {
        const params: Record<string, string | undefined> = {
            search: filters.search || undefined,
            kode_institusi: filters.kode_institusi,
            ...overrides,
        };
        Object.keys(params).forEach((k) => {
            if (!params[k] || params[k] === '__all__') {
delete params[k];
}
        });
        router.get('/akademis/identitas-pt', params, { preserveState: true, preserveScroll: true, replace: true });
    };

    const debouncedSearch = useDebouncedCallback((value: string) => {
        applyFilters({ search: value || undefined });
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

        router.delete(`/akademis/identitas-pt/${selected.id}`, {
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
                        <Link href="/akademis/identitas-pt/create"><Plus className="mr-1 h-4 w-4" /> Tambah</Link>
                    </Button>
                </div>

                <Input placeholder="Cari identitas PT..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />

                <div className="flex flex-wrap gap-3">
                    <Select value={filters.kode_institusi ?? '__all__'} onValueChange={(v) => applyFilters({ kode_institusi: v === '__all__' ? undefined : v })}>
                        <SelectTrigger className="w-44"><SelectValue placeholder="Semua Instansi" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="__all__">Semua Instansi</SelectItem>
                            {instansiList.map((kode) => (
                                <SelectItem key={kode} value={kode}>{kode}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {filters.kode_institusi && (
                        <Button variant="ghost" size="sm" onClick={() => applyFilters({ kode_institusi: undefined })}>
                            Reset Filter
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
                                                <Link href={`/akademis/identitas-pt/${item.id}/edit`}><Pencil className="h-4 w-4" /></Link>
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
        { title: 'Dashboard', href: '/akademis/dashboard' },
        { title: 'Identitas PT', href: '/akademis/identitas-pt' },
    ],
};
