import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Pengajuan = {
    id: number; no_registrasi: string; tgl_pengajuan: string;
    status: string; mahasiswa: { nobp: string; nama: string; jurusan: { singkatan: string } | null };
};

interface PaginationLink { url: string | null; label: string; active: boolean }
interface PaginatedData {
    data: Pengajuan[]; current_page: number; last_page: number;
    per_page: number; total: number; links: PaginationLink[];
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    menunggu: 'outline', diproses: 'secondary', disetujui: 'default',
    revisi: 'secondary', ditolak: 'destructive',
};

export default function PengajuanIndex({ pengajuan, filters }: { pengajuan: PaginatedData; filters: { search?: string } }) {
    const [search, setSearch] = useState(filters.search ?? '');

    const doSearch = useCallback((value: string) => {
        setSearch(value);
        router.get('/akademis/pengajuan', { search: value || undefined }, { preserveState: true, preserveScroll: true });
    }, []);

    return (
        <>
            <Head title="Kelola Pengajuan" />
            <div className="space-y-4 p-4 md:p-6">
                <h1 className="text-xl font-semibold">Kelola Pengajuan SKPI</h1>

                <Input placeholder="Cari mahasiswa..." value={search} onChange={(e) => doSearch(e.target.value)} className="max-w-sm" />

                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">No</TableHead>
                                <TableHead>No. Registrasi</TableHead>
                                <TableHead>Mahasiswa</TableHead>
                                <TableHead>Tgl Pengajuan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-16">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pengajuan.data.length ? pengajuan.data.map((p, i) => (
                                <TableRow key={p.id}>
                                    <TableCell>{(pengajuan.current_page - 1) * pengajuan.per_page + i + 1}</TableCell>
                                    <TableCell className="font-mono text-sm">{p.no_registrasi}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{p.mahasiswa.nama}</div>
                                        <div className="text-xs text-muted-foreground">{p.mahasiswa.nobp}</div>
                                    </TableCell>
                                    <TableCell>{new Date(p.tgl_pengajuan).toLocaleDateString('id-ID')}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant[p.status] ?? 'outline'}>{p.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button size="icon" variant="ghost" asChild>
                                            <Link href={`/akademis/pengajuan/${p.id}`}><Eye className="h-4 w-4" /></Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">Tidak ada data</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {pengajuan.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Menampilkan {((pengajuan.current_page - 1) * pengajuan.per_page) + 1} - {Math.min(pengajuan.current_page * pengajuan.per_page, pengajuan.total)} dari {pengajuan.total} data
                        </div>
                        <div className="flex gap-1">
                            {pengajuan.links.map((link, index) => {
                                if (link.label === '&laquo; Previous') {
return <Button key={index} variant="outline" size="sm" disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}><ChevronLeft className="h-4 w-4" /></Button>;
}

                                if (link.label === 'Next &raquo;') {
return <Button key={index} variant="outline" size="sm" disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}><ChevronRight className="h-4 w-4" /></Button>;
}

                                return <Button key={index} variant={link.active ? 'default' : 'outline'} size="sm" disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}>{link.label}</Button>;
                            })}
                        </div>
                    </div>
                )}
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
