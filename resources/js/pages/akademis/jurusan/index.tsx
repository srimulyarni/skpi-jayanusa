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
import { Button } from '@/components/ui/button';

type IdentitasPt = { id: number; kode_institusi: string };
type Jurusan = { id: number; kode: string; nama: string; singkatan: string; identitas_pt: IdentitasPt };

export default function JurusanIndex({ jurusan }: { jurusan: Jurusan[] }) {
    const [openHapus, setOpenHapus] = useState(false);
    const [selected, setSelected] = useState<Jurusan | null>(null);

    function hapus() {
        if (!selected) {
            return;
        }

        router.delete(`/akademis/jurusan/${selected.id}`, {
            onSuccess: () => {
                setOpenHapus(false);
                toast.success('Berhasil!');
            },
        });
    }

    const columns: ColumnDef<Jurusan>[] = [
        { accessorKey: 'kode', header: 'Kode' },
        { accessorKey: 'nama', header: 'Nama Jurusan' },
        { accessorKey: 'singkatan', header: 'Singkatan' },
        {
            id: 'institusi',
            header: 'Institusi',
            accessorFn: (row) => row.identitas_pt?.kode_institusi ?? '-',
        },
        {
            id: 'aksi',
            header: 'Aksi',
            cell: ({ row }) => {
                const item = row.original;

                return (
                    <div className="flex gap-2">
                        <Button size="icon" variant="ghost" asChild>
                            <Link href={`/akademis/jurusan/${item.id}/edit`}>
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
            <Head title="Jurusan" />

            <div className="space-y-4 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Jurusan</h1>
                    <Button size="sm" asChild>
                        <Link href="/akademis/jurusan/create">
                            <Plus className="mr-1 h-4 w-4" /> Tambah
                        </Link>
                    </Button>
                </div>
                <DataTable columns={columns} data={jurusan} searchKey="nama" searchPlaceholder="Cari jurusan..." />
            </div>

            <AlertDialog open={openHapus} onOpenChange={setOpenHapus}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Jurusan <strong>{selected?.nama}</strong> akan dihapus permanen.
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

JurusanIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/akademis/dashboard' },
        { title: 'Jurusan', href: '/akademis/jurusan' },
    ],
};
