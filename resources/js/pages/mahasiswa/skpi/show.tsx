import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
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

type Kategori = { nama_kategori: string; tipe: string };
type Aktivitas = { id: number; nama_kegiatan: string; tahun_kegiatan: string; peran: string; juara: string | null; tingkat: string | null; kategori: Kategori };
type Pengajuan = {
    id: number; no_registrasi: string | null; tgl_pengajuan: string | null;
    tgl_proses: string | null;
    status: string; catatan_validator: string | null;
    aktivitas: Aktivitas[]; periode_skpi: { nama: string };
};

const statusColors: Record<string, string> = {
    menunggu: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    disetujui: 'bg-green-100 text-green-800 border-green-300',
    revisi: 'bg-orange-100 text-orange-800 border-orange-300',
    ditolak: 'bg-red-100 text-red-800 border-red-300',
    dibatalkan: 'bg-gray-100 text-gray-800 border-gray-300',
};

export default function SkpiShow({ pengajuan }: { pengajuan: Pengajuan }) {
    const [openBatalkan, setOpenBatalkan] = useState(false);

    function handleBatalkan() {
        router.patch(`/mahasiswa/skpi/${pengajuan.id}/batalkan`, {}, {
            onSuccess: () => {
                setOpenBatalkan(false);
                toast.success('Pengajuan dibatalkan.');
            },
            onError: () => setOpenBatalkan(false),
        });
    }

    return (
        <>
            <Head title={`SKPI ${pengajuan.no_registrasi ?? 'Draft'}`} />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/mahasiswa/skpi"><ArrowLeft className="h-4 w-4" /></Link>
                        </Button>
                        <div>
                            <h1 className="text-xl font-semibold">Detail Pengajuan SKPI</h1>
                            <p className="text-sm text-muted-foreground">{pengajuan.no_registrasi ?? '-'}</p>
                        </div>
                    </div>
                    <Badge variant="outline" className={statusColors[pengajuan.status] ?? ''}>{pengajuan.status}</Badge>
                </div>

                <Card>
                    <CardHeader><CardTitle className="text-base">Informasi Pengajuan</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-muted-foreground">No. Registrasi</span><span className="font-mono">{pengajuan.no_registrasi ?? '-'}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Tanggal</span><span>{pengajuan.tgl_pengajuan ? new Date(pengajuan.tgl_pengajuan).toLocaleDateString('id-ID', { dateStyle: 'long' }) : '-'}</span></div>
                        {pengajuan.tgl_proses && (
                            <div className="flex justify-between"><span className="text-muted-foreground">Tanggal Proses</span><span>{new Date(pengajuan.tgl_proses).toLocaleDateString('id-ID', { dateStyle: 'long' })}</span></div>
                        )}
                        <div className="flex justify-between"><span className="text-muted-foreground">Periode</span><span>{pengajuan.periode_skpi.nama}</span></div>
                    </CardContent>
                </Card>

                {pengajuan.catatan_validator && (
                    <Card className="border-destructive">
                        <CardHeader><CardTitle className="text-base text-destructive">Catatan Validator</CardTitle></CardHeader>
                        <CardContent><p className="text-sm">{pengajuan.catatan_validator}</p></CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader><CardTitle className="text-base">Aktivitas yang Dipilih ({pengajuan.aktivitas.length})</CardTitle></CardHeader>
                    <CardContent>
                        <div className="overflow-hidden rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">No</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>Nama Kegiatan</TableHead>
                                        <TableHead>Tahun</TableHead>
                                        <TableHead>Peran</TableHead>
                                        <TableHead>Juara</TableHead>
                                        <TableHead>Tingkat</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pengajuan.aktivitas.map((a, i) => (
                                        <TableRow key={a.id}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>{a.kategori.nama_kategori} {a.kategori.tipe === 'lomba' && <Badge variant="outline" className="ml-1 text-[10px]">Lomba</Badge>}</TableCell>
                                            <TableCell className="font-medium">{a.nama_kegiatan}</TableCell>
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
            </div>

            {pengajuan.status === 'menunggu' && (
                <div className="px-4 pb-6 md:px-6">
                    <Button variant="destructive" onClick={() => setOpenBatalkan(true)}>Batalkan Pengajuan</Button>
                </div>
            )}

            <AlertDialog open={openBatalkan} onOpenChange={setOpenBatalkan}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Batalkan Pengajuan?</AlertDialogTitle>
                        <AlertDialogDescription>Pengajuan ini akan dibatalkan. Anda dapat membuat pengajuan baru nanti.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Tidak</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBatalkan}>Ya, Batalkan</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

SkpiShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/mahasiswa/dashboard' },
        { title: 'Pengajuan SKPI', href: '/mahasiswa/skpi' },
        { title: 'Detail', href: '#' },
    ],
};
