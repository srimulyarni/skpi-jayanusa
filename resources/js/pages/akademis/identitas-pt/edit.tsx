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
import { Textarea } from '@/components/ui/textarea';

type IdentitasPt = {
    id: number; kode_institusi: string; nama_pt: string; nama_singkat: string;
    nama_en: string; alamat: string; nomor_sk: string; akreditasi_institusi: string;
    nama_pimpinan: string; nidn: string; logo: string | null;
};

export default function IdentitasPtEdit({ identitas }: { identitas: IdentitasPt }) {
    const [openKonfirm, setOpenKonfirm] = useState(false);
    const form = useForm({
        nama_pt: identitas.nama_pt,
        nama_singkat: identitas.nama_singkat,
        nama_en: identitas.nama_en,
        alamat: identitas.alamat,
        nomor_sk: identitas.nomor_sk,
        akreditasi_institusi: identitas.akreditasi_institusi,
        nama_pimpinan: identitas.nama_pimpinan,
        nidn: identitas.nidn,
        logo: identitas.logo ?? '',
    });

    function simpan() {
        form.put(`/akademis/identitas-pt/${identitas.id}`, {
            onSuccess: () => toast.success('Berhasil!'),
            onError: () => setOpenKonfirm(false),
        });
    }

    return (
        <>
            <Head title={`Edit Identitas — ${identitas.kode_institusi}`} />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/akademis/identitas-pt"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-semibold">Edit Identitas PT</h1>
                        <p className="text-sm text-muted-foreground">{identitas.kode_institusi}</p>
                    </div>
                </div>

                <Card className="max-w-2xl">
                    <CardContent className="pt-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="nama_pt">Nama PT</Label>
                                <Input id="nama_pt" value={form.data.nama_pt} onChange={(e) => form.setData('nama_pt', e.target.value)} />
                                {form.errors.nama_pt && <p className="text-xs text-destructive">{form.errors.nama_pt}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nama_singkat">Nama Singkat</Label>
                                <Input id="nama_singkat" value={form.data.nama_singkat} onChange={(e) => form.setData('nama_singkat', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nama_en">Nama (Inggris)</Label>
                                <Input id="nama_en" value={form.data.nama_en} onChange={(e) => form.setData('nama_en', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nomor_sk">Nomor SK</Label>
                                <Input id="nomor_sk" value={form.data.nomor_sk} onChange={(e) => form.setData('nomor_sk', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="akreditasi_institusi">Akreditasi</Label>
                                <Input id="akreditasi_institusi" value={form.data.akreditasi_institusi} onChange={(e) => form.setData('akreditasi_institusi', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nama_pimpinan">Nama Pimpinan</Label>
                                <Input id="nama_pimpinan" value={form.data.nama_pimpinan} onChange={(e) => form.setData('nama_pimpinan', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nidn">NIDN</Label>
                                <Input id="nidn" value={form.data.nidn} onChange={(e) => form.setData('nidn', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="logo">Logo (path)</Label>
                                <Input id="logo" value={form.data.logo} onChange={(e) => form.setData('logo', e.target.value)} />
                            </div>
                            <div className="sm:col-span-2 grid gap-2">
                                <Label htmlFor="alamat">Alamat</Label>
                                <Textarea id="alamat" value={form.data.alamat} onChange={(e) => form.setData('alamat', e.target.value)} rows={3} />
                            </div>
                            <div className="sm:col-span-2">
                                <div className="flex gap-3 pt-2">
                                    <Button onClick={() => setOpenKonfirm(true)} disabled={form.processing} className="w-full sm:w-auto">
                                        Perbarui
                                    </Button>
                                    <Button variant="outline" asChild className="w-full sm:w-auto">
                                        <Link href="/akademis/identitas-pt">Batal</Link>
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
                        <AlertDialogDescription>
                            Identitas <strong>{identitas.kode_institusi}</strong> akan diperbarui.
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

IdentitasPtEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/akademis/dashboard' },
        { title: 'Identitas PT', href: '/akademis/identitas-pt' },
        { title: 'Edit', href: '#' },
    ],
};
