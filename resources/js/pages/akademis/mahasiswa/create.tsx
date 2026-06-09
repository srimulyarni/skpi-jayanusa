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

type Jurusan = { id: number; kode: string; nama: string; singkatan: string };

const emptyForm = {
    nobp: '', nama: '', tempat_lahir: '', tanggal_lahir: '', jk: '',
    alamat: '', nohp: '', jurusan_id: '', akreditasi_prodi: '',
    nomor_ijazah: '', gelar: '', tahun_lulus: '',
};

export default function MahasiswaCreate({ jurusan }: { jurusan: Jurusan[] }) {
    const [openKonfirm, setOpenKonfirm] = useState(false);
    const form = useForm(emptyForm);

    function simpan() {
        form.post('/akademis/mahasiswa', {
            onSuccess: () => toast.success('Berhasil!'),
            onError: () => setOpenKonfirm(false),
        });
    }

    return (
        <>
            <Head title="Tambah Mahasiswa" />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/akademis/mahasiswa"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <h1 className="text-xl font-semibold">Tambah Mahasiswa</h1>
                </div>

                <Card className="mx-auto max-w-2xl">
                    <CardContent className="pt-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="nobp">NOBP</Label>
                                <Input id="nobp" value={form.data.nobp} onChange={(e) => form.setData('nobp', e.target.value)} placeholder="2021001234" />
                                {form.errors.nobp && <p className="text-xs text-destructive">{form.errors.nobp}</p>}
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
                            <div className="sm:col-span-2 grid gap-2">
                                <div className="flex gap-3 pt-2">
                                    <Button onClick={() => setOpenKonfirm(true)} disabled={form.processing} className="w-full sm:w-auto">
                                        Simpan
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
                        <AlertDialogDescription>Data mahasiswa akan disimpan.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={simpan} disabled={form.processing}>Simpan</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

MahasiswaCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/akademis/dashboard' },
        { title: 'Data Mahasiswa', href: '/akademis/mahasiswa' },
        { title: 'Tambah', href: '/akademis/mahasiswa/create' },
    ],
};
