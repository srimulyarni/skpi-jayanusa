import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function PeriodeSkpiCreate() {
    const [form, setForm] = useState({ nama: '', kode: '', tgl_mulai: '', tgl_selesai: '', max_aktivitas: '', status: 'aktif' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    function handleSubmit() {
        setProcessing(true);
        router.post('/validator/periode-skpi', form, {
            onSuccess: () => toast.success('Periode SKPI ditambahkan.'),
            onError: (e) => setErrors(e as Record<string, string>),
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <>
            <Head title="Tambah Periode SKPI" />
            <div className="space-y-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" asChild><Link href="/validator/periode-skpi"><ArrowLeft className="h-4 w-4" /></Link></Button>
                    <h1 className="text-xl font-semibold">Tambah Periode SKPI</h1>
                </div>
                <Card>
                    <CardHeader><CardTitle className="text-base">Data Periode</CardTitle></CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2 grid gap-2">
                                <Label htmlFor="nama">Nama Periode</Label>
                                <Input id="nama" value={form.nama} onChange={(e) => setForm((p) => ({ ...p, nama: e.target.value }))} placeholder="Contoh: Periode Juli 2026" />
                                {errors.nama && <p className="text-xs text-destructive">{errors.nama}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="kode">Kode Periode</Label>
                                <Input id="kode" value={form.kode} onChange={(e) => setForm((p) => ({ ...p, kode: e.target.value }))} placeholder="Kosongkan untuk otomatis" />
                                <p className="text-xs text-muted-foreground">Format: YYYY+semester. Contoh: 20261 (Gasal 2026)</p>
                                {errors.kode && <p className="text-xs text-destructive">{errors.kode}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="tgl_mulai">Tanggal Mulai</Label>
                                <Input id="tgl_mulai" type="date" value={form.tgl_mulai} onChange={(e) => setForm((p) => ({ ...p, tgl_mulai: e.target.value }))} />
                                {errors.tgl_mulai && <p className="text-xs text-destructive">{errors.tgl_mulai}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="tgl_selesai">Tanggal Selesai</Label>
                                <Input id="tgl_selesai" type="date" value={form.tgl_selesai} onChange={(e) => setForm((p) => ({ ...p, tgl_selesai: e.target.value }))} />
                                {errors.tgl_selesai && <p className="text-xs text-destructive">{errors.tgl_selesai}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label>Status</Label>
                                <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}>
                                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="aktif">Aktif</SelectItem>
                                        <SelectItem value="nonaktif">Nonaktif</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="max_aktivitas">Maksimal Aktivitas</Label>
                                <Input id="max_aktivitas" type="number" min={1} value={form.max_aktivitas} onChange={(e) => setForm((p) => ({ ...p, max_aktivitas: e.target.value }))} placeholder="Kosongkan jika tidak ada batasan" />
                                {errors.max_aktivitas && <p className="text-xs text-destructive">{errors.max_aktivitas}</p>}
                            </div>
                            <div className="sm:col-span-2 flex gap-2">
                                <Button onClick={handleSubmit} disabled={processing}>Simpan</Button>
                                <Button variant="outline" asChild><Link href="/validator/periode-skpi">Batal</Link></Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

PeriodeSkpiCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/validator/dashboard' },
        { title: 'Periode SKPI', href: '/validator/periode-skpi' },
        { title: 'Tambah', href: '/validator/periode-skpi/create' },
    ],
};
