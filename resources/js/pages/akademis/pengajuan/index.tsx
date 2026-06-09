import { Head, Link } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Pengajuan = {
    id: number; no_registrasi: string; tgl_pengajuan: string;
    status: string; mahasiswa: { nobp: string; nama: string; jurusan: { singkatan: string } };
};

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    menunggu: 'outline', diproses: 'secondary', disetujui: 'default',
    revisi: 'secondary', ditolak: 'destructive',
};

const columns: ColumnDef<Pengajuan>[] = [
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
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
            <Badge variant={statusVariant[row.original.status] ?? 'outline'}>
                {row.original.status}
            </Badge>
        ),
    },
    {
        id: 'aksi',
        header: 'Aksi',
        cell: ({ row }) => (
            <Button size="icon" variant="ghost" asChild>
                <Link href={`/akademis/pengajuan/${row.original.id}`}>
                    <Eye className="h-4 w-4" />
                </Link>
            </Button>
        ),
    },
];

export default function PengajuanIndex({ pengajuan }: { pengajuan: Pengajuan[] }) {
    return (
        <>
            <Head title="Kelola Pengajuan" />
            <div className="space-y-4 px-4 py-6">
                <h1 className="text-xl font-semibold">Kelola Pengajuan SKPI</h1>
                <DataTable
                    columns={columns}
                    data={pengajuan}
                    searchKey="mahasiswa"
                    searchPlaceholder="Cari nama mahasiswa..."
                />
            </div>
        </>
    );
}

PengajuanIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/akademis/dashboard' },
        { title: 'Pengajuan', href: '/akademis/pengajuan' },
    ],
};
