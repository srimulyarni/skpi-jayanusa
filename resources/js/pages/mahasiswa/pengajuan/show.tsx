import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, ExternalLink, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type BuktiKegiatan = { id: number; nama_file: string; path_file: string };
type Kategori = { nama_kategori: string };
type DetailPengajuan = {
    id: number;
    nama_kegiatan: string;
    tahun_kegiatan: string;
    peran: string;
    kategori: Kategori | null;
    bukti_kegiatan: BuktiKegiatan[];
};
type Pengajuan = {
    id: number;
    no_registrasi: string | null;
    tgl_pengajuan: string | null;
    status: string;
    catatan_akademis: string | null;
    detail_pengajuan: DetailPengajuan[];
};

type MahasiswaData = {
    nomor_ijazah: string | null;
};

const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800 border-gray-300',
    menunggu: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    diproses: 'bg-blue-100 text-blue-800 border-blue-300',
    disetujui: 'bg-green-100 text-green-800 border-green-300',
    revisi: 'bg-orange-100 text-orange-800 border-orange-300',
    ditolak: 'bg-red-100 text-red-800 border-red-300',
};

export default function PengajuanShow({ pengajuan, mahasiswa }: { pengajuan: Pengajuan; mahasiswa: MahasiswaData }) {
    const [openAjukan, setOpenAjukan] = useState(false);
    const [nomorIjazah, setNomorIjazah] = useState(mahasiswa.nomor_ijazah ?? '');
    const [ijazahError, setIjazahError] = useState('');

    function handleAjukanClick() {
        if (pengajuan.detail_pengajuan.length === 0) {
            toast.error('Tambahkan minimal 1 kegiatan sebelum mengajukan.');
            return;
        }

        setNomorIjazah(mahasiswa.nomor_ijazah ?? '');
        setIjazahError('');
        setOpenAjukan(true);
    }

    function ajukan() {
        if (!nomorIjazah.trim()) {
            setIjazahError('Nomor ijazah wajib diisi');
            return;
        }

        router.post(`/mahasiswa/pengajuan/${pengajuan.id}/ajukan`, { nomor_ijazah: nomorIjazah }, {
            onSuccess: () => {
                setOpenAjukan(false);
                toast.success('Pengajuan berhasil diajukan!');
            },
            onError: (errors) => {
                if (errors.nomor_ijazah) {
                    setIjazahError(errors.nomor_ijazah);
                }
                if (errors.error) {
                    toast.error(errors.error);
                    setOpenAjukan(false);
                }
            },
        });
    }

    return (
        <>
            <Head title={`Pengajuan ${pengajuan.no_registrasi ?? 'Draft'}`} />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">{pengajuan.no_registrasi ?? 'Draft Pengajuan'}</h1>
                        <p className="text-sm text-muted-foreground">
                            {pengajuan.tgl_pengajuan
                                ? new Date(pengajuan.tgl_pengajuan).toLocaleDateString('id-ID', { dateStyle: 'long' })
                                : 'Belum diajukan'}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className={statusColors[pengajuan.status] ?? ''}>
                            {pengajuan.status}
                        </Badge>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/mahasiswa/pengajuan">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>
                    </div>
                </div>

                {pengajuan.status === 'draft' && (
                    <Alert className="border-amber-200 bg-amber-50 text-amber-900 [&>svg]:text-amber-600">
                        <AlertTitle>Draft Pengajuan</AlertTitle>
                        <AlertDescription className="text-amber-800">
                            Klik tombol "Ajukan" di bawah dan masukkan nomor ijazah untuk mengirimkan pengajuan ini ke akademis.
                        </AlertDescription>
                    </Alert>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Informasi Pengajuan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">No. Registrasi</span>
                            <span className="font-mono">{pengajuan.no_registrasi ?? '-'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Tanggal Pengajuan</span>
                            <span>{pengajuan.tgl_pengajuan
                                ? new Date(pengajuan.tgl_pengajuan).toLocaleDateString('id-ID', { dateStyle: 'long' })
                                : '-'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <Badge variant="outline" className={statusColors[pengajuan.status] ?? ''}>
                                {pengajuan.status}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {(pengajuan.status === 'revisi' || pengajuan.status === 'ditolak') && pengajuan.catatan_akademis && (
                    <Alert variant="destructive" className="border-orange-200 bg-orange-50 text-orange-900 [&>svg]:text-orange-600">
                        <AlertTitle>Catatan Akademis</AlertTitle>
                        <AlertDescription className="text-orange-800">
                            {pengajuan.catatan_akademis}
                        </AlertDescription>
                    </Alert>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Daftar Kegiatan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {pengajuan.detail_pengajuan.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Belum ada kegiatan.</p>
                        ) : (
                            <div className="overflow-hidden rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12">No</TableHead>
                                            <TableHead>Kategori</TableHead>
                                            <TableHead>Nama Kegiatan</TableHead>
                                            <TableHead>Tahun</TableHead>
                                            <TableHead>Peran</TableHead>
                                            <TableHead>Bukti</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pengajuan.detail_pengajuan.map((detail, i) => (
                                            <TableRow key={detail.id}>
                                                <TableCell>{i + 1}</TableCell>
                                                <TableCell>{detail.kategori?.nama_kategori ?? '-'}</TableCell>
                                                <TableCell className="font-medium">{detail.nama_kegiatan}</TableCell>
                                                <TableCell>{detail.tahun_kegiatan}</TableCell>
                                                <TableCell>{detail.peran}</TableCell>
                                                <TableCell>
                                                    {detail.bukti_kegiatan.length > 0 ? (
                                                        <div className="flex flex-col gap-1">
                                                            {detail.bukti_kegiatan.map((bukti) => (
                                                                <a
                                                                    key={bukti.id}
                                                                    href={`/storage/${bukti.path_file}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="inline-flex items-center gap-1 text-xs text-primary underline underline-offset-2"
                                                                >
                                                                    <ExternalLink className="h-3 w-3" />
                                                                    {bukti.nama_file}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {pengajuan.status === 'draft' && (
                    <div className="flex gap-3">
                        <Button onClick={handleAjukanClick}>
                            <Send className="mr-2 h-4 w-4" />
                            Ajukan ke Akademis
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={`/mahasiswa/pengajuan/${pengajuan.id}/edit`}>Edit Draft</Link>
                        </Button>
                    </div>
                )}
            </div>

            <Dialog open={openAjukan} onOpenChange={setOpenAjukan}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ajukan Pengajuan</DialogTitle>
                        <DialogDescription>
                            Masukkan nomor ijazah untuk mengajukan draft dengan {pengajuan.detail_pengajuan.length} kegiatan ke akademis.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2 py-2">
                        <Label htmlFor="nomor_ijazah">Nomor Ijazah</Label>
                        <Input
                            id="nomor_ijazah"
                            value={nomorIjazah}
                            onChange={(e) => { setNomorIjazah(e.target.value); setIjazahError(''); }}
                            placeholder="Masukkan nomor ijazah"
                        />
                        {ijazahError && <p className="text-xs text-destructive">{ijazahError}</p>}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenAjukan(false)}>Batal</Button>
                        <Button onClick={ajukan}>Ajukan</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

PengajuanShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/mahasiswa/dashboard' },
        { title: 'Pengajuan SKPI', href: '/mahasiswa/pengajuan' },
        { title: 'Detail', href: '#' },
    ],
};
