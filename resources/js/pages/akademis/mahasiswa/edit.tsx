import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Jurusan = { id: number; nama: string; singkatan: string };
type Mahasiswa = {
    id: number; nobp: string; nama: string; tempat_lahir: string | null;
    tanggal_lahir: string | null; jk: string | null; alamat: string | null;
    nohp: string | null; jurusan_id: number | null; akreditasi_prodi: string | null;
    nomor_ijazah: string | null; gelar: string | null; tahun_lulus: string | null;
};

export default function MahasiswaEdit({ mahasiswa, jurusan }: { mahasiswa: Mahasiswa; jurusan: Jurusan[] }) {
    const [openKonfirm, setOpenKonfirm] = useState(false);
    const form = useForm({
        nobp: mahasiswa.nobp,
        nama: mahasiswa.nama,
        tempat_lahir: mahasiswa.tempat_lahir ?? '',
        tanggal_lahir: mahasiswa.tanggal_lahir ?? '',
        jk: mahasiswa.jk ?? '',
        alamat: mahasiswa.alamat ?? '',
        nohp: mahasiswa.nohp ?? '',
        jurusan_id: mahasiswa.jurusan_id ? String(mahasiswa.jurusan_id) : '',
        akreditasi_prodi: mahasiswa.akreditasi_prodi ?? '',
        nomor_ijazah: mahasiswa.nomor_ijazah ?? '',
        gelar: mahasiswa.gelar ?? '',
        tahun_lulus: mahasiswa.tahun_lulus ?? '',
    });

    function simpan() {
        form.put(`/akademis/mahasiswa/${mahasiswa.id}`, {
            onSuccess: () => toast.success('Berhasil!'),
            onError: () => setOpenKonfirm(false),
        });
    }

    return (
        <>
            <Head title="Edit Mahasiswa" />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/akademis/mahasiswa"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <h1 className="text-xl font-semibold">Edit Mahasiswa</h1>
                </div>

                <Card className="max-w-2xl">
                    <CardContent className="pt-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label>NOBP</Label>
                                <Input value={form.data.nobp} disabled className="bg-muted" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nama">Nama Lengkap</Label>
                                <Input id="nama" value={form.data.nama} onChange={(e) => form.setData('nama', e.target.value)} />
                                {form.errors.nama && <p className="text-xs text-destructive">{form.errors.nama}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label>Jurusan</Label>
                                <Select value={form.data.jurusan_id} onValueChange={(v) => form.setData('jurusan_id', v)}>
                                    <SelectTrigger><SelectValue placeholder="Pilih jurusan" /></SelectTrigger>
                                    <SelectContent>
                                        {jurusan.map((j) => (
                                            <SelectItem key={j.id} value={String(j.id)}>{j.singkatan} — {j.nama}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Jenis Kelamin</Label>
                                <Select value={form.data.jk} onValueChange={(v) => form.setData('jk', v)}>
                                    <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="L">Laki-laki</SelectItem>
                                        <SelectItem value="P">Perempuan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                                <Input id="tempat_lahir" value={form.data.tempat_lahir} onChange={(e) => form.setData('tempat_lahir', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                                <Input id="tanggal_lahir" type="date" value={form.data.tanggal_lahir} onChange={(e) => form.setData('tanggal_lahir', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nohp">No. HP</Label>
                                <Input id="nohp" value={form.data.nohp} onChange={(e) => form.setData('nohp', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="tahun_lulus">Tahun Lulus</Label>
                                <Input id="tahun_lulus" value={form.data.tahun_lulus} onChange={(e) => form.setData('tahun_lulus', e.target.value)} placeholder="2024" />
                            </div>
                            <div className="sm:col-span-2">
                                <div className="flex gap-3 pt-2">
                                    <Button onClick={() => setOpenKonfirm(true)} disabled={form.processing} className="w-full sm:w-auto">
                                        Perbarui
                                    </Button>
                                    <Button variant="outline" asChild className="w-full sm:w-auto">
                                        <Link href="/akademis/mahasiswa">Batal</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={openKonfirm} onOpenChange={setOpenKonfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>Data mahasiswa akan diperbarui.</AlertDialogDescription>
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

MahasiswaEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/akademis/dashboard' },
        { title: 'Data Mahasiswa', href: '/akademis/mahasiswa' },
        { title: 'Edit', href: '#' },
    ],
};
