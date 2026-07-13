import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Search, Trash2 } from 'lucide-react';
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
    tahun_masuk: string | null;
    jurusan: Jurusan | null;
    aktivitas_count: number;
    pengajuan_skpi_count: number;
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
    mahasiswa, jurusan, filters,
}: {
    mahasiswa: PaginatedData;
    jurusan: JurusanOption[];
    filters: { search?: string; jurusan_id?: string; tahun_masuk?: string };
}) {
    const [openHapus, setOpenHapus] = useState(false);
    const [selected, setSelected] = useState<Mahasiswa | null>(null);
    const [search, setSearch] = useState(filters.search ?? '');
    const [localJurusan, setLocalJurusan] = useState(filters.jurusan_id ?? '__all__');
    const [localTahun, setLocalTahun] = useState(filters.tahun_masuk ?? '__all__');
    const isInitialMount = useRef(true);

    const apply = () => {
        const params: Record<string, string | undefined> = {
            search: search || undefined,
            jurusan_id: localJurusan === '__all__' ? undefined : localJurusan,
            tahun_masuk: localTahun === '__all__' ? undefined : localTahun,
        };
        Object.keys(params).forEach((k) => {
            if (!params[k]) delete params[k];
        });
        router.get('/validator/mahasiswa', params, { preserveState: true, preserveScroll: true, replace: true });
    };

    const reset = () => {
        setSearch('');
        setLocalJurusan('__all__');
        setLocalTahun('__all__');
        router.get('/validator/mahasiswa', {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    const debouncedSearch = useDebouncedCallback((value: string) => {
        const params: Record<string, string | undefined> = {
            search: value || undefined,
            jurusan_id: localJurusan === '__all__' ? undefined : localJurusan,
            tahun_masuk: localTahun === '__all__' ? undefined : localTahun,
        };
        Object.keys(params).forEach((k) => {
            if (!params[k]) delete params[k];
        });
        router.get('/validator/mahasiswa', params, { preserveState: true, preserveScroll: true, replace: true });
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

        router.delete(`/validator/mahasiswa/${selected.id}`, {
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
                        <label className="text-xs text-muted-foreground">Jurusan</label>
                        <Select value={localJurusan} onValueChange={setLocalJurusan}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Semua" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="__all__">Semua Jurusan</SelectItem>
                                {jurusan.map((j) => (
                                    <SelectItem key={j.id} value={String(j.id)}>{j.singkatan} — {j.nama}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground">Tahun Masuk</label>
                        <Input
                            type="number"
                            placeholder="ex: 2026"
                            value={localTahun === '__all__' ? '' : localTahun}
                            onChange={(e) => setLocalTahun(e.target.value ? e.target.value.slice(0, 4) : '__all__')}
                            className="w-28"
                            min="2000"
                            max="2099"
                        />
                    </div>

                    <Button onClick={apply} size="sm">
                        <Search className="mr-1 h-4 w-4" />
                        Terapkan
                    </Button>

                    {(filters.jurusan_id || filters.tahun_masuk) && (
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
                                <TableHead className="w-14">Foto</TableHead>
                                <TableHead>NOBP</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Jurusan</TableHead>
                                <TableHead>Jenis Kelamin</TableHead>
                                <TableHead>Masuk</TableHead>
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
                                    <TableCell>{m.jurusan?.nama ?? '-'}</TableCell>
                                    <TableCell>{m.jk ? jkLabel[m.jk] : '-'}</TableCell>
                                    <TableCell>{m.tahun_masuk ?? '-'}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="icon" variant="ghost" asChild>
                                                <Link href={`/validator/mahasiswa/${m.id}/edit`}><Pencil className="h-4 w-4" /></Link>
                                            </Button>
                                            <Button
                                                size="icon" variant="ghost"
                                                disabled={m.aktivitas_count > 0 || m.pengajuan_skpi_count > 0}
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
                            {selected && (selected.aktivitas_count > 0 || selected.pengajuan_skpi_count > 0) && (
                                <span className="mt-2 block text-destructive">
                                    Mahasiswa ini tidak bisa dihapus karena masih memiliki data aktivitas atau pengajuan SKPI.
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
        { title: 'Dashboard', href: '/validator/dashboard' },
        { title: 'Data Mahasiswa', href: '/validator/mahasiswa' },
    ],
};
