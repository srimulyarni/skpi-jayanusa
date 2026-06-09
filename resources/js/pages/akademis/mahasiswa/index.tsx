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

type Jurusan = { id: number; singkatan: string };
type Mahasiswa = {
    id: number;
    nobp: string;
    nama: string;
    jk: string | null;
    tahun_lulus: string | null;
    jurusan: Jurusan;
};

export default function MahasiswaIndex({ mahasiswa }: { mahasiswa: Mahasiswa[] }) {
    const [openHapus, setOpenHapus] = useState(false);
    const [selected, setSelected] = useState<Mahasiswa | null>(null);

    function hapus() {
        if (!selected) {
            return;
        }

        router.delete(`/akademis/mahasiswa/${selected.id}`, {
            onSuccess: () => {
                setOpenHapus(false);
                toast.success('Berhasil!');
            },
        });
    }

    const columns: ColumnDef<Mahasiswa>[] = [
        {
            accessorKey: 'nobp',
            header: 'NOBP',
            cell: ({ row }) => <span className="font-mono">{row.original.nobp}</span>,
        },
        { accessorKey: 'nama', header: 'Nama' },
        {
            id: 'jurusan',
            header: 'Jurusan',
            accessorFn: (row) => row.jurusan?.singkatan ?? '-',
        },
        {
            accessorKey: 'jk',
            header: 'JK',
            cell: ({ row }) => row.original.jk ?? '-',
        },
        {
            accessorKey: 'tahun_lulus',
            header: 'Lulus',
            cell: ({ row }) => row.original.tahun_lulus ?? '-',
        },
        {
            id: 'aksi',
            header: 'Aksi',
            cell: ({ row }) => {
                const item = row.original;

                return (
                    <div className="flex gap-2">
                        <Button size="icon" variant="ghost" asChild>
                            <Link href={`/akademis/mahasiswa/${item.id}/edit`}>
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
            <Head title="Data Mahasiswa" />

            <div className="space-y-4 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Data Mahasiswa</h1>
                    <Button size="sm" asChild>
                        <Link href="/akademis/mahasiswa/create">
                            <Plus className="mr-1 h-4 w-4" /> Tambah
                        </Link>
                    </Button>
                </div>
                <DataTable columns={columns} data={mahasiswa} searchKey="nama" searchPlaceholder="Cari mahasiswa..." />
            </div>

            <AlertDialog open={openHapus} onOpenChange={setOpenHapus}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Mahasiswa <strong>{selected?.nama}</strong> dan akun login-nya akan dihapus permanen.
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

MahasiswaIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/akademis/dashboard' },
        { title: 'Data Mahasiswa', href: '/akademis/mahasiswa' },
    ],
};
