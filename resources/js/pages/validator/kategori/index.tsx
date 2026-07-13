import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';
import { DataTablePagination } from '@/components/data-table-pagination';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Kategori = { id: number; nama_kategori: string; status: 'aktif' | 'nonaktif' };

interface PaginationLink { url: string | null; label: string; active: boolean }
interface PaginatedData {
    data: Kategori[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

export default function KategoriIndex({ kategori, filters }: { kategori: PaginatedData; filters: { search?: string } }) {
    const [openHapus, setOpenHapus] = useState(false);
    const [selected, setSelected] = useState<Kategori | null>(null);
    const [search, setSearch] = useState(filters.search ?? '');
    const isInitialMount = useRef(true);

    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.get('/validator/kategori', { search: value || undefined }, { preserveState: true, preserveScroll: true, replace: true });
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

        router.delete(`/validator/kategori/${selected.id}`, {
            onSuccess: () => {
 setOpenHapus(false); toast.success('Berhasil!'); 
},
        });
    }

    return (
        <>
            <Head title="Kategori Kegiatan" />

            <div className="space-y-4 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Kategori Kegiatan</h1>
                    <Button size="sm" asChild>
                        <Link href="/validator/kategori/create"><Plus className="mr-1 h-4 w-4" /> Tambah</Link>
                    </Button>
                </div>

                <Input placeholder="Cari kategori..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />

                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">No</TableHead>
                                <TableHead>Nama Kategori</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-24">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {kategori.data.length ? kategori.data.map((k, i) => (
                                <TableRow key={k.id}>
                                    <TableCell>{(kategori.current_page - 1) * kategori.per_page + i + 1}</TableCell>
                                    <TableCell>{k.nama_kategori}</TableCell>
                                    <TableCell>
                                        <Badge variant={k.status === 'aktif' ? 'default' : 'secondary'}>{k.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="icon" variant="ghost" asChild>
                                                <Link href={`/validator/kategori/${k.id}/edit`}><Pencil className="h-4 w-4" /></Link>
                                            </Button>
                                            <Button size="icon" variant="ghost" onClick={() => {
 setSelected(k); setOpenHapus(true); 
}}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Tidak ada data</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <DataTablePagination data={kategori} />
            </div>

            <AlertDialog open={openHapus} onOpenChange={setOpenHapus}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>Kategori <strong>{selected?.nama_kategori}</strong> akan dihapus permanen.</AlertDialogDescription>
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

KategoriIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/validator/dashboard' },
        { title: 'Kategori Kegiatan', href: '/validator/kategori' },
    ],
};
