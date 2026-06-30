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

type Kategori = { id: number; nama_kategori: string; status: 'aktif' | 'nonaktif' };

export default function KategoriEdit({ kategori }: { kategori: Kategori }) {
    const [openKonfirm, setOpenKonfirm] = useState(false);
    const form = useForm({ nama_kategori: kategori.nama_kategori, status: kategori.status });

    function simpan() {
        form.put(`/akademis/kategori/${kategori.id}`, {
            onSuccess: () => toast.success('Berhasil!'),
            onError: () => setOpenKonfirm(false),
        });
    }

    return (
        <>
            <Head title="Edit Kategori" />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/akademis/kategori"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <h1 className="text-xl font-semibold">Edit Kategori</h1>
                </div>

                <Card className="mx-auto max-w-lg">
                    <CardContent className="space-y-4 pt-6">
                        <div className="grid gap-2">
                            <Label htmlFor="nama_kategori">Nama Kategori</Label>
                            <Input
                                id="nama_kategori"
                                value={form.data.nama_kategori}
                                onChange={(e) => form.setData('nama_kategori', e.target.value)}
                            />
                            {form.errors.nama_kategori && (
                                <p className="text-sm text-destructive">{form.errors.nama_kategori}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label>Status</Label>
                            <Select value={form.data.status} onValueChange={(v: 'aktif' | 'nonaktif') => form.setData('status', v)}>
                                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="aktif">Aktif</SelectItem>
                                    <SelectItem value="nonaktif">Nonaktif</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button onClick={() => setOpenKonfirm(true)} disabled={form.processing} className="w-full sm:w-auto">
                                Perbarui
                            </Button>
                            <Button variant="outline" asChild className="w-full sm:w-auto">
                                <Link href="/akademis/kategori">Batal</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={openKonfirm} onOpenChange={setOpenKonfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>Data kategori akan diperbarui.</AlertDialogDescription>
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

KategoriEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/akademis/dashboard' },
        { title: 'Kategori Kegiatan', href: '/akademis/kategori' },
        { title: 'Edit', href: '#' },
    ],
};
