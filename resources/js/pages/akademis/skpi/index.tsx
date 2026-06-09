import { Head, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/data-table';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Mahasiswa = { nobp: string; nama: string; jurusan: { singkatan: string } };
type SiapTerbit = { id: number; no_registrasi: string; tgl_pengajuan: string; mahasiswa: Mahasiswa };
type Skpi = {
    id: number; no_skpi: string; tgl_terbit: string; status: string;
    pengajuan: { mahasiswa: Mahasiswa };
    pengambilan: { status: string } | null;
};

const statusSkpiVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
    diterbitkan: 'default', draft: 'secondary', dibatalkan: 'destructive',
};

export default function SkpiIndex({ skpi, siap_terbit }: { skpi: Skpi[]; siap_terbit: SiapTerbit[] }) {
    const [openTerbitkan, setOpenTerbitkan] = useState(false);
    const [openBatalkan, setOpenBatalkan] = useState(false);
    const [selectedPengajuan, setSelectedPengajuan] = useState<SiapTerbit | null>(null);
    const [selectedSkpi, setSelectedSkpi] = useState<Skpi | null>(null);

    function terbitkan() {
        if (!selectedPengajuan) {
return;
}

        router.post('/akademis/skpi', { pengajuan_id: selectedPengajuan.id }, {
            onSuccess: () => {
 setOpenTerbitkan(false); toast.success('Berhasil!'); 
},
        });
    }

    function batalkan() {
        if (!selectedSkpi) {
return;
}

        router.patch(`/akademis/skpi/${selectedSkpi.id}/batalkan`, {}, {
            onSuccess: () => {
 setOpenBatalkan(false); toast.success('Berhasil!'); 
},
        });
    }

    const kolumSiap: ColumnDef<SiapTerbit>[] = [
        {
            accessorKey: 'no_registrasi',
            header: 'No. Registrasi',
            cell: ({ row }) => <span className="font-mono text-sm">{row.original.no_registrasi}</span>,
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
            accessorKey: 'tgl_pengajuan',
            header: 'Tgl Pengajuan',
            cell: ({ row }) => new Date(row.original.tgl_pengajuan).toLocaleDateString('id-ID'),
        },
        {
            id: 'aksi',
            header: 'Aksi',
            cell: ({ row }) => (
                <Button size="sm" onClick={() => {
 setSelectedPengajuan(row.original); setOpenTerbitkan(true); 
}}>
                    <CheckCircle className="mr-1 h-4 w-4" /> Terbitkan
                </Button>
            ),
        },
    ];

    const kolumSkpi: ColumnDef<Skpi>[] = [
        {
            accessorKey: 'no_skpi',
            header: 'No. SKPI',
            cell: ({ row }) => <span className="font-mono text-sm">{row.original.no_skpi}</span>,
        },
        {
            id: 'mahasiswa',
            header: 'Mahasiswa',
            accessorFn: (row) => row.pengajuan?.mahasiswa?.nama ?? '-',
            cell: ({ row }) => (
                <div>
                    <div className="font-medium">{row.original.pengajuan?.mahasiswa?.nama}</div>
                    <div className="text-xs text-muted-foreground">{row.original.pengajuan?.mahasiswa?.nobp}</div>
                </div>
            ),
        },
        {
            accessorKey: 'tgl_terbit',
            header: 'Tgl Terbit',
            cell: ({ row }) => new Date(row.original.tgl_terbit).toLocaleDateString('id-ID'),
        },
        {
            accessorKey: 'status',
            header: 'Status SKPI',
            cell: ({ row }) => (
                <Badge variant={statusSkpiVariant[row.original.status] ?? 'secondary'}>
                    {row.original.status}
                </Badge>
            ),
        },
        {
            id: 'pengambilan',
            header: 'Pengambilan',
            cell: ({ row }) => (
                <Badge variant={row.original.pengambilan?.status === 'sudah_diambil' ? 'default' : 'outline'}>
                    {row.original.pengambilan?.status ?? '-'}
                </Badge>
            ),
        },
        {
            id: 'aksi',
            header: 'Aksi',
            cell: ({ row }) => {
                if (row.original.status !== 'diterbitkan') {
return null;
}

                return (
                    <Button size="icon" variant="ghost" onClick={() => {
 setSelectedSkpi(row.original); setOpenBatalkan(true); 
}}>
                        <XCircle className="h-4 w-4 text-destructive" />
                    </Button>
                );
            },
        },
    ];

    return (
        <>
            <Head title="Terbitkan SKPI" />

            <div className="space-y-8 px-4 py-6">
                <div>
                    <h1 className="mb-4 text-xl font-semibold">Siap Diterbitkan</h1>
                    <DataTable columns={kolumSiap} data={siap_terbit} searchKey="mahasiswa" searchPlaceholder="Cari mahasiswa..." />
                </div>

                <div>
                    <h2 className="mb-4 text-xl font-semibold">SKPI Diterbitkan</h2>
                    <DataTable columns={kolumSkpi} data={skpi} searchKey="no_skpi" searchPlaceholder="Cari no. SKPI..." />
                </div>
            </div>

            <AlertDialog open={openTerbitkan} onOpenChange={setOpenTerbitkan}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            SKPI akan diterbitkan untuk <strong>{selectedPengajuan?.mahasiswa.nama}</strong>.
                            Nomor SKPI akan di-generate otomatis.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={terbitkan}>Terbitkan</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={openBatalkan} onOpenChange={setOpenBatalkan}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            SKPI <strong>{selectedSkpi?.no_skpi}</strong> akan dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={batalkan} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Batalkan
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

SkpiIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/akademis/dashboard' },
        { title: 'Terbitkan SKPI', href: '/akademis/skpi' },
    ],
};
