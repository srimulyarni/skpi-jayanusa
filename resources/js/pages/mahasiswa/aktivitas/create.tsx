import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Kategori = { id: number; nama_kategori: string; tipe: string };

const tingkatOptions = [
    { value: 'universitas', label: 'Universitas' },
    { value: 'wilayah', label: 'Wilayah' },
    { value: 'nasional', label: 'Nasional' },
    { value: 'internasional', label: 'Internasional' },
];

export default function AktivitasCreate({ kategori }: { kategori: Kategori[] }) {
    const [form, setForm] = useState({
        kategori_id: '',
        nama_kegiatan: '',
        tahun_kegiatan: '',
        peran: '',
        bukti_link: '',
        juara: '',
        tingkat: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const selectedKategori = kategori.find((k) => String(k.id) === form.kategori_id);
    const isLomba = selectedKategori?.tipe === 'lomba';

    const isFormValid =
        form.kategori_id !== '' &&
        form.nama_kegiatan.trim() !== '' &&
        form.tahun_kegiatan.trim() !== '' &&
        form.peran.trim() !== '' &&
        form.bukti_link.trim() !== '' &&
        (!isLomba || (form.juara.trim() !== '' && form.tingkat !== ''));

    function handleSubmit() {
        setProcessing(true);
        router.post('/mahasiswa/aktivitas', form, {
            onSuccess: () => toast.success('Aktivitas berhasil diajukan.'),
            onError: (e) => setErrors(e as Record<string, string>),
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <>
            <Head title="Tambah Aktivitas" />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/mahasiswa/aktivitas"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <h1 className="text-xl font-semibold">Tambah Aktivitas</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Data Aktivitas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label>Kategori</Label>
                                <Select value={form.kategori_id} onValueChange={(v) => setForm((p) => ({ ...p, kategori_id: v }))}>
                                    <SelectTrigger className="w-full"><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                                    <SelectContent>
                                        {kategori.map((k) => (
                                            <SelectItem key={k.id} value={String(k.id)}>
                                                {k.nama_kategori} {k.tipe === 'lomba' ? '(Lomba)' : ''}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.kategori_id && <p className="text-xs text-destructive">{errors.kategori_id}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="nama_kegiatan">Nama Kegiatan</Label>
                                <Input id="nama_kegiatan" value={form.nama_kegiatan} onChange={(e) => setForm((p) => ({ ...p, nama_kegiatan: e.target.value }))} placeholder="Nama kegiatan" />
                                {errors.nama_kegiatan && <p className="text-xs text-destructive">{errors.nama_kegiatan}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="tahun_kegiatan">Tahun Kegiatan</Label>
                                <Input id="tahun_kegiatan" type="number" min={1900} max={2099} value={form.tahun_kegiatan} onChange={(e) => setForm((p) => ({ ...p, tahun_kegiatan: e.target.value }))} placeholder="Contoh: 2026" />
                                {errors.tahun_kegiatan && <p className="text-xs text-destructive">{errors.tahun_kegiatan}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="peran">Peran</Label>
                                <Input id="peran" value={form.peran} onChange={(e) => setForm((p) => ({ ...p, peran: e.target.value }))} placeholder="Contoh: Peserta, Ketua" />
                                {errors.peran && <p className="text-xs text-destructive">{errors.peran}</p>}
                            </div>

                            <div className="sm:col-span-2 grid gap-2">
                                <Label htmlFor="bukti_link">Link Bukti (Google Drive)</Label>
                                <Input id="bukti_link" value={form.bukti_link} onChange={(e) => setForm((p) => ({ ...p, bukti_link: e.target.value }))} placeholder="https://drive.google.com/file/d/..." />
                                {errors.bukti_link && <p className="text-xs text-destructive">{errors.bukti_link}</p>}
                            </div>

                            {isLomba && (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="juara">Juara</Label>
                                        <Input id="juara" value={form.juara} onChange={(e) => setForm((p) => ({ ...p, juara: e.target.value }))} placeholder="Contoh: Juara 1" />
                                        {errors.juara && <p className="text-xs text-destructive">{errors.juara}</p>}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Tingkat</Label>
                                        <Select value={form.tingkat} onValueChange={(v) => setForm((p) => ({ ...p, tingkat: v }))}>
                                            <SelectTrigger className="w-full"><SelectValue placeholder="Pilih tingkat" /></SelectTrigger>
                                            <SelectContent>
                                                {tingkatOptions.map((t) => (
                                                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.tingkat && <p className="text-xs text-destructive">{errors.tingkat}</p>}
                                    </div>
                                </>
                            )}

                            <div className="sm:col-span-2 flex gap-2">
                                <Button onClick={handleSubmit} disabled={processing || !isFormValid} className="w-full sm:w-auto">
                                    Ajukan Aktivitas
                                </Button>
                                <Button variant="outline" asChild className="w-full sm:w-auto">
                                    <Link href="/mahasiswa/aktivitas">Batal</Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

AktivitasCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/mahasiswa/dashboard' },
        { title: 'Aktivitas Saya', href: '/mahasiswa/aktivitas' },
        { title: 'Tambah', href: '/mahasiswa/aktivitas/create' },
    ],
};
