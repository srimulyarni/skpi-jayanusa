import { Head, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { CheckCheck } from 'lucide-react';
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

type Pengambilan = {
    id: number;
    tgl_pengambilan: string;
    diambil_pada: string | null;
    status: 'belum_diambil' | 'sudah_diambil';
    skpi: { no_skpi: string };
    mahasiswa: { nobp: string; nama: string; jurusan: { singkatan: string } };
};

export default function PengambilanIndex({ pengambilan }: { pengambilan: Pengambilan[] }) {
    const [openKonfirm, setOpenKonfirm] = useState(false);
    const [selected, setSelected] = useState<Pengambilan | null>(null);

    function ambil() {
        if (!selected) {
            return;
        }

        router.patch(`/akademis/pengambilan/${selected.id}/ambil`, {}, {
            onSuccess: () => {
                setOpenKonfirm(false);
                toast.success('Berhasil!');
            },
        });
    }

    const columns: ColumnDef<Pengambilan>[] = [
        {
            id: 'no_skpi',
            header: 'No. SKPI',
            accessorFn: (row) => row.skpi?.no_skpi ?? '-',
            cell: ({ row }) => <span className="font-mono text-sm">{row.original.skpi?.no_skpi}</span>,
        },
        {
            id: 'mahasiswa',
            header: 'Mahasiswa',
            accessorFn: (row) => row.mahasiswa.nama,
            cell: ({ row }) => (
                <div>
                    <div className="font-medium">{row.original.mahasiswa.nama}</div>
                    <div className="text-xs text-muted-foreground">{row.original.mahasiswa.nobp}</div>
                </div>
            ),
        },
        {
            id: 'jurusan',
            header: 'Jurusan',
            accessorFn: (row) => row.mahasiswa.jurusan?.singkatan ?? '-',
        },
        {
            accessorKey: 'tgl_pengambilan',
            header: 'Tgl Pengambilan',
            cell: ({ row }) => new Date(row.original.tgl_pengambilan).toLocaleDateString('id-ID'),
        },
        {
            id: 'diambil_pada',
            header: 'Diambil Pada',
            cell: ({ row }) =>
                row.original.diambil_pada
                    ? new Date(row.original.diambil_pada).toLocaleDateString('id-ID')
                    : '-',
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant={row.original.status === 'sudah_diambil' ? 'default' : 'outline'}>
                    {row.original.status === 'sudah_diambil' ? 'Sudah Diambil' : 'Belum Diambil'}
                </Badge>
            ),
        },
        {
            id: 'aksi',
            header: 'Aksi',
            cell: ({ row }) => {
                if (row.original.status === 'sudah_diambil') {
                    return null;
                }

                return (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            setSelected(row.original);
                            setOpenKonfirm(true);
                        }}
                    >
                        <CheckCheck className="mr-1 h-4 w-4" /> Tandai Diambil
                    </Button>
                );
            },
        },
    ];

    return (
        <>
            <Head title="Data Pengambilan" />

            <div className="space-y-4 p-4 md:p-6">
                <h1 className="text-xl font-semibold">Data Pengambilan SKPI</h1>
                <DataTable
                    columns={columns}
                    data={pengambilan}
                    searchKey="mahasiswa"
                    searchPlaceholder="Cari nama mahasiswa..."
                />
            </div>

            <AlertDialog open={openKonfirm} onOpenChange={setOpenKonfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            SKPI atas nama <strong>{selected?.mahasiswa.nama}</strong> akan ditandai sudah diambil.
                        </AlertDialogDescription>
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
        { title: 'Data Pengambilan', href: '/akademis/pengambilan' },
    ],
};
