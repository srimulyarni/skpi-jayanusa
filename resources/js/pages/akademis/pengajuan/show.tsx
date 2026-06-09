import { Head, useForm } from '@inertiajs/react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type BuktiKegiatan = { id: number; nama_file: string; path_file: string };
type DetailPengajuan = {
    id: number; nama_kegiatan: string; tahun_kegiatan: string;
    peran: string; kategori: { nama_kategori: string };
    bukti_kegiatan: BuktiKegiatan[];
};
type Pengajuan = {
    id: number; no_registrasi: string; tgl_pengajuan: string;
    status: string; catatan_akademis: string | null;
    mahasiswa: {
        nobp: string; nama: string; jk: string | null; tahun_lulus: string | null;
        jurusan: { singkatan: string; nama: string; identitas_pt: { kode_institusi: string } };
    };
    detail_pengajuan: DetailPengajuan[];
};

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    menunggu: 'outline', diproses: 'secondary', disetujui: 'default',
    revisi: 'secondary', ditolak: 'destructive',
};

const statusList = ['menunggu', 'diproses', 'disetujui', 'revisi', 'ditolak'];

export default function PengajuanShow({ pengajuan }: { pengajuan: Pengajuan }) {
    const [openKonfirm, setOpenKonfirm] = useState(false);

    const form = useForm({
        status: pengajuan.status,
        catatan_akademis: pengajuan.catatan_akademis ?? '',
    });

    function simpan() {
        form.patch(`/akademis/pengajuan/${pengajuan.id}/status`, {
            onSuccess: () => {
 setOpenKonfirm(false); toast.success('Berhasil!'); 
},
        });
    }

    return (
        <>
            <Head title={`Pengajuan ${pengajuan.no_registrasi}`} />

            <div className="space-y-6 px-4 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">{pengajuan.no_registrasi}</h1>
                        <p className="text-sm text-muted-foreground">
                            {new Date(pengajuan.tgl_pengajuan).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                        </p>
                    </div>
                    <Badge variant={statusVariant[pengajuan.status] ?? 'outline'}>
                        {pengajuan.status}
                    </Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Data Mahasiswa</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">NOBP</span>
                                <span className="font-mono">{pengajuan.mahasiswa.nobp}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Nama</span>
                                <span>{pengajuan.mahasiswa.nama}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Jurusan</span>
                                <span>{pengajuan.mahasiswa.jurusan?.singkatan}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Institusi</span>
                                <span>{pengajuan.mahasiswa.jurusan?.identitas_pt?.kode_institusi}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tahun Lulus</span>
                                <span>{pengajuan.mahasiswa.tahun_lulus ?? '-'}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Update Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Status</Label>
                                <Select value={form.data.status} onValueChange={(v) => form.setData('status', v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {statusList.map((s) => (
                                            <SelectItem key={s} value={s}>{s}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Catatan</Label>
                                <Textarea
                                    value={form.data.catatan_akademis}
                                    onChange={(e) => form.setData('catatan_akademis', e.target.value)}
                                    placeholder="Catatan untuk mahasiswa (opsional)"
                                    rows={3}
                                />
                            </div>
                            <Button onClick={() => setOpenKonfirm(true)} className="w-full">
                                Perbarui Status
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Detail Kegiatan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {pengajuan.detail_pengajuan.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Belum ada detail kegiatan.</p>
                        ) : (
                            <div className="space-y-4">
                                {pengajuan.detail_pengajuan.map((detail, i) => (
                                    <div key={detail.id} className="rounded-lg border p-4 space-y-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-medium">{i + 1}. {detail.nama_kegiatan}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {detail.kategori?.nama_kategori} · {detail.tahun_kegiatan} · {detail.peran}
                                                </p>
                                            </div>
                                        </div>
                                        {detail.bukti_kegiatan.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {detail.bukti_kegiatan.map((bukti) => (
                                                    <a
                                                        key={bukti.id}
                                                        href={`/storage/${bukti.path_file}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-xs text-primary underline underline-offset-2"
                                                    >
                                                        {bukti.nama_file}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={openKonfirm} onOpenChange={setOpenKonfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Status pengajuan akan diubah menjadi <strong>{form.data.status}</strong>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={simpan} disabled={form.processing}>Perbarui</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

PengajuanShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/akademis/dashboard' },
        { title: 'Pengajuan', href: '/akademis/pengajuan' },
        { title: 'Detail', href: '#' },
    ],
};
