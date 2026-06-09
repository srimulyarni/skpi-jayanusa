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

type IdentitasPt = { id: number; kode_institusi: string; nama_singkat: string };

export default function JurusanCreate({ identitas }: { identitas: IdentitasPt[] }) {
    const [openKonfirm, setOpenKonfirm] = useState(false);
    const form = useForm({ kode: '', nama: '', singkatan: '', identitas_pt_id: '' });

    function simpan() {
        form.post('/akademis/jurusan', {
            onSuccess: () => toast.success('Berhasil!'),
            onError: () => setOpenKonfirm(false),
        });
    }

    return (
        <>
            <Head title="Tambah Jurusan" />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/akademis/jurusan"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <h1 className="text-xl font-semibold">Tambah Jurusan</h1>
                </div>

                <Card className="max-w-lg">
                    <CardContent className="space-y-4 pt-6">
                        <div className="grid gap-2">
                            <Label>Kode</Label>
                            <Select value={form.data.kode} onValueChange={(v) => form.setData('kode', v)}>
                                <SelectTrigger><SelectValue placeholder="Pilih kode" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="000">000 — MI</SelectItem>
                                    <SelectItem value="100">100 — SI</SelectItem>
                                    <SelectItem value="200">200 — SK</SelectItem>
                                </SelectContent>
                            </Select>
                            {form.errors.kode && <p className="text-sm text-destructive">{form.errors.kode}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="nama">Nama Jurusan</Label>
                            <Input id="nama" value={form.data.nama} onChange={(e) => form.setData('nama', e.target.value)} />
                            {form.errors.nama && <p className="text-sm text-destructive">{form.errors.nama}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="singkatan">Singkatan</Label>
                            <Input id="singkatan" value={form.data.singkatan} onChange={(e) => form.setData('singkatan', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Institusi</Label>
                            <Select value={form.data.identitas_pt_id} onValueChange={(v) => form.setData('identitas_pt_id', v)}>
                                <SelectTrigger><SelectValue placeholder="Pilih institusi" /></SelectTrigger>
                                <SelectContent>
                                    {identitas.map((pt) => (
                                        <SelectItem key={pt.id} value={String(pt.id)}>
                                            {pt.kode_institusi} — {pt.nama_singkat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button onClick={() => setOpenKonfirm(true)} disabled={form.processing} className="w-full sm:w-auto">
                                Simpan
                            </Button>
                            <Button variant="outline" asChild className="w-full sm:w-auto">
                                <Link href="/akademis/jurusan">Batal</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={openKonfirm} onOpenChange={setOpenKonfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>Data jurusan akan disimpan.</AlertDialogDescription>
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

JurusanCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/akademis/dashboard' },
        { title: 'Jurusan', href: '/akademis/jurusan' },
        { title: 'Tambah', href: '/akademis/jurusan/create' },
    ],
};
