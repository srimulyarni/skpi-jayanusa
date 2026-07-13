import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, ExternalLink, XCircle } from 'lucide-react';
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

type Kategori = { nama_kategori: string; tipe: string };
type Aktivitas = {
    id: number; nama_kegiatan: string; tahun_kegiatan: string; peran: string;
    bukti_link: string | null; juara: string | null; tingkat: string | null;
    status: string; kategori: Kategori;
};
type SkpiData = { id: number; no_skpi: string; tgl_terbit: string; status: string; pengambilan: { status: string; diambil_pada: string | null } | null };
type Pengajuan = {
    id: number; no_registrasi: string; tgl_pengajuan: string; tgl_proses: string | null; status: string;
    catatan_validator: string | null;
    mahasiswa: { nama: string; nobp: string; jurusan: { nama: string } | null };
    periode_skpi: { nama: string };
    aktivitas: Aktivitas[];
    skpi: SkpiData | null;
};

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
    menunggu: 'secondary', disetujui: 'default', ditolak: 'destructive', dibatalkan: 'destructive',
};

export default function SkpiShow({ pengajuan }: { pengajuan: Pengajuan }) {
    const [openReject, setOpenReject] = useState(false);
    const [catatan, setCatatan] = useState('');

    function approve() {
        router.patch(`/validator/skpi/${pengajuan.id}/approve`, {}, {
            onSuccess: () => toast.success('Pengajuan disetujui!'),
        });
    }

    function reject() {
        if (!catatan.trim()) return;
        router.patch(`/validator/skpi/${pengajuan.id}/reject`, { catatan_validator: catatan }, {
            onSuccess: () => { setOpenReject(false); toast.success('Pengajuan ditolak.'); },
        });
    }

    return (
        <>
            <Head title={`Detail: ${pengajuan.no_registrasi}`} />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/validator/skpi"><ArrowLeft className="h-4 w-4" /></Link>
                        </Button>
                        <div>
                            <h1 className="text-xl font-semibold">Detail Pengajuan SKPI</h1>
                            <p className="text-sm text-muted-foreground">{pengajuan.no_registrasi}</p>
                        </div>
                    </div>
                    <Badge variant={statusVariant[pengajuan.status] ?? 'secondary'} className="text-sm">{pengajuan.status}</Badge>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader><CardTitle className="text-base">Data Mahasiswa</CardTitle></CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-muted-foreground">Nama</span><span className="font-medium">{pengajuan.mahasiswa.nama}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">NOBP</span><span>{pengajuan.mahasiswa.nobp}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Jurusan</span><span>{pengajuan.mahasiswa.jurusan?.nama ?? '-'}</span></div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="text-base">Data Pengajuan</CardTitle></CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-muted-foreground">No. Registrasi</span><span className="font-mono">{pengajuan.no_registrasi}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Tanggal</span><span>{new Date(pengajuan.tgl_pengajuan).toLocaleDateString('id-ID')}</span></div>
                            {pengajuan.tgl_proses && (
                                <div className="flex justify-between"><span className="text-muted-foreground">Tanggal Proses</span><span>{new Date(pengajuan.tgl_proses).toLocaleDateString('id-ID')}</span></div>
                            )}
                            <div className="flex justify-between"><span className="text-muted-foreground">Periode</span><span>{pengajuan.periode_skpi.nama}</span></div>
                        </CardContent>
                    </Card>
                </div>

                {pengajuan.catatan_validator && (
                    <Card className="border-destructive">
                        <CardHeader><CardTitle className="text-base text-destructive">Catatan Validator</CardTitle></CardHeader>
                        <CardContent><p className="text-sm">{pengajuan.catatan_validator}</p></CardContent>
                    </Card>
                )}

                {pengajuan.skpi && (
                    <Card className="border-green-200">
                        <CardHeader><CardTitle className="text-base text-green-700">SKPI Diterbitkan</CardTitle></CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-muted-foreground">No. SKPI</span><span className="font-mono font-medium">{pengajuan.skpi.no_skpi}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Tgl Terbit</span><span>{new Date(pengajuan.skpi.tgl_terbit).toLocaleDateString('id-ID')}</span></div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Pengambilan</span>
                                <Badge variant={pengajuan.skpi.pengambilan?.status === 'sudah_diambil' ? 'default' : 'outline'}>
                                    {pengajuan.skpi.pengambilan?.status === 'sudah_diambil' ? 'Sudah Diambil' : 'Belum Diambil'}
                                </Badge>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <Button size="sm" variant="outline" asChild>
                                    <a href={`/validator/skpi/${pengajuan.skpi.id}/pdf`} target="_blank" rel="noopener noreferrer">Lihat PDF</a>
                                </Button>
                                <Button size="sm" variant="outline" asChild>
                                    <a href={`/validator/skpi/${pengajuan.skpi.id}/pdf/download`}>Download PDF</a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader><CardTitle className="text-base">Aktivitas yang Diajukan ({pengajuan.aktivitas.length})</CardTitle></CardHeader>
                    <CardContent>
                        {pengajuan.aktivitas.length ? (
                            <div className="overflow-hidden rounded-md border">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="p-2 text-left">No</th>
                                            <th className="p-2 text-left">Kategori</th>
                                            <th className="p-2 text-left">Kegiatan</th>
                                            <th className="p-2 text-left">Tahun</th>
                                            <th className="p-2 text-left">Peran</th>
                                            <th className="p-2 text-left">Juara</th>
                                            <th className="p-2 text-left">Tingkat</th>
                                            <th className="p-2 text-left">Status</th>
                                            <th className="p-2 text-left">Bukti</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pengajuan.aktivitas.map((a, i) => (
                                            <tr key={a.id} className="border-t">
                                                <td className="p-2">{i + 1}</td>
                                                <td className="p-2">
                                                    {a.kategori.nama_kategori}
                                                    {a.kategori.tipe === 'lomba' && <Badge variant="outline" className="ml-1 text-[10px]">Lomba</Badge>}
                                                </td>
                                                <td className="p-2 font-medium">{a.nama_kegiatan}</td>
                                                <td className="p-2">{a.tahun_kegiatan}</td>
                                                <td className="p-2">{a.peran}</td>
                                                <td className="p-2">{a.juara ?? '-'}</td>
                                                <td className="p-2 capitalize">{a.tingkat ?? '-'}</td>
                                                <td className="p-2">
                                                    <Badge variant={a.status === 'disetujui' ? 'default' : a.status === 'ditolak' ? 'destructive' : 'secondary'} className="text-[10px]">
                                                        {a.status}
                                                    </Badge>
                                                </td>
                                                <td className="p-2">
                                                    {a.bukti_link ? (
                                                        <a href={a.bukti_link} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                                                            <ExternalLink className="inline h-3 w-3" />
                                                        </a>
                                                    ) : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Tidak ada aktivitas</p>
                        )}
                    </CardContent>
                </Card>

                {pengajuan.status === 'menunggu' && (
                    <div className="flex gap-3">
                        <Button onClick={approve}>
                            <CheckCircle className="mr-2 h-4 w-4" /> Setujui Pengajuan
                        </Button>
                        <Button variant="destructive" onClick={() => setOpenReject(true)}>
                            <XCircle className="mr-2 h-4 w-4" /> Tolak Pengajuan
                        </Button>
                    </div>
                )}

                {pengajuan.status === 'disetujui' && !pengajuan.skpi && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                        Pengajuan sudah disetujui. Silakan terbitkan SKPI dari halaman <Link href="/validator/skpi" className="font-medium underline">Pengajuan SKPI</Link>.
                    </div>
                )}
            </div>

            <AlertDialog open={openReject} onOpenChange={setOpenReject}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tolak Pengajuan?</AlertDialogTitle>
                        <AlertDialogDescription>Berikan alasan penolakan agar mahasiswa dapat memperbaiki.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-2">
                        <Label htmlFor="catatan">Catatan Penolakan</Label>
                        <Textarea id="catatan" value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="Alasan penolakan..." className="mt-1" />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={reject} disabled={!catatan.trim()}>Tolak</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

SkpiShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/validator/dashboard' },
        { title: 'Pengajuan SKPI', href: '/validator/skpi' },
        { title: 'Detail', href: '#' },
    ],
};
