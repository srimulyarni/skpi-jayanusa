import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Check, ExternalLink, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Mahasiswa = { id: number; nama: string; nobp: string; jurusan: { nama: string } | null };
type Kategori = { nama_kategori: string; tipe: string };
type Aktivitas = {
    id: number; nama_kegiatan: string; tahun_kegiatan: string; peran: string;
    bukti_link: string | null; juara: string | null; tingkat: string | null;
    status: string; catatan_validator: string | null;
    mahasiswa: Mahasiswa; kategori: Kategori;
};

const statusColors: Record<string, string> = {
    menunggu: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    disetujui: 'bg-green-100 text-green-800 border-green-300',
    ditolak: 'bg-red-100 text-red-800 border-red-300',
};

export default function ValidasiAktivitasShow({ aktivitas }: { aktivitas: Aktivitas }) {
    const [openReject, setOpenReject] = useState(false);
    const [catatan, setCatatan] = useState('');

    function handleApprove() {
        router.patch(`/validator/validasi-aktivitas/${aktivitas.id}/approve`, {}, {
            onSuccess: () => toast.success('Aktivitas disetujui.'),
        });
    }

    function handleReject() {
        if (!catatan.trim()) {
            toast.error('Catatan wajib diisi untuk menolak.');

            return;
        }

        router.patch(`/validator/validasi-aktivitas/${aktivitas.id}/reject`, { catatan_validator: catatan }, {
            onSuccess: () => {
                setOpenReject(false);
                toast.success('Aktivitas ditolak.');
            },
        });
    }

    return (
        <>
            <Head title={`Validasi: ${aktivitas.nama_kegiatan}`} />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/validator/validasi-aktivitas"><ArrowLeft className="h-4 w-4" /></Link>
                        </Button>
                        <h1 className="text-xl font-semibold">Detail Aktivitas</h1>
                    </div>
                    <Badge variant="outline" className={statusColors[aktivitas.status] ?? ''}>{aktivitas.status}</Badge>
                </div>

                <Card>
                    <CardHeader><CardTitle className="text-base">Data Mahasiswa</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-muted-foreground">Nama</span><span className="font-medium">{aktivitas.mahasiswa.nama}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">NOBP</span><span>{aktivitas.mahasiswa.nobp}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Jurusan</span><span>{aktivitas.mahasiswa.jurusan?.nama ?? '-'}</span></div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle className="text-base">Data Aktivitas</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Kategori</span>
                            <span>{aktivitas.kategori.nama_kategori} {aktivitas.kategori.tipe === 'lomba' && <Badge variant="outline" className="ml-1 text-[10px]">Lomba</Badge>}</span>
                        </div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Nama Kegiatan</span><span className="font-medium">{aktivitas.nama_kegiatan}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Tahun</span><span>{aktivitas.tahun_kegiatan}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Peran</span><span>{aktivitas.peran}</span></div>
                        {aktivitas.juara && <div className="flex justify-between"><span className="text-muted-foreground">Juara</span><span>{aktivitas.juara}</span></div>}
                        {aktivitas.tingkat && <div className="flex justify-between"><span className="text-muted-foreground">Tingkat</span><span className="capitalize">{aktivitas.tingkat}</span></div>}
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Bukti</span>
                            {aktivitas.bukti_link ? (
                                <a href={aktivitas.bukti_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary underline">
                                    <ExternalLink className="h-3 w-3" /> Link Google Drive
                                </a>
                            ) : <span className="text-muted-foreground">-</span>}
                        </div>
                    </CardContent>
                </Card>

                {aktivitas.catatan_validator && (
                    <Card className="border-destructive">
                        <CardHeader><CardTitle className="text-base text-destructive">Catatan Validator</CardTitle></CardHeader>
                        <CardContent><p className="text-sm">{aktivitas.catatan_validator}</p></CardContent>
                    </Card>
                )}

                {aktivitas.status === 'menunggu' && (
                    <div className="flex gap-3">
                        <Button onClick={handleApprove}>
                            <Check className="mr-2 h-4 w-4" /> Setujui
                        </Button>
                        <Button variant="destructive" onClick={() => setOpenReject(true)}>
                            <X className="mr-2 h-4 w-4" /> Tolak
                        </Button>
                    </div>
                )}
            </div>

            <AlertDialog open={openReject} onOpenChange={setOpenReject}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tolak Aktivitas?</AlertDialogTitle>
                        <AlertDialogDescription>Berikan alasan penolakan agar mahasiswa dapat memperbaiki.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-2">
                        <Label htmlFor="catatan">Catatan Penolakan</Label>
                        <Textarea id="catatan" value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="Alasan penolakan..." className="mt-1" />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleReject}>Tolak</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

ValidasiAktivitasShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/validator/dashboard' },
        { title: 'Validasi Aktivitas', href: '/validator/validasi-aktivitas' },
        { title: 'Detail', href: '#' },
    ],
};
