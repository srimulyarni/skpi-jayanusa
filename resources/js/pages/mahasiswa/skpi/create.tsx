import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTour } from '@/hooks/use-tour';

type Kategori = { nama_kategori: string; tipe: string };
type Aktivitas = {
    id: number; nama_kegiatan: string; tahun_kegiatan: string; peran: string;
    juara: string | null; tingkat: string | null;
    kategori: Kategori;
};
type Periode = { id: number; nama: string; tgl_mulai: string; tgl_selesai: string };

export default function SkpiCreate({ aktivitas, periode, maxAktivitas }: { aktivitas: Aktivitas[]; periode: Periode; maxAktivitas: number | null }) {
    const [selected, setSelected] = useState<number[]>([]);
    const [openKonfirm, setOpenKonfirm] = useState(false);
    const [processing, setProcessing] = useState(false);

    useTour({
        tourKey: 'has_seen_mahasiswa_skpi_create_tour',
        steps: [
            { element: '[data-tour="skpi-create-info"]', popover: { title: 'Buat Pengajuan', description: 'Pilih aktivitas yang sudah disetujui untuk diajukan ke SKPI.', side: 'bottom', align: 'start' } },
            { element: '[data-tour="skpi-create-table"]', popover: { title: 'Pilih Aktivitas', description: 'Centang aktivitas yang ingin Anda masukkan ke dalam SKPI.', side: 'top', align: 'start' } },
            { element: '[data-tour="skpi-create-ajukan"]', popover: { title: 'Ajukan', description: 'Klik tombol ini setelah memilih aktivitas untuk mengajukan SKPI.', side: 'top', align: 'start' } },
        ],
    });

    function toggle(id: number) {
        setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
    }

    function toggleAll() {
        if (selected.length === aktivitas.length) {
            setSelected([]);
        } else {
            setSelected(aktivitas.map((a) => a.id));
        }
    }

    function handleSubmit() {
        setProcessing(true);
        router.post('/mahasiswa/skpi', { aktivitas_ids: selected }, {
            onSuccess: () => {
                setOpenKonfirm(false);
                toast.success('Pengajuan SKPI berhasil diajukan!');
            },
            onError: (errors) => {
                if (errors.error) {
                    toast.error(errors.error);
                }

                setOpenKonfirm(false);
            },
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <>
            <Head title="Buat Pengajuan SKPI" />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex items-center gap-3" data-tour="skpi-create-info">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/mahasiswa/skpi"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-semibold">Buat Pengajuan SKPI</h1>
                        <p className="text-sm text-muted-foreground">Periode: {periode.nama}</p>
                    </div>
                </div>

                {maxAktivitas != null && (
                    <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                        Maksimal {maxAktivitas} aktivitas untuk periode ini
                    </div>
                )}

                {aktivitas.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">Tidak ada aktivitas yang sudah disetujui. Ajukan aktivitas terlebih dahulu.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <Card data-tour="skpi-create-table">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Pilih Aktivitas yang Akan Ditampilkan di SKPI
                                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                                        ({selected.length} dipilih)
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-hidden rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-12">
                                                    <button onClick={toggleAll} className="h-4 w-4 rounded border" title="Pilih semua">
                                                        {selected.length === aktivitas.length && aktivitas.length > 0 && <Check className="h-3 w-3" />}
                                                    </button>
                                                </TableHead>
                                                <TableHead>Kategori</TableHead>
                                                <TableHead>Nama Kegiatan</TableHead>
                                                <TableHead>Tahun</TableHead>
                                                <TableHead>Peran</TableHead>
                                                <TableHead>Juara</TableHead>
                                                <TableHead>Tingkat</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {aktivitas.map((a) => (
                                                <TableRow key={a.id} className={selected.includes(a.id) ? 'bg-primary/5' : ''}>
                                                    <TableCell>
                                                        <button onClick={() => toggle(a.id)} className="flex h-4 w-4 items-center justify-center rounded border">
                                                            {selected.includes(a.id) && <Check className="h-3 w-3" />}
                                                        </button>
                                                    </TableCell>
                                                    <TableCell>
                                                        {a.kategori.nama_kategori}
                                                        {a.kategori.tipe === 'lomba' && <Badge variant="outline" className="ml-1 text-[10px]">Lomba</Badge>}
                                                    </TableCell>
                                                    <TableCell className="max-w-[200px] truncate font-medium">{a.nama_kegiatan}</TableCell>
                                                    <TableCell>{a.tahun_kegiatan}</TableCell>
                                                    <TableCell>{a.peran}</TableCell>
                                                    <TableCell>{a.juara ?? '-'}</TableCell>
                                                    <TableCell>{a.tingkat ? a.tingkat.charAt(0).toUpperCase() + a.tingkat.slice(1) : '-'}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex gap-3" data-tour="skpi-create-ajukan">
                            <Button onClick={() => setOpenKonfirm(true)} disabled={selected.length === 0 || processing || (maxAktivitas != null && selected.length > maxAktivitas)}>
                                Ajukan SKPI ({selected.length} aktivitas)
                            </Button>
                            <Button variant="outline" asChild><Link href="/mahasiswa/skpi">Batal</Link></Button>
                            {maxAktivitas != null && selected.length > maxAktivitas && (
                                <p className="text-sm text-destructive">Jumlah aktivitas melebihi batas maksimal ({maxAktivitas})</p>
                            )}
                        </div>
                    </>
                )}
            </div>

            <AlertDialog open={openKonfirm} onOpenChange={setOpenKonfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ajukan Pengajuan SKPI?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {selected.length} aktivitas akan diajukan ke validator untuk dicetak di SKPI. Pastikan pilihan sudah benar.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmit} disabled={processing}>Ajukan</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

SkpiCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/mahasiswa/dashboard' },
        { title: 'Pengajuan SKPI', href: '/mahasiswa/skpi' },
        { title: 'Buat', href: '/mahasiswa/skpi/create' },
    ],
};
