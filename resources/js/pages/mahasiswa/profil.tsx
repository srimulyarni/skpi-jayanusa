import { Head, useForm } from '@inertiajs/react';
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
import { Textarea } from '@/components/ui/textarea';

type IdentitasPt = { akreditasi_institusi: string; gelar: string | null };
type Jurusan = { id: number; nama: string; singkatan: string; identitas_pt: IdentitasPt | null };
type Mahasiswa = {
    id: number; nobp: string; nama: string; foto: string | null;
    tempat_lahir: string | null; tanggal_lahir: string | null; jk: string | null;
    alamat: string | null; nohp: string | null; jurusan_id: number | null;
    nomor_ijazah: string | null; tahun_lulus: string | null;
    jurusan: Jurusan | null;
};

export default function MahasiswaProfil({ mahasiswa }: { mahasiswa: Mahasiswa }) {
    const [openKonfirm, setOpenKonfirm] = useState(false);
    const [fotoPreview, setFotoPreview] = useState<string | null>(
        mahasiswa.foto ? `/storage/${mahasiswa.foto}` : null,
    );
    const form = useForm({
        _method: 'PUT' as const,
        foto: null as File | null,
        tempat_lahir: mahasiswa.tempat_lahir ?? '',
        tanggal_lahir: mahasiswa.tanggal_lahir ?? '',
        jk: mahasiswa.jk ?? '',
        nohp: mahasiswa.nohp ?? '',
        alamat: mahasiswa.alamat ?? '',
        nomor_ijazah: mahasiswa.nomor_ijazah ?? '',
        tahun_lulus: mahasiswa.tahun_lulus ?? '',
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
        form.post('/mahasiswa/profil', {
            onSuccess: () => toast.success('Profil berhasil diperbarui!'),
            onError: () => setOpenKonfirm(false),
        });
    }

    return (
        <>
            <Head title="Profil Saya" />

            <div className="space-y-6 p-4 md:p-6">
                <h1 className="text-xl font-semibold">Profil Saya</h1>

                <Card className="mx-auto max-w-2xl">
                    <CardContent className="pt-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2 flex items-end gap-3">
                                <div className="grid flex-1 gap-2">
                                    <Label>NOBP <Badge variant="secondary" className="ml-1 text-[10px]">API</Badge></Label>
                                    <Input value={mahasiswa.nobp} disabled className="bg-muted" />
                                </div>
                                <div className="grid flex-1 gap-2">
                                    <Label>Jurusan <Badge variant="secondary" className="ml-1 text-[10px]">Identitas PT</Badge></Label>
                                    <Input value={mahasiswa.jurusan ? `${mahasiswa.jurusan.singkatan} — ${mahasiswa.jurusan.nama}` : '-'} disabled className="bg-muted" />
                                </div>
                            </div>

                            <div className="sm:col-span-2 grid gap-2">
                                <Label>Nama Lengkap <Badge variant="secondary" className="ml-1 text-[10px]">API</Badge></Label>
                                <Input value={mahasiswa.nama} disabled className="bg-muted" />
                            </div>

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

                            <div className="grid gap-2">
                                <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                                <Input id="tempat_lahir" value={form.data.tempat_lahir} onChange={(e) => form.setData('tempat_lahir', e.target.value)} />
                                {form.errors.tempat_lahir && <p className="text-xs text-destructive">{form.errors.tempat_lahir}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                                <Input id="tanggal_lahir" type="date" value={form.data.tanggal_lahir} onChange={(e) => form.setData('tanggal_lahir', e.target.value)} />
                                {form.errors.tanggal_lahir && <p className="text-xs text-destructive">{form.errors.tanggal_lahir}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label>Jenis Kelamin</Label>
                                <Select value={form.data.jk} onValueChange={(v) => form.setData('jk', v)}>
                                    <SelectTrigger className="w-full"><SelectValue placeholder="Pilih jenis kelamin" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="L">Laki-laki</SelectItem>
                                        <SelectItem value="P">Perempuan</SelectItem>
                                    </SelectContent>
                                </Select>
                                {form.errors.jk && <p className="text-xs text-destructive">{form.errors.jk}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nohp">No. HP</Label>
                                <Input id="nohp" type="tel" inputMode="numeric" pattern="[0-9]*" value={form.data.nohp} onChange={handleNohpChange} />
                                {form.errors.nohp && <p className="text-xs text-destructive">{form.errors.nohp}</p>}
                            </div>
                            <div className="sm:col-span-2 grid gap-2">
                                <Label htmlFor="alamat">Alamat</Label>
                                <Textarea id="alamat" value={form.data.alamat} onChange={(e) => form.setData('alamat', e.target.value)} rows={3} />
                                {form.errors.alamat && <p className="text-xs text-destructive">{form.errors.alamat}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nomor_ijazah">Nomor Ijazah</Label>
                                <Input id="nomor_ijazah" value={form.data.nomor_ijazah} onChange={(e) => form.setData('nomor_ijazah', e.target.value)} />
                                {form.errors.nomor_ijazah && <p className="text-xs text-destructive">{form.errors.nomor_ijazah}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label>Akreditasi Prodi <Badge variant="secondary" className="ml-1 text-[10px]">Identitas PT</Badge></Label>
                                <Input value={mahasiswa.jurusan?.identitas_pt?.akreditasi_institusi ?? '-'} disabled className="bg-muted" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Gelar <Badge variant="secondary" className="ml-1 text-[10px]">Identitas PT</Badge></Label>
                                <Input value={mahasiswa.jurusan?.identitas_pt?.gelar ?? '-'} disabled className="bg-muted" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="tahun_lulus">Tahun Lulus</Label>
                                <Input id="tahun_lulus" type="number" value={form.data.tahun_lulus} onChange={(e) => form.setData('tahun_lulus', e.target.value)} placeholder="Contoh: 2024" />
                            </div>

                            <div className="sm:col-span-2">
                                <div className="flex gap-3 pt-2">
                                    <Button onClick={() => setOpenKonfirm(true)} disabled={form.processing} className="w-full sm:w-auto">
                                        Simpan
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
                        <AlertDialogTitle>Simpan Perubahan?</AlertDialogTitle>
                        <AlertDialogDescription>Data profil Anda akan diperbarui.</AlertDialogDescription>
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

MahasiswaProfil.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/mahasiswa/dashboard' },
        { title: 'Profil Saya', href: '/mahasiswa/profil' },
    ],
};
