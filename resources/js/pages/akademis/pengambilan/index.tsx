import { Head, router } from '@inertiajs/react';
import { CheckCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';
import { DataTablePagination } from '@/components/data-table-pagination';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Pengambilan = {
    id: number; tgl_pengambilan: string; diambil_pada: string | null;
    status: 'belum_diambil' | 'sudah_diambil';
    skpi: { no_skpi: string };
    mahasiswa: { nobp: string; nama: string; jurusan: { singkatan: string } | null };
};

interface PaginationLink { url: string | null; label: string; active: boolean }
interface PaginatedData {
    data: Pengambilan[]; current_page: number; last_page: number;
    per_page: number; total: number; links: PaginationLink[];
}

export default function PengambilanIndex({ pengambilan, filters }: { pengambilan: PaginatedData; filters: { search?: string } }) {
    const [openKonfirm, setOpenKonfirm] = useState(false);
    const [selected, setSelected] = useState<Pengambilan | null>(null);
    const [search, setSearch] = useState(filters.search ?? '');
    const isInitialMount = useRef(true);

    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.get('/akademis/pengambilan', { search: value || undefined }, { preserveState: true, preserveScroll: true, replace: true });
    }, 500);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;

            return;
        }

        debouncedSearch(search);
    }, [search, debouncedSearch]);

    function ambil() {
        if (!selected) {
return;
}

        router.patch(`/akademis/pengambilan/${selected.id}/ambil`, {}, {
            onSuccess: () => {
 setOpenKonfirm(false); toast.success('Berhasil!'); 
},
        });
    }

    return (
        <>
            <Head title="Data Pengambilan" />

            <div className="space-y-4 p-4 md:p-6">
                <h1 className="text-xl font-semibold">Data Pengambilan SKPI</h1>

                <Input placeholder="Cari mahasiswa..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />

                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">No</TableHead>
                                <TableHead>No. SKPI</TableHead>
                                <TableHead>Mahasiswa</TableHead>
                                <TableHead>Tgl Pengambilan</TableHead>
                                <TableHead>Diambil Pada</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-36">Aksi</TableHead>
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
                                    <TableCell>{p.diambil_pada ? new Date(p.diambil_pada).toLocaleDateString('id-ID') : '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant={p.status === 'sudah_diambil' ? 'default' : 'outline'}>
                                            {p.status === 'sudah_diambil' ? 'Sudah Diambil' : 'Belum Diambil'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {p.status !== 'sudah_diambil' && (
                                            <Button size="sm" variant="outline" onClick={() => {
 setSelected(p); setOpenKonfirm(true); 
}}>
                                                <CheckCheck className="mr-1 h-4 w-4" /> Tandai Diambil
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

                <DataTablePagination data={pengambilan} />
            </div>

            <AlertDialog open={openKonfirm} onOpenChange={setOpenKonfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>SKPI atas nama <strong>{selected?.mahasiswa.nama}</strong> akan ditandai sudah diambil.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={ambil}>Konfirmasi</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

PengambilanIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/akademis/dashboard' },
        { title: 'Pengambilan', href: '/akademis/pengambilan' },
    ],
};
