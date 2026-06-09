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

type IdentitasPt = {
    id: number;
    kode_institusi: string;
    nama_pt: string;
    nama_singkat: string;
    nama_pimpinan: string;
    akreditasi_institusi: string;
};

export default function IdentitasPtIndex({ identitas }: { identitas: IdentitasPt[] }) {
    const [openHapus, setOpenHapus] = useState(false);
    const [selected, setSelected] = useState<IdentitasPt | null>(null);

    function hapus() {
        if (!selected) {
            return;
        }

        router.delete(`/akademis/identitas-pt/${selected.id}`, {
            onSuccess: () => {
                setOpenHapus(false);
                toast.success('Berhasil!');
            },
        });
    }

    const columns: ColumnDef<IdentitasPt>[] = [
        {
            accessorKey: 'kode_institusi',
            header: 'Kode',
            cell: ({ row }) => <span className="font-medium">{row.original.kode_institusi}</span>,
        },
        { accessorKey: 'nama_singkat', header: 'Nama PT' },
        { accessorKey: 'nama_pimpinan', header: 'Pimpinan' },
        { accessorKey: 'akreditasi_institusi', header: 'Akreditasi' },
        {
            id: 'aksi',
            header: 'Aksi',
            cell: ({ row }) => {
                const item = row.original;

                return (
                    <div className="flex gap-2">
                        <Button size="icon" variant="ghost" asChild>
                            <Link href={`/akademis/identitas-pt/${item.id}/edit`}>
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
            <Head title="Identitas PT" />
            <div className="space-y-4 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Identitas PT</h1>
                    <Button size="sm" asChild>
                        <Link href="/akademis/identitas-pt/create">
                            <Plus className="mr-1 h-4 w-4" /> Tambah
                        </Link>
                    </Button>
                </div>
                <DataTable columns={columns} data={identitas} />
            </div>

            <AlertDialog open={openHapus} onOpenChange={setOpenHapus}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Identitas <strong>{selected?.kode_institusi}</strong> akan dihapus permanen.
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

IdentitasPtIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/akademis/dashboard' },
        { title: 'Identitas PT', href: '/akademis/identitas-pt' },
    ],
};
