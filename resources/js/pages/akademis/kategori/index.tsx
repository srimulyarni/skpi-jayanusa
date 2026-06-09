import { Head, Link, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/data-table';
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

type Kategori = { id: number; nama_kategori: string; status: 'aktif' | 'nonaktif' };

export default function KategoriIndex({ kategori }: { kategori: Kategori[] }) {
    const [openHapus, setOpenHapus] = useState(false);
    const [selected, setSelected] = useState<Kategori | null>(null);

    function hapus() {
        if (!selected) {
            return;
        }

        router.delete(`/akademis/kategori/${selected.id}`, {
            onSuccess: () => {
                setOpenHapus(false);
                toast.success('Berhasil!');
            },
        });
    }

    const columns: ColumnDef<Kategori>[] = [
        {
            id: 'index',
            header: '#',
            cell: ({ row }) => row.index + 1,
        },
        {
            accessorKey: 'nama_kategori',
            header: 'Nama Kategori',
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant={row.original.status === 'aktif' ? 'default' : 'secondary'}>
                    {row.original.status}
                </Badge>
            ),
        },
        {
            id: 'aksi',
            header: 'Aksi',
            cell: ({ row }) => {
                const item = row.original;

                return (
                    <div className="flex gap-2">
                        <Button size="icon" variant="ghost" asChild>
                            <Link href={`/akademis/kategori/${item.id}/edit`}>
                                <Pencil className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                                setSelected(item);
                                setOpenHapus(true);
                            }}
                        >
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <Head title="Kategori Kegiatan" />

            <div className="space-y-4 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Kategori Kegiatan</h1>
                    <Button size="sm" asChild>
                        <Link href="/akademis/kategori/create">
                            <Plus className="mr-1 h-4 w-4" /> Tambah
                        </Link>
                    </Button>
                </div>

                <DataTable columns={columns} data={kategori} searchKey="nama_kategori" searchPlaceholder="Cari kategori..." />
            </div>

            <AlertDialog open={openHapus} onOpenChange={setOpenHapus}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Kategori <strong>{selected?.nama_kategori}</strong> akan dihapus permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={hapus}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

KategoriIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/akademis/dashboard' },
        { title: 'Kategori Kegiatan', href: '/akademis/kategori' },
    ],
};
