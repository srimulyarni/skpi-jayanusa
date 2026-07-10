import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Kategori = { id: number; nama_kategori: string };

type KegiatanItem = {
    kategori_id: string;
    nama_kegiatan: string;
    tahun_kegiatan: string;
    peran: string;
    bukti: File | null;
    buktiName: string;
    buktiUrl: string;
};

const emptyForm: KegiatanItem = {
    kategori_id: '',
    nama_kegiatan: '',
    tahun_kegiatan: '',
    peran: '',
    bukti: null,
    buktiName: '',
    buktiUrl: '',
};

export default function PengajuanCreate({ kategori }: { kategori: Kategori[] }) {
    const [openKonfirm, setOpenKonfirm] = useState(false);
    const [kegiatanList, setKegiatanList] = useState<KegiatanItem[]>([]);
    const [inputForm, setInputForm] = useState<KegiatanItem>({ ...emptyForm });
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [showDetail, setShowDetail] = useState<KegiatanItem | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    function getKategoriName(id: string) {
        return kategori.find((k) => String(k.id) === id)?.nama_kategori ?? '-';
    }

    function validateInput(): boolean {
        const errs: Record<string, string> = {};

        if (!inputForm.kategori_id) {
            errs.kategori_id = 'Pilih kategori';
        }

        if (!inputForm.nama_kegiatan) {
            errs.nama_kegiatan = 'Nama kegiatan wajib diisi';
        }

        if (!inputForm.tahun_kegiatan) {
            errs.tahun_kegiatan = 'Tahun wajib diisi';
        }

        if (!inputForm.peran) {
            errs.peran = 'Peran wajib diisi';
        }

        if (inputForm.bukti && inputForm.bukti.size > 5 * 1024 * 1024) {
            errs.bukti = 'Ukuran file maks 5MB';
        }

        setErrors(errs);

        return Object.keys(errs).length === 0;
    }

    function handleAdd() {
        if (!validateInput()) {
            return;
        }

        if (editIndex !== null) {
            setKegiatanList((prev) => {
                const next = [...prev];
                next[editIndex] = { ...inputForm };

                return next;
            });
            setEditIndex(null);
            toast.success('Kegiatan diperbarui');
        } else {
            setKegiatanList((prev) => [...prev, { ...inputForm }]);
            toast.success('Kegiatan ditambahkan');
        }

        setInputForm({ ...emptyForm });
        setErrors({});
    }

    function handleEdit(index: number) {
        const item = kegiatanList[index];
        setInputForm({ ...item });
        setEditIndex(index);
        setErrors({});
    }

    function handleDelete(index: number) {
        setKegiatanList((prev) => prev.filter((_, i) => i !== index));

        if (editIndex === index) {
            setEditIndex(null);
            setInputForm({ ...emptyForm });
        }

        toast.success('Kegiatan dihapus');
    }

    function handleCancelEdit() {
        setEditIndex(null);
        setInputForm({ ...emptyForm });
        setErrors({});
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        const isImage = file?.type.startsWith('image/');
        setInputForm((prev) => ({
            ...prev,
            bukti: file,
            buktiName: file?.name ?? '',
            buktiUrl: file && isImage ? URL.createObjectURL(file) : '',
        }));
    }

    function handleSubmit() {
        if (kegiatanList.length === 0) {
            toast.error('Tambahkan minimal 1 kegiatan');

            return;
        }

        const formData = new FormData();
        kegiatanList.forEach((item, i) => {
            formData.append(`kegiatan[${i}][kategori_id]`, item.kategori_id);
            formData.append(`kegiatan[${i}][nama_kegiatan]`, item.nama_kegiatan);
            formData.append(`kegiatan[${i}][tahun_kegiatan]`, item.tahun_kegiatan);
            formData.append(`kegiatan[${i}][peran]`, item.peran);
            if (item.bukti) {
                formData.append(`kegiatan[${i}][bukti]`, item.bukti);
            }
        });

        setProcessing(true);
        router.post('/mahasiswa/pengajuan', formData, {
            onSuccess: () => {
                setOpenKonfirm(false);
                toast.success('Draft pengajuan berhasil disimpan!');
            },
            onError: () => setOpenKonfirm(false),
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <>
            <Head title="Buat Draft SKPI" />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/mahasiswa/pengajuan"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <h1 className="text-xl font-semibold">Buat Draft SKPI</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            {editIndex !== null ? 'Edit Kegiatan' : 'Tambah Kegiatan'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label>Kategori</Label>
                                <Select
                                    value={inputForm.kategori_id}
                                    onValueChange={(v) => setInputForm((prev) => ({ ...prev, kategori_id: v }))}
                                >
                                    <SelectTrigger className="w-full"><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                                    <SelectContent>
                                        {kategori.map((k) => (
                                            <SelectItem key={k.id} value={String(k.id)}>{k.nama_kategori}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.kategori_id && <p className="text-xs text-destructive">{errors.kategori_id}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nama_kegiatan">Nama Kegiatan</Label>
                                <Input
                                    id="nama_kegiatan"
                                    value={inputForm.nama_kegiatan}
                                    onChange={(e) => setInputForm((prev) => ({ ...prev, nama_kegiatan: e.target.value }))}
                                    placeholder="Nama kegiatan"
                                />
                                {errors.nama_kegiatan && <p className="text-xs text-destructive">{errors.nama_kegiatan}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="tahun_kegiatan">Tahun Kegiatan</Label>
                                <Input
                                    id="tahun_kegiatan"
                                    type="number"
                                    min={1900}
                                    max={2099}
                                    value={inputForm.tahun_kegiatan}
                                    onChange={(e) => setInputForm((prev) => ({ ...prev, tahun_kegiatan: e.target.value }))}
                                    placeholder="Contoh: 2024"
                                />
                                {errors.tahun_kegiatan && <p className="text-xs text-destructive">{errors.tahun_kegiatan}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="peran">Peran</Label>
                                <Input
                                    id="peran"
                                    value={inputForm.peran}
                                    onChange={(e) => setInputForm((prev) => ({ ...prev, peran: e.target.value }))}
                                    placeholder="Contoh: Peserta, Ketua, dll."
                                />
                                {errors.peran && <p className="text-xs text-destructive">{errors.peran}</p>}
                            </div>
                            <div className="sm:col-span-2 grid gap-2">
                                <Label htmlFor="bukti">Bukti (JPG/PNG/PDF, maks 5MB)</Label>
                                <Input
                                    id="bukti"
                                    type="file"
                                    accept="image/jpeg,image/png,application/pdf"
                                    onChange={handleFileChange}
                                />
                                {inputForm.buktiName && (
                                    <p className="text-xs text-muted-foreground">{inputForm.buktiName}</p>
                                )}
                                {errors.bukti && <p className="text-xs text-destructive">{errors.bukti}</p>}
                            </div>
                            <div className="sm:col-span-2 flex gap-2">
                                <Button onClick={handleAdd} className="w-full sm:w-auto">
                                    <Plus className="mr-1 h-4 w-4" />
                                    {editIndex !== null ? 'Perbarui' : 'Tambah'}
                                </Button>
                                {editIndex !== null && (
                                    <Button variant="outline" onClick={handleCancelEdit} className="w-full sm:w-auto">
                                        Batal Edit
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {kegiatanList.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Daftar Kegiatan ({kegiatanList.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">No</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>Nama Kegiatan</TableHead>
                                        <TableHead>Tahun</TableHead>
                                        <TableHead>Peran</TableHead>
                                        <TableHead>Bukti</TableHead>
                                        <TableHead className="w-28">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {kegiatanList.map((item, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>{getKategoriName(item.kategori_id)}</TableCell>
                                            <TableCell>{item.nama_kegiatan}</TableCell>
                                            <TableCell>{item.tahun_kegiatan}</TableCell>
                                            <TableCell>{item.peran}</TableCell>
                                            <TableCell>{item.buktiName || '-'}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    <Button size="icon" variant="ghost" onClick={() => setShowDetail(item)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" onClick={() => handleEdit(i)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" onClick={() => handleDelete(i)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                <div className="flex gap-3">
                    <Button
                        onClick={() => setOpenKonfirm(true)}
                        disabled={kegiatanList.length === 0 || processing}
                        className="w-full sm:w-auto"
                    >
                        Simpan Draft
                    </Button>
                    <Button variant="outline" asChild className="w-full sm:w-auto">
                        <Link href="/mahasiswa/pengajuan">Batal</Link>
                    </Button>
                </div>
            </div>

            <Dialog open={!!showDetail} onOpenChange={() => setShowDetail(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Detail Kegiatan</DialogTitle>
                    </DialogHeader>
                    {showDetail && (
                        <div className="grid gap-3 text-sm">
                            <div><span className="text-muted-foreground">Kategori:</span> {getKategoriName(showDetail.kategori_id)}</div>
                            <div><span className="text-muted-foreground">Nama Kegiatan:</span> {showDetail.nama_kegiatan}</div>
                            <div><span className="text-muted-foreground">Tahun:</span> {showDetail.tahun_kegiatan}</div>
                            <div><span className="text-muted-foreground">Peran:</span> {showDetail.peran}</div>
                            <div>
                                <span className="text-muted-foreground">Bukti:</span> {showDetail.buktiName || '-'}
                            </div>
                            {showDetail.buktiUrl && (
                                <div>
                                    <img
                                        src={showDetail.buktiUrl}
                                        alt="Bukti"
                                        className="mt-2 max-h-64 rounded border object-contain"
                                    />
                                </div>
                            )}
                            {showDetail.bukti && !showDetail.buktiUrl && showDetail.bukti.type === 'application/pdf' && (
                                <div className="mt-2 rounded border bg-muted p-3 text-xs text-muted-foreground">
                                    {showDetail.buktiName}
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <AlertDialog open={openKonfirm} onOpenChange={setOpenKonfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Simpan Draft?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {kegiatanList.length} kegiatan akan disimpan sebagai draft. Anda dapat menambah atau mengedit kegiatan kapan saja sebelum diajukan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmit} disabled={processing}>Simpan</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

PengajuanCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/mahasiswa/dashboard' },
        { title: 'Pengajuan SKPI', href: '/mahasiswa/pengajuan' },
        { title: 'Buat Draft', href: '/mahasiswa/pengajuan/create' },
    ],
};
