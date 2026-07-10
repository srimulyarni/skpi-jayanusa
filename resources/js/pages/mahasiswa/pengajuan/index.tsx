import { Head, Link, router } from '@inertiajs/react';
import { Eye, Pencil, Plus, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type DetailPengajuan = {
    id: number;
    kategori_id: number;
    nama_kegiatan: string;
    tahun_kegiatan: string;
    peran: string;
    kategori: { nama_kategori: string } | null;
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

export default function PengajuanIndex({ pengajuan, mahasiswa }: { pengajuan: Pengajuan[]; mahasiswa: MahasiswaData }) {
    const [openAjukan, setOpenAjukan] = useState(false);
    const [selectedDraft, setSelectedDraft] = useState<Pengajuan | null>(null);
    const [nomorIjazah, setNomorIjazah] = useState(mahasiswa.nomor_ijazah ?? '');
    const [ijazahError, setIjazahError] = useState('');

    const hasActive = pengajuan.some((p) => ['draft', 'menunggu', 'diproses'].includes(p.status));

    function handleAjukanClick(p: Pengajuan) {
        if (p.detail_pengajuan.length === 0) {
            toast.error('Tambahkan minimal 1 kegiatan sebelum mengajukan.');
            return;
        }

        setSelectedDraft(p);
        setNomorIjazah(mahasiswa.nomor_ijazah ?? '');
        setIjazahError('');
        setOpenAjukan(true);
    }

    function ajukan() {
        if (!nomorIjazah.trim()) {
            setIjazahError('Nomor ijazah wajib diisi');
            return;
        }

        if (!selectedDraft) {
            return;
        }

        router.post(`/mahasiswa/pengajuan/${selectedDraft.id}/ajukan`, { nomor_ijazah: nomorIjazah }, {
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
            <Head title="Pengajuan SKPI" />
            <div className="space-y-4 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Pengajuan SKPI</h1>
                    {!hasActive && (
                        <Button asChild>
                            <Link href="/mahasiswa/pengajuan/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Buat Draft
                            </Link>
                        </Button>
                    )}
                </div>

                {pengajuan.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <p className="text-muted-foreground">Anda belum memiliki pengajuan SKPI.</p>
                            <Button className="mt-4" asChild>
                                <Link href="/mahasiswa/pengajuan/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Buat Draft
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="overflow-hidden rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">No</TableHead>
                                    <TableHead>No. Registrasi</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Jumlah Kegiatan</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-32">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pengajuan.map((p, i) => (
                                    <TableRow key={p.id}>
                                        <TableCell>{i + 1}</TableCell>
                                        <TableCell className="font-mono text-sm">{p.no_registrasi ?? '-'}</TableCell>
                                        <TableCell>{p.tgl_pengajuan ? new Date(p.tgl_pengajuan).toLocaleDateString('id-ID') : '-'}</TableCell>
                                        <TableCell>{p.detail_pengajuan.length}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={statusColors[p.status] ?? ''}>
                                                {p.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <Button size="icon" variant="ghost" asChild>
                                                    <Link href={`/mahasiswa/pengajuan/${p.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                {['draft', 'menunggu', 'revisi', 'ditolak'].includes(p.status) && (
                                                    <Button size="icon" variant="ghost" asChild>
                                                        <Link href={`/mahasiswa/pengajuan/${p.id}/edit`}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                )}
                                                {p.status === 'draft' && (
                                                    <Button size="icon" variant="ghost" onClick={() => handleAjukanClick(p)}>
                                                        <Send className="h-4 w-4 text-primary" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            <Dialog open={openAjukan} onOpenChange={setOpenAjukan}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ajukan Pengajuan</DialogTitle>
                        <DialogDescription>
                            Masukkan nomor ijazah untuk mengajukan draft dengan {selectedDraft?.detail_pengajuan.length} kegiatan ke akademis.
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

PengajuanIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/mahasiswa/dashboard' },
        { title: 'Pengajuan SKPI', href: '/mahasiswa/pengajuan' },
    ],
};
