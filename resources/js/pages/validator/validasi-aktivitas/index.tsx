import { Head, Link, router } from '@inertiajs/react';
import { Eye, ExternalLink, Search, X } from 'lucide-react';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTour } from '@/hooks/use-tour';

type Mahasiswa = { id: number; nama: string; nobp: string; jurusan: { nama: string } | null };
type Kategori = { nama_kategori: string; tipe: string };
type Aktivitas = {
    id: number; nama_kegiatan: string; tahun_kegiatan: string; peran: string;
    bukti_link: string | null; juara: string | null; tingkat: string | null;
    status: string; catatan_validator: string | null;
    mahasiswa: Mahasiswa; kategori: Kategori;
};
type Pagination<T> = { data: T[]; current_page: number; last_page: number; per_page: number; total: number };

const statusColors: Record<string, string> = {
    menunggu: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    disetujui: 'bg-green-100 text-green-800 border-green-300',
    ditolak: 'bg-red-100 text-red-800 border-red-300',
};

export default function ValidasiAktivitasIndex({ aktivitas, filters }: { aktivitas: Pagination<Aktivitas>; filters: { search: string | null; status: string | null } }) {
    const [search, setSearch] = useState(filters.search ?? '');

    useTour({
        tourKey: 'has_seen_validator_validasi_aktivitas_tour',
        steps: [
            { element: '[data-tour="validasi-search"]', popover: { title: 'Pencarian & Filter', description: 'Cari aktivitas berdasarkan nama/NOBP dan filter berdasarkan status.', side: 'bottom', align: 'start' } },
            { element: '[data-tour="validasi-table"]', popover: { title: 'Daftar Aktivitas', description: 'Tabel aktivitas mahasiswa yang perlu divalidasi. Klik ikon mata untuk detail.', side: 'top', align: 'start' } },
        ],
    });

    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.get('/validator/validasi-aktivitas', { search: value || undefined, status: filters.status || undefined }, { preserveState: true, preserveScroll: true, replace: true });
    }, 500);

    function handleSearchChange(value: string) {
        setSearch(value);
        debouncedSearch(value);
    }

    function handleStatusChange(value: string) {
        router.get('/validator/validasi-aktivitas', { search: search || undefined, status: value === 'all' ? undefined : value }, { preserveState: true, preserveScroll: true, replace: true });
    }

    function handlePageChange(page: number) {
        router.get('/validator/validasi-aktivitas', { page, search: search || undefined, status: filters.status || undefined }, { preserveState: true, preserveScroll: true, replace: true });
    }

    return (
        <>
            <Head title="Validasi Aktivitas" />
            <div className="space-y-4 p-4 md:p-6">
                <h1 className="text-xl font-semibold">Validasi Aktivitas</h1>

                <div className="flex flex-col gap-3 sm:flex-row" data-tour="validasi-search">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Cari nama/NOBP/nama kegiatan..." className="pl-9" value={search} onChange={(e) => handleSearchChange(e.target.value)} />
                        {search && <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => handleSearchChange('')}><X className="h-4 w-4" /></Button>}
                    </div>
                    <Select value={filters.status ?? 'all'} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Semua Status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="menunggu">Menunggu</SelectItem>
                            <SelectItem value="disetujui">Disetujui</SelectItem>
                            <SelectItem value="ditolak">Ditolak</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="overflow-hidden rounded-md border" data-tour="validasi-table">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">No</TableHead>
                                <TableHead>Mahasiswa</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead>Nama Kegiatan</TableHead>
                                <TableHead>Bukti</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-20">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {aktivitas.data.length === 0 ? (
                                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Tidak ada data.</TableCell></TableRow>
                            ) : aktivitas.data.map((a, i) => (
                                <TableRow key={a.id}>
                                    <TableCell>{(aktivitas.current_page - 1) * aktivitas.per_page + i + 1}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{a.mahasiswa.nama}</div>
                                        <div className="text-xs text-muted-foreground">{a.mahasiswa.nobp} · {a.mahasiswa.jurusan?.nama ?? '-'}</div>
                                    </TableCell>
                                    <TableCell>
                                        {a.kategori.nama_kategori}
                                        {a.kategori.tipe === 'lomba' && <Badge variant="outline" className="ml-1 text-[10px]">Lomba</Badge>}
                                    </TableCell>
                                    <TableCell className="max-w-[250px] truncate">{a.nama_kegiatan}</TableCell>
                                    <TableCell>
                                        {a.bukti_link ? (
                                            <a href={a.bukti_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary underline">
                                                <ExternalLink className="h-3 w-3" /> Drive
                                            </a>
                                        ) : <span className="text-xs text-muted-foreground">-</span>}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={statusColors[a.status] ?? ''}>{a.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button size="icon" variant="ghost" asChild>
                                            <Link href={`/validator/validasi-aktivitas/${a.id}`}><Eye className="h-4 w-4" /></Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {aktivitas.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Menampilkan {aktivitas.data.length} dari {aktivitas.total} data</p>
                        <div className="flex gap-1">
                            {Array.from({ length: aktivitas.last_page }, (_, i) => i + 1).map((page) => (
                                <Button key={page} variant={page === aktivitas.current_page ? 'default' : 'outline'} size="sm" onClick={() => handlePageChange(page)}>{page}</Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

ValidasiAktivitasIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/validator/dashboard' },
        { title: 'Validasi Aktivitas', href: '/validator/validasi-aktivitas' },
    ],
};
