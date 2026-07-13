import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type IdentitasPt = { akreditasi_institusi: string; gelar: string | null };
type Jurusan = { id: number; nama: string; singkatan: string; identitas_pt: IdentitasPt | null };
type Mahasiswa = {
    id: number; nobp: string; nama: string; foto: string | null;
    tempat_lahir: string | null; tanggal_lahir: string | null; jk: string | null;
    alamat: string | null; nohp: string | null; jurusan_id: number | null;
    nomor_ijazah: string | null;
    tahun_masuk: string | null;
    kompre_status: boolean | null;
    kompre_tanggal: string | null;
    jurusan: Jurusan | null;
};

export default function MahasiswaEdit({ mahasiswa }: { mahasiswa: Mahasiswa }) {
    const [openKonfirm, setOpenKonfirm] = useState(false);
    const [fotoPreview, setFotoPreview] = useState<string | null>(
        mahasiswa.foto ? `/storage/${mahasiswa.foto}` : null,
    );
    const form = useForm({
        _method: 'PUT' as const,
        tempat_lahir: mahasiswa.tempat_lahir ?? '',
        tanggal_lahir: mahasiswa.tanggal_lahir ?? '',
        jk: mahasiswa.jk ?? '',
        alamat: mahasiswa.alamat ?? '',
        nohp: mahasiswa.nohp ?? '',
        foto: null as File | null,
        nomor_ijazah: mahasiswa.nomor_ijazah ?? '',
        tahun_masuk: mahasiswa.tahun_masuk ?? '',
        kompre_status: mahasiswa.kompre_status ?? false,
        kompre_tanggal: mahasiswa.kompre_tanggal ?? '',
    });

    function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        form.setData('foto', file);

        if (file) {
            setFotoPreview(URL.createObjectURL(file));
        }
    }

    function handleNohpChange(e: React.ChangeEvent<HTMLInputElement>) {
        form.setData('nohp', e.target.value.replace(/[^0-9]/g, ''));
    }

    function simpan() {
        form.post(`/validator/mahasiswa/${mahasiswa.id}`, {
            onSuccess: () => toast.success('Berhasil!'),
            onError: () => setOpenKonfirm(false),
        });
    }

    return (
        <>
            <Head title={`Edit — ${mahasiswa.nama}`} />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/validator/mahasiswa"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-semibold">Edit Mahasiswa</h1>
                        <p className="text-sm text-muted-foreground">{mahasiswa.nobp}</p>
                    </div>
                </div>

                <Card className="mx-auto max-w-2xl">
                    <CardContent className="pt-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            {/* API Fields — Read Only */}
                            <div className="sm:col-span-2 flex items-end gap-3">
                                <div className="grid flex-1 gap-2">
                                    <Label>NOBP <Badge variant="secondary" className="ml-1 text-[10px]">API</Badge></Label>
                                    <Input value={mahasiswa.nobp} disabled className="bg-muted" />
                                </div>
                                <div className="grid flex-1 gap-2">
                                    <Label>Jurusan <Badge variant="secondary" className="ml-1 text-[10px]">API</Badge></Label>
                                    <Input value={mahasiswa.jurusan ? `${mahasiswa.jurusan.singkatan} — ${mahasiswa.jurusan.nama}` : '-'} disabled className="bg-muted" />
                                </div>
                            </div>
                            <div className="sm:col-span-2 grid gap-2">
                                <Label>Nama Lengkap <Badge variant="secondary" className="ml-1 text-[10px]">API</Badge></Label>
                                <Input value={mahasiswa.nama} disabled className="bg-muted" />
                            </div>

                            {/* Foto */}
                            <div className="sm:col-span-2 grid gap-2">
                                <Label htmlFor="foto">Foto</Label>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={fotoPreview ?? undefined} alt={mahasiswa.nama} />
                                        <AvatarFallback>{mahasiswa.nama.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <Input id="foto" type="file" accept="image/jpeg,image/png" onChange={handleFotoChange} />
                                </div>
                                {form.errors.foto && <p className="text-xs text-destructive">{form.errors.foto}</p>}
                            </div>

                            {/* Admin Fields */}
                            <div className="grid gap-2">
                                <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                                <Input id="tempat_lahir" value={form.data.tempat_lahir} onChange={(e) => form.setData('tempat_lahir', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                                <Input id="tanggal_lahir" type="date" value={form.data.tanggal_lahir} onChange={(e) => form.setData('tanggal_lahir', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Jenis Kelamin</Label>
                                <Select value={form.data.jk} onValueChange={(v) => form.setData('jk', v)}>
                                    <SelectTrigger className="w-full"><SelectValue placeholder="Silahkan Pilih Jenis Kelamin" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="L">Laki-laki</SelectItem>
                                        <SelectItem value="P">Perempuan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nohp">No. HP</Label>
                                <Input id="nohp" type="tel" inputMode="numeric" pattern="[0-9]*" value={form.data.nohp} onChange={handleNohpChange} />
                            </div>
                            <div className="sm:col-span-2 grid gap-2">
                                <Label htmlFor="alamat">Alamat</Label>
                                <Input id="alamat" value={form.data.alamat} onChange={(e) => form.setData('alamat', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Akreditasi Prodi <Badge variant="secondary" className="ml-1 text-[10px]">Identitas PT</Badge></Label>
                                <Input value={mahasiswa.jurusan?.identitas_pt?.akreditasi_institusi ?? '-'} disabled className="bg-muted" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nomor_ijazah">Nomor Ijazah</Label>
                                <Input id="nomor_ijazah" value={form.data.nomor_ijazah} onChange={(e) => form.setData('nomor_ijazah', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Gelar <Badge variant="secondary" className="ml-1 text-[10px]">Identitas PT</Badge></Label>
                                <Input value={mahasiswa.jurusan?.identitas_pt?.gelar ?? '-'} disabled className="bg-muted" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="tahun_masuk">Tahun Masuk</Label>
                                <Input id="tahun_masuk" type="number" value={form.data.tahun_masuk} onChange={(e) => form.setData('tahun_masuk', e.target.value)} placeholder="ex: 2024" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Status Kompre</Label>
                                <Select value={form.data.kompre_status ? '1' : '0'} onValueChange={(v) => form.setData('kompre_status', v === '1')}>
                                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Belum Lulus</SelectItem>
                                        <SelectItem value="1">Sudah Lulus</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {form.data.kompre_status && (
                                <div className="grid gap-2">
                                    <Label htmlFor="kompre_tanggal">Tanggal Kompre</Label>
                                    <Input id="kompre_tanggal" type="date" value={form.data.kompre_tanggal} onChange={(e) => form.setData('kompre_tanggal', e.target.value)} />
                                </div>
                            )}
                            <div className="sm:col-span-2">
                                <div className="flex gap-3 pt-2">
                                    <Button onClick={() => setOpenKonfirm(true)} disabled={form.processing} className="w-full sm:w-auto">
                                        Perbarui
                                    </Button>
                                    <Button variant="outline" asChild className="w-full sm:w-auto">
                                        <Link href="/validator/mahasiswa">Batal</Link>
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
        { title: 'Dashboard', href: '/validator/dashboard' },
        { title: 'Data Mahasiswa', href: '/validator/mahasiswa' },
        { title: 'Edit', href: '#' },
    ],
};
