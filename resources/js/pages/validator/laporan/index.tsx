import { Head, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Printer } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Skpi = {
    id: number; no_skpi: string; tgl_terbit: string;
    pengajuan_skpi: {
        mahasiswa: {
            nobp: string; nama: string;
            jurusan: { nama: string; identitas_pt: { kode_institusi: string } };
        };
    };
    pengambilan: { status: string; diambil_pada: string | null } | null;
};

type Ringkasan = {
    total_mahasiswa: number;
    total_aktivitas: number;
    total_disetujui: number;
    total_pengajuan_skpi: number;
    total_diterbitkan: number;
    total_diambil: number;
};

type PengajuanRow = {
    id: number; no_registrasi: string; tgl_pengajuan: string; status: string;
    mahasiswa: { nama: string; nobp: string; jurusan: { nama: string } };
    periode_skpi: { nama: string; kode: string | null };
};

const bulanOptions = [
    { value: '1', label: 'Januari' }, { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' }, { value: '4', label: 'April' },
    { value: '5', label: 'Mei' }, { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' }, { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' }, { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' }, { value: '12', label: 'Desember' },
];

const tahunOptions = Array.from({ length: 5 }, (_, i) => String(new Date().getFullYear() - i));

const columns: ColumnDef<Skpi>[] = [
    {
        id: 'index',
        header: 'No',
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: 'no_skpi',
        header: 'No. SKPI',
        cell: ({ row }) => <span className="font-mono text-sm">{row.original.no_skpi}</span>,
    },
    {
        id: 'mahasiswa',
        header: 'Nama Mahasiswa',
        accessorFn: (row) => row.pengajuan_skpi?.mahasiswa?.nama ?? '-',
        cell: ({ row }) => (
            <div>
                <div className="font-medium">{row.original.pengajuan_skpi?.mahasiswa?.nama}</div>
                <div className="text-xs text-muted-foreground">{row.original.pengajuan_skpi?.mahasiswa?.nobp}</div>
            </div>
        ),
    },
    {
        id: 'jurusan',
        header: 'Jurusan',
        accessorFn: (row) => row.pengajuan_skpi?.mahasiswa?.jurusan?.nama ?? '-',
    },
    {
        id: 'institusi',
        header: 'PT',
        accessorFn: (row) => row.pengajuan_skpi?.mahasiswa?.jurusan?.identitas_pt?.kode_institusi ?? '-',
    },
    {
        accessorKey: 'tgl_terbit',
        header: 'Tgl Terbit',
        cell: ({ row }) => new Date(row.original.tgl_terbit).toLocaleDateString('id-ID'),
    },
    {
        id: 'status_ambil',
        header: 'Status Pengambilan',
        cell: ({ row }) => (
            <Badge variant={row.original.pengambilan?.status === 'sudah_diambil' ? 'default' : 'outline'}>
                {row.original.pengambilan?.status === 'sudah_diambil' ? 'Sudah Diambil' : 'Belum Diambil'}
            </Badge>
        ),
    },
];

const pengajuanColumns: ColumnDef<PengajuanRow>[] = [
    {
        id: 'index',
        header: 'No',
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: 'no_registrasi',
        header: 'No. Registrasi',
        cell: ({ row }) => <span className="font-mono text-sm">{row.original.no_registrasi}</span>,
    },
    {
        id: 'mahasiswa',
        header: 'Mahasiswa',
        accessorFn: (row) => row.mahasiswa?.nama ?? '-',
        cell: ({ row }) => (
            <div>
                <div className="font-medium">{row.original.mahasiswa?.nama}</div>
                <div className="text-xs text-muted-foreground">{row.original.mahasiswa?.nobp}</div>
            </div>
        ),
    },
    {
        id: 'jurusan',
        header: 'Jurusan',
        accessorFn: (row) => row.mahasiswa?.jurusan?.nama ?? '-',
    },
    {
        id: 'periode',
        header: 'Periode',
        accessorFn: (row) => row.periode_skpi?.nama ?? '-',
        cell: ({ row }) => (
            <div>
                <div>{row.original.periode_skpi?.nama}</div>
                {row.original.periode_skpi?.kode && <div className="text-xs text-muted-foreground">{row.original.periode_skpi.kode}</div>}
            </div>
        ),
    },
    {
        accessorKey: 'tgl_pengajuan',
        header: 'Tgl Pengajuan',
        cell: ({ row }) => new Date(row.original.tgl_pengajuan).toLocaleDateString('id-ID'),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const s = row.original.status;
            const cls = s === 'disetujui' ? 'bg-green-100 text-green-800 border-green-300'
                : s === 'menunggu' ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                : s === 'ditolak' ? 'bg-red-100 text-red-800 border-red-300'
                : s === 'dibatalkan' ? 'bg-gray-100 text-gray-800 border-gray-300'
                : 'bg-orange-100 text-orange-800 border-orange-300';
            return <Badge variant="outline" className={cls}>{s}</Badge>;
        },
    },
];

export default function LaporanIndex({
    skpi, filter, ringkasan, pengajuan,
}: {
    skpi: Skpi[];
    filter: { tahun: string; bulan: string | null };
    ringkasan: Ringkasan;
    pengajuan: PengajuanRow[];
}) {
    const [tahun, setTahun] = useState(String(filter.tahun));
    const [bulan, setBulan] = useState(filter.bulan ?? '');

    function terapkan() {
        router.get(window.location.pathname, { tahun, bulan: bulan || undefined }, { preserveState: true, replace: true });
    }

    return (
        <>
            <Head title="Cetak Laporan" />

            <div className="space-y-6 px-4 py-6 print:space-y-4 print:px-0 print:py-0">
                <div className="flex items-center justify-between print:hidden">
                    <h1 className="text-xl font-semibold">Cetak Laporan</h1>
                    <Button onClick={() => window.print()}>
                        <Printer className="mr-2 h-4 w-4" /> Cetak
                    </Button>
                </div>

                <div className="flex gap-4 print:hidden">
                    <Select value={tahun} onValueChange={setTahun}>
                        <SelectTrigger className="w-32"><SelectValue placeholder="Tahun" /></SelectTrigger>
                        <SelectContent>
                            {tahunOptions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={bulan} onValueChange={setBulan}>
                        <SelectTrigger className="w-40"><SelectValue placeholder="Semua Bulan" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">Semua Bulan</SelectItem>
                            {bulanOptions.map((b) => <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={terapkan}>Terapkan</Button>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-5 print:grid-cols-5">
                    {([
                        ['Total Mahasiswa', ringkasan.total_mahasiswa],
                        ['Total Aktivitas', ringkasan.total_aktivitas],
                        ['Aktivitas Disetujui', ringkasan.total_disetujui],
                        ['Pengajuan SKPI', ringkasan.total_pengajuan_skpi],
                        ['SKPI Diterbitkan', ringkasan.total_diterbitkan],
                        ['SKPI Diambil', ringkasan.total_diambil],
                    ] as [string, number][]).map(([label, nilai]) => (
                        <Card key={label}>
                            <CardHeader className="pb-1">
                                <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">{nilai}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="print:mt-4">
                    <h2 className="mb-3 font-semibold">
                        Daftar SKPI Diterbitkan — Tahun {tahun}
                        {bulan ? ` / ${bulanOptions.find((b) => b.value === bulan)?.label}` : ''}
                    </h2>
                    <div className="print:hidden">
                        <DataTable columns={columns} data={skpi} searchKey="mahasiswa" searchPlaceholder="Cari mahasiswa..." />
                    </div>
                </div>

                <div className="print:mt-4">
                    <h2 className="mb-3 font-semibold">Daftar Pengajuan SKPI</h2>
                    <p className="mb-2 text-sm text-muted-foreground">Menampilkan semua pengajuan SKPI yang masuk.</p>
                    <div className="print:hidden">
                        <DataTable columns={pengajuanColumns} data={pengajuan} searchKey="mahasiswa" searchPlaceholder="Cari mahasiswa..." />
                    </div>
                </div>
            </div>
        </>
    );
}

LaporanIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '#' },
        { title: 'Laporan', href: '#' },
    ],
};
