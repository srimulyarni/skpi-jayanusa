import { Head, Link } from '@inertiajs/react';
import { Eye, Pencil, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    no_registrasi: string;
    tgl_pengajuan: string;
    status: string;
    catatan_akademis: string | null;
    detail_pengajuan: DetailPengajuan[];
};

const statusColors: Record<string, string> = {
    menunggu: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    diproses: 'bg-blue-100 text-blue-800 border-blue-300',
    disetujui: 'bg-green-100 text-green-800 border-green-300',
    revisi: 'bg-orange-100 text-orange-800 border-orange-300',
    ditolak: 'bg-red-100 text-red-800 border-red-300',
};

export default function PengajuanIndex({ pengajuan }: { pengajuan: Pengajuan[] }) {
    const hasActive = pengajuan.some((p) => p.status === 'menunggu' || p.status === 'diproses');

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
                                Ajukan SKPI
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
                                    Ajukan SKPI
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
                                    <TableHead className="w-16">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pengajuan.map((p, i) => (
                                    <TableRow key={p.id}>
                                        <TableCell>{i + 1}</TableCell>
                                        <TableCell className="font-mono text-sm">{p.no_registrasi}</TableCell>
                                        <TableCell>{new Date(p.tgl_pengajuan).toLocaleDateString('id-ID')}</TableCell>
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
                                                {['menunggu', 'revisi', 'ditolak'].includes(p.status) && (
                                                    <Button size="icon" variant="ghost" asChild>
                                                        <Link href={`/mahasiswa/pengajuan/${p.id}/edit`}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
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
        </>
    );
}

PengajuanIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/mahasiswa/dashboard' },
        { title: 'Pengajuan SKPI', href: '/mahasiswa/pengajuan' },
    ],
};
