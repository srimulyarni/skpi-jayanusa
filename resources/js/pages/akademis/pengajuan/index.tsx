import { Head, Link, router } from '@inertiajs/react';
import { Eye, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { DataTablePagination } from '@/components/data-table-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Jurusan = { id: number; kode: string; nama: string; singkatan: string };
type Pengajuan = {
    id: number;
    no_registrasi: string;
    tgl_pengajuan: string;
    status: string;
    mahasiswa: { nobp: string; nama: string; jurusan: { nama: string } | null };
};

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}
interface PaginatedData {
    data: Pengajuan[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    menunggu: 'outline',
    diproses: 'secondary',
    disetujui: 'default',
    revisi: 'secondary',
    ditolak: 'destructive',
};

const statusOptions = [
    { value: 'menunggu', label: 'Menunggu' },
    { value: 'diproses', label: 'Diproses' },
    { value: 'disetujui', label: 'Disetujui' },
    { value: 'revisi', label: 'Revisi' },
    { value: 'ditolak', label: 'Ditolak' },
];

export default function PengajuanIndex({
    pengajuan,
    jurusan,
    filters,
}: {
    pengajuan: PaginatedData;
    jurusan: Jurusan[];
    filters: { search?: string; status?: string; jurusan_id?: string; tgl_dari?: string; tgl_sampai?: string };
}) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [localStatus, setLocalStatus] = useState(filters.status ?? '__all__');
    const [localJurusan, setLocalJurusan] = useState(filters.jurusan_id ?? '__all__');
    const [localTglDari, setLocalTglDari] = useState(filters.tgl_dari ?? '');
    const [localTglSampai, setLocalTglSampai] = useState(filters.tgl_sampai ?? '');
    const isInitialMount = useRef(true);

    const apply = () => {
        const params: Record<string, string | undefined> = {
            search: search || undefined,
            status: localStatus === '__all__' ? undefined : localStatus,
            jurusan_id: localJurusan === '__all__' ? undefined : localJurusan,
            tgl_dari: localTglDari || undefined,
            tgl_sampai: localTglSampai || undefined,
        };
        Object.keys(params).forEach((k) => {
            if (!params[k]) delete params[k];
        });
        router.get('/akademis/pengajuan', params, { preserveState: true, preserveScroll: true, replace: true });
    };

    const reset = () => {
        setSearch('');
        setLocalStatus('__all__');
        setLocalJurusan('__all__');
        setLocalTglDari('');
        setLocalTglSampai('');
        router.get('/akademis/pengajuan', {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    const debouncedSearch = useDebouncedCallback((value: string) => {
        const params: Record<string, string | undefined> = {
            search: value || undefined,
            status: localStatus === '__all__' ? undefined : localStatus,
            jurusan_id: localJurusan === '__all__' ? undefined : localJurusan,
            tgl_dari: localTglDari || undefined,
            tgl_sampai: localTglSampai || undefined,
        };
        Object.keys(params).forEach((k) => {
            if (!params[k]) delete params[k];
        });
        router.get('/akademis/pengajuan', params, { preserveState: true, preserveScroll: true, replace: true });
    }, 500);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;

            return;
        }
        debouncedSearch(search);
    }, [search, debouncedSearch]);

    const hasActiveFilter = filters.status || filters.jurusan_id || filters.tgl_dari || filters.tgl_sampai;

    return (
        <>
            <Head title="Kelola Pengajuan" />
            <div className="space-y-4 p-4 md:p-6">
                <h1 className="text-xl font-semibold">Kelola Pengajuan SKPI</h1>

                <div className="flex flex-wrap items-end gap-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground">Cari</label>
                        <Input
                            placeholder="Nama / NOBP..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-48"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground">Status</label>
                        <Select value={localStatus} onValueChange={setLocalStatus}>
                            <SelectTrigger className="w-36">
                                <SelectValue placeholder="Semua" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="__all__">Semua Status</SelectItem>
                                {statusOptions.map((s) => (
                                    <SelectItem key={s.value} value={s.value}>
                                        {s.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground">Jurusan</label>
                        <Select value={localJurusan} onValueChange={setLocalJurusan}>
                            <SelectTrigger className="w-44">
                                <SelectValue placeholder="Semua" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="__all__">Semua Jurusan</SelectItem>
                                {jurusan.map((j) => (
                                    <SelectItem key={j.id} value={String(j.id)}>
                                        {j.singkatan} — {j.nama}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground">Dari</label>
                        <Input type="date" value={localTglDari} onChange={(e) => setLocalTglDari(e.target.value)} className="w-36" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground">Sampai</label>
                        <Input type="date" value={localTglSampai} onChange={(e) => setLocalTglSampai(e.target.value)} className="w-36" />
                    </div>

                    <Button onClick={apply} size="sm">
                        <Search className="mr-1 h-4 w-4" />
                        Terapkan
                    </Button>

                    {hasActiveFilter && (
                        <Button variant="ghost" size="sm" onClick={reset}>
                            Reset
                        </Button>
                    )}
                </div>

                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">No</TableHead>
                                <TableHead>No. Registrasi</TableHead>
                                <TableHead>Mahasiswa</TableHead>
                                <TableHead>Jurusan</TableHead>
                                <TableHead>Tgl Pengajuan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-16">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pengajuan.data.length ? (
                                pengajuan.data.map((p, i) => (
                                    <TableRow key={p.id}>
                                        <TableCell>{(pengajuan.current_page - 1) * pengajuan.per_page + i + 1}</TableCell>
                                        <TableCell className="font-mono text-sm">{p.no_registrasi}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{p.mahasiswa.nama}</div>
                                            <div className="text-xs text-muted-foreground">{p.mahasiswa.nobp}</div>
                                        </TableCell>
                                        <TableCell>{p.mahasiswa.jurusan?.nama ?? '-'}</TableCell>
                                        <TableCell>{new Date(p.tgl_pengajuan).toLocaleDateString('id-ID')}</TableCell>
                                        <TableCell>
                                            <Badge variant={statusVariant[p.status] ?? 'outline'}>{p.status}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button size="icon" variant="ghost" asChild>
                                                <Link href={`/akademis/pengajuan/${p.id}`}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                                        Tidak ada data
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <DataTablePagination data={pengajuan} />
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
