import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function IdentitasPtCreate() {
    const [openKonfirm, setOpenKonfirm] = useState(false);
    const form = useForm({
        kode_institusi: '',
        nama_pt: '',
        nama_singkat: '',
        nama_en: '',
        alamat: '',
        nomor_sk: '',
        akreditasi_institusi: '',
        nama_pimpinan: '',
        nidn: '',
        gelar: '',
    });

    function simpan() {
        form.post('/validator/identitas-pt', {
            onSuccess: () => toast.success('Berhasil!'),
            onError: () => setOpenKonfirm(false),
        });
    }

    return (
        <>
            <Head title="Tambah Identitas PT" />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/validator/identitas-pt">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-xl font-semibold">Tambah Identitas PT</h1>
                </div>

                <Card className="mx-auto max-w-2xl">
                    <CardContent className="pt-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="kode_institusi">Kode Institusi</Label>
                                <Input
                                    id="kode_institusi"
                                    value={form.data.kode_institusi}
                                    onChange={(e) => form.setData('kode_institusi', e.target.value.toUpperCase())}
                                    placeholder="Masukkan kode institusi"
                                />
                                {form.errors.kode_institusi && (
                                    <p className="text-xs text-destructive">{form.errors.kode_institusi}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nama_singkat">Nama Singkat</Label>
                                <Input
                                    id="nama_singkat"
                                    value={form.data.nama_singkat}
                                    onChange={(e) => form.setData('nama_singkat', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nama_pt">Nama PT</Label>
                                <Input
                                    id="nama_pt"
                                    value={form.data.nama_pt}
                                    onChange={(e) => form.setData('nama_pt', e.target.value)}
                                />
                                {form.errors.nama_pt && (
                                    <p className="text-xs text-destructive">{form.errors.nama_pt}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nama_en">Nama (Inggris)</Label>
                                <Input
                                    id="nama_en"
                                    value={form.data.nama_en}
                                    onChange={(e) => form.setData('nama_en', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nomor_sk">Nomor SK</Label>
                                <Input
                                    id="nomor_sk"
                                    value={form.data.nomor_sk}
                                    onChange={(e) => form.setData('nomor_sk', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Akreditasi</Label>
                                <Select
                                    value={form.data.akreditasi_institusi}
                                    onValueChange={(v) => form.setData('akreditasi_institusi', v)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih akreditasi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Unggul">Unggul</SelectItem>
                                        <SelectItem value="Baik Sekali">Baik Sekali</SelectItem>
                                        <SelectItem value="Baik">Baik</SelectItem>
                                        <SelectItem value="Tidak Terakreditasi">Tidak Terakreditasi</SelectItem>
                                    </SelectContent>
                                </Select>
                                {form.errors.akreditasi_institusi && (
                                    <p className="text-xs text-destructive">{form.errors.akreditasi_institusi}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nama_pimpinan">Nama Pimpinan</Label>
                                <Input
                                    id="nama_pimpinan"
                                    value={form.data.nama_pimpinan}
                                    onChange={(e) => form.setData('nama_pimpinan', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nidn">NIDN</Label>
                                <Input
                                    id="nidn"
                                    value={form.data.nidn}
                                    onChange={(e) => form.setData('nidn', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="gelar">Gelar</Label>
                                <Input
                                    id="gelar"
                                    value={form.data.gelar}
                                    onChange={(e) => form.setData('gelar', e.target.value)}
                                    placeholder="Contoh: S.Kom"
                                />
                            </div>
                            <div className="sm:col-span-2 grid gap-2">
                                <Label htmlFor="alamat">Alamat</Label>
                                <Textarea
                                    id="alamat"
                                    value={form.data.alamat}
                                    onChange={(e) => form.setData('alamat', e.target.value)}
                                    rows={3}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <div className="flex gap-3 pt-2">
                                    <Button
                                        onClick={() => setOpenKonfirm(true)}
                                        disabled={form.processing}
                                        className="w-full sm:w-auto"
                                    >
                                        Simpan
                                    </Button>
                                    <Button variant="outline" asChild className="w-full sm:w-auto">
                                        <Link href="/validator/identitas-pt">Batal</Link>
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
                        <AlertDialogDescription>Data identitas PT akan disimpan.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={simpan} disabled={form.processing}>
                            Simpan
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

IdentitasPtCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/validator/dashboard' },
        { title: 'Identitas PT', href: '/validator/identitas-pt' },
        { title: 'Tambah', href: '/validator/identitas-pt/create' },
    ],
};
