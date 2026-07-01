import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';
import { DataTablePagination } from '@/components/data-table-pagination';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Jurusan = { id: number; nama: string; singkatan: string };
type Mahasiswa = {
    id: number;
    nobp: string;
    nama: string;
    foto: string | null;
    jk: string | null;
    tahun_lulus: string | null;
    jurusan: Jurusan | null;
    pengajuan_count: number;
    pengambilan_count: number;
};

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedData {
    data: Mahasiswa[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

const jkLabel: Record<string, string> = { L: 'Laki-laki', P: 'Perempuan' };

type JurusanOption = { id: number; kode: string; nama: string; singkatan: string };

export default function MahasiswaIndex({
    mahasiswa, jurusan, tahunList, filters,
}: {
    mahasiswa: PaginatedData;
    jurusan: JurusanOption[];
    tahunList: string[];
    filters: { search?: string; jurusan_id?: string; tahun_lulus?: string };
}) {
    const [openHapus, setOpenHapus] = useState(false);
    const [selected, setSelected] = useState<Mahasiswa | null>(null);
    const [search, setSearch] = useState(filters.search ?? '');
    const isInitialMount = useRef(true);

    const applyFilters = (overrides: Record<string, string | undefined>) => {
        const params: Record<string, string | undefined> = {
            search: filters.search || undefined,
            jurusan_id: filters.jurusan_id,
            tahun_lulus: filters.tahun_lulus,
            ...overrides,
        };
        Object.keys(params).forEach((k) => {
            if (!params[k] || params[k] === '__all__') {
delete params[k];
}
        });
        router.get('/akademis/mahasiswa', params, { preserveState: true, preserveScroll: true, replace: true });
    };

    const debouncedSearch = useDebouncedCallback((value: string) => {
        applyFilters({ search: value || undefined });
    }, 500);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;

            return;
        }

        debouncedSearch(search);
    }, [search, debouncedSearch]);

    function hapus() {
        if (!selected) {
return;
}

        router.delete(`/akademis/mahasiswa/${selected.id}`, {
            onSuccess: () => {
 setOpenHapus(false); toast.success('Berhasil!'); 
},
        });
    }

    return (
        <>
            <Head title="Data Mahasiswa" />

            <div className="space-y-4 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Data Mahasiswa</h1>
                </div>

                <Input
                    placeholder="Cari mahasiswa..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />

                <div className="flex flex-wrap gap-3">
                    <Select value={filters.jurusan_id ?? '__all__'} onValueChange={(v) => applyFilters({ jurusan_id: v === '__all__' ? undefined : v })}>
                        <SelectTrigger className="w-48"><SelectValue placeholder="Semua Jurusan" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="__all__">Semua Jurusan</SelectItem>
                            {jurusan.map((j) => (
                                <SelectItem key={j.id} value={String(j.id)}>{j.singkatan} — {j.nama}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filters.tahun_lulus ?? '__all__'} onValueChange={(v) => applyFilters({ tahun_lulus: v === '__all__' ? undefined : v })}>
                        <SelectTrigger className="w-40"><SelectValue placeholder="Semua Tahun" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="__all__">Semua Tahun</SelectItem>
                            {tahunList.map((t) => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {(filters.jurusan_id || filters.tahun_lulus) && (
                        <Button variant="ghost" size="sm" onClick={() => applyFilters({ jurusan_id: undefined, tahun_lulus: undefined })}>
                            Reset Filter
                        </Button>
                    )}
                </div>

                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">No</TableHead>
                                <TableHead className="w-14">Foto</TableHead>
                                <TableHead>NOBP</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Jurusan</TableHead>
                                <TableHead>Jenis Kelamin</TableHead>
                                <TableHead>Lulus</TableHead>
                                <TableHead className="w-24">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mahasiswa.data.length ? mahasiswa.data.map((m, i) => (
                                <TableRow key={m.id}>
                                    <TableCell>{(mahasiswa.current_page - 1) * mahasiswa.per_page + i + 1}</TableCell>
                                    <TableCell>
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={m.foto ? `/storage/${m.foto}` : undefined} alt={m.nama} />
                                            <AvatarFallback className="text-xs">{m.nama.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-mono">{m.nobp}</TableCell>
                                    <TableCell>{m.nama}</TableCell>
                                    <TableCell>{m.jurusan ? `${m.jurusan.singkatan} — ${m.jurusan.nama}` : '-'}</TableCell>
                                    <TableCell>{m.jk ? jkLabel[m.jk] : '-'}</TableCell>
                                    <TableCell>{m.tahun_lulus ?? '-'}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="icon" variant="ghost" asChild>
                                                <Link href={`/akademis/mahasiswa/${m.id}/edit`}><Pencil className="h-4 w-4" /></Link>
                                            </Button>
                                            <Button
                                                size="icon" variant="ghost"
                                                disabled={m.pengajuan_count > 0}
                                                onClick={() => {
 setSelected(m); setOpenHapus(true); 
}}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground">Tidak ada data</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <DataTablePagination data={mahasiswa} />
            </div>

            <AlertDialog open={openHapus} onOpenChange={setOpenHapus}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Mahasiswa <strong>{selected?.nama}</strong> ({selected?.nobp}) dan akun login-nya akan dihapus permanen.
                            {selected && selected.pengajuan_count > 0 && (
                                <span className="mt-2 block text-destructive">
                                    Mahasiswa ini tidak bisa dihapus karena masih memiliki data pengajuan.
                                </span>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={hapus} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
