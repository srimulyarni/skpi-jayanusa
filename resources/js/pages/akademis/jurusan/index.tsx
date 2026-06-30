import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Pencil, Plus, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type IdentitasPt = { id: number; kode_institusi: string };
type Jurusan = { id: number; kode: string; nama: string; singkatan: string; identitas_pt: IdentitasPt };

interface PaginationLink { url: string | null; label: string; active: boolean }
interface PaginatedData {
    data: Jurusan[]; current_page: number; last_page: number;
    per_page: number; total: number; links: PaginationLink[];
}

export default function JurusanIndex({ jurusan, filters }: { jurusan: PaginatedData; filters: { search?: string } }) {
    const [openHapus, setOpenHapus] = useState(false);
    const [selected, setSelected] = useState<Jurusan | null>(null);
    const [search, setSearch] = useState(filters.search ?? '');

    const doSearch = useCallback((value: string) => {
        setSearch(value);
        router.get('/akademis/jurusan', { search: value || undefined }, { preserveState: true, preserveScroll: true });
    }, []);

    function hapus() {
        if (!selected) {
return;
}

        router.delete(`/akademis/jurusan/${selected.id}`, {
            onSuccess: () => {
 setOpenHapus(false); toast.success('Berhasil!'); 
},
        });
    }

    return (
        <>
            <Head title="Jurusan" />

            <div className="space-y-4 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Jurusan</h1>
                    <Button size="sm" asChild>
                        <Link href="/akademis/jurusan/create"><Plus className="mr-1 h-4 w-4" /> Tambah</Link>
                    </Button>
                </div>

                <Input placeholder="Cari jurusan..." value={search} onChange={(e) => doSearch(e.target.value)} className="max-w-sm" />

                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">No</TableHead>
                                <TableHead>Kode</TableHead>
                                <TableHead>Nama Jurusan</TableHead>
                                <TableHead>Singkatan</TableHead>
                                <TableHead>Institusi</TableHead>
                                <TableHead className="w-24">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {jurusan.data.length ? jurusan.data.map((j, i) => (
                                <TableRow key={j.id}>
                                    <TableCell>{(jurusan.current_page - 1) * jurusan.per_page + i + 1}</TableCell>
                                    <TableCell>{j.kode}</TableCell>
                                    <TableCell>{j.nama}</TableCell>
                                    <TableCell>{j.singkatan}</TableCell>
                                    <TableCell>{j.identitas_pt?.kode_institusi ?? '-'}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="icon" variant="ghost" asChild>
                                                <Link href={`/akademis/jurusan/${j.id}/edit`}><Pencil className="h-4 w-4" /></Link>
                                            </Button>
                                            <Button size="icon" variant="ghost" onClick={() => {
 setSelected(j); setOpenHapus(true); 
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

                {jurusan.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Menampilkan {((jurusan.current_page - 1) * jurusan.per_page) + 1} - {Math.min(jurusan.current_page * jurusan.per_page, jurusan.total)} dari {jurusan.total} data
                        </div>
                        <div className="flex gap-1">
                            {jurusan.links.map((link, index) => {
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

            <AlertDialog open={openHapus} onOpenChange={setOpenHapus}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>Jurusan <strong>{selected?.nama}</strong> akan dihapus permanen.</AlertDialogDescription>
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

JurusanIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/akademis/dashboard' },
        { title: 'Jurusan', href: '/akademis/jurusan' },
    ],
};
