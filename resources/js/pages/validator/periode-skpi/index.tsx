import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Periode = {
    id: number; nama: string; kode: string | null; tgl_mulai: string; tgl_selesai: string; max_aktivitas: number | null; status: string;
};

const statusColors: Record<string, string> = {
    aktif: 'bg-green-100 text-green-800 border-green-300',
    nonaktif: 'bg-gray-100 text-gray-800 border-gray-300',
};

export default function PeriodeSkpiIndex({ periode }: { periode: Periode[] }) {
    const [openDelete, setOpenDelete] = useState(false);
    const [selected, setSelected] = useState<Periode | null>(null);

    function handleDelete() {
        if (!selected) {
return;
}
        router.delete(`/validator/periode-skpi/${selected.id}`, {
            onSuccess: () => {
                setOpenDelete(false);
                toast.success('Periode SKPI dihapus.');
            },
            onError: () => setOpenDelete(false),
        });
    }

    return (
        <>
            <Head title="Periode SKPI" />
            <div className="space-y-4 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Periode SKPI</h1>
                    <Button asChild>
                        <Link href="/validator/periode-skpi/create"><Plus className="mr-2 h-4 w-4" /> Tambah</Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">No</TableHead>
                                <TableHead>Kode</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Tanggal Mulai</TableHead>
                                <TableHead>Tanggal Selesai</TableHead>
                                <TableHead className="w-28">Maks. Aktivitas</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-24">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {periode.length === 0 ? (
                                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Belum ada periode.</TableCell></TableRow>
                            ) : periode.map((p, i) => (
                                <TableRow key={p.id}>
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell>{p.kode ?? '-'}</TableCell>
                                    <TableCell className="font-medium">{p.nama}</TableCell>
                                    <TableCell>{new Date(p.tgl_mulai).toLocaleDateString('id-ID')}</TableCell>
                                    <TableCell>{new Date(p.tgl_selesai).toLocaleDateString('id-ID')}</TableCell>
                                    <TableCell>{p.max_aktivitas ?? '-'}</TableCell>
                                    <TableCell><Badge variant="outline" className={statusColors[p.status] ?? ''}>{p.status}</Badge></TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <Button size="icon" variant="ghost" asChild>
                                                <Link href={`/validator/periode-skpi/${p.id}/edit`}><Pencil className="h-4 w-4" /></Link>
                                            </Button>
                                            <Button size="icon" variant="ghost" onClick={() => { setSelected(p); setOpenDelete(true); }}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Periode?</AlertDialogTitle>
                        <AlertDialogDescription>Periode "{selected?.nama}" akan dihapus permanen.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

PeriodeSkpiIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/validator/dashboard' },
        { title: 'Periode SKPI', href: '/validator/periode-skpi' },
    ],
};
