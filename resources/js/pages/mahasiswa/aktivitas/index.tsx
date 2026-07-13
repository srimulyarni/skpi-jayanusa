import { Head, Link, router } from '@inertiajs/react';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Kategori = { id: number; nama_kategori: string; tipe: string };

type Aktivitas = {
    id: number;
    nama_kegiatan: string;
    tahun_kegiatan: string;
    peran: string;
    bukti_link: string | null;
    juara: string | null;
    tingkat: string | null;
    status: string;
    catatan_validator: string | null;
    kategori: Kategori;
};

const statusColors: Record<string, string> = {
    menunggu: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    disetujui: 'bg-green-100 text-green-800 border-green-300',
    ditolak: 'bg-red-100 text-red-800 border-red-300',
};

export default function AktivitasIndex({ aktivitas }: { aktivitas: Aktivitas[] }) {
    const [openDelete, setOpenDelete] = useState(false);
    const [selected, setSelected] = useState<Aktivitas | null>(null);

    function handleDelete() {
        if (!selected) {
return;
}
        router.delete(`/mahasiswa/aktivitas/${selected.id}`, {
            onSuccess: () => {
                setOpenDelete(false);
                toast.success('Aktivitas berhasil dihapus.');
            },
            onError: () => setOpenDelete(false),
        });
    }

    return (
        <>
            <Head title="Aktivitas Saya" />
            <div className="space-y-4 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Aktivitas Saya</h1>
                    <Button asChild>
                        <Link href="/mahasiswa/aktivitas/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Aktivitas
                        </Link>
                    </Button>
                </div>

                {aktivitas.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <p className="text-muted-foreground">Anda belum memiliki aktivitas.</p>
                            <Button className="mt-4" asChild>
                                <Link href="/mahasiswa/aktivitas/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Aktivitas
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="overflow-hidden rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">No</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead>Nama Kegiatan</TableHead>
                                    <TableHead>Tahun</TableHead>
                                    <TableHead>Peran</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-28">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {aktivitas.map((a, i) => (
                                    <TableRow key={a.id}>
                                        <TableCell>{i + 1}</TableCell>
                                        <TableCell>
                                            <span>{a.kategori.nama_kategori}</span>
                                            {a.kategori.tipe === 'lomba' && (
                                                <Badge variant="outline" className="ml-1 text-[10px]">Lomba</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{a.nama_kegiatan}</TableCell>
                                        <TableCell>{a.tahun_kegiatan}</TableCell>
                                        <TableCell>{a.peran}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={statusColors[a.status] ?? ''}>
                                                {a.status}
                                            </Badge>
                                            {a.catatan_validator && (
                                                <p className="mt-1 text-xs text-destructive">{a.catatan_validator}</p>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <Button size="icon" variant="ghost" asChild>
                                                    <Link href={`/mahasiswa/aktivitas/${a.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                {a.status !== 'disetujui' && (
                                                    <>
                                                        <Button size="icon" variant="ghost" asChild>
                                                            <Link href={`/mahasiswa/aktivitas/${a.id}/edit`}>
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button size="icon" variant="ghost" onClick={() => { setSelected(a); setOpenDelete(true); }}>
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Aktivitas?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Aktivitas "{selected?.nama_kegiatan}" akan dihapus permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

AktivitasIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/mahasiswa/dashboard' },
        { title: 'Aktivitas Saya', href: '/mahasiswa/aktivitas' },
    ],
};
