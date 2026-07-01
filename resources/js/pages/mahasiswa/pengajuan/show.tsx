import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

export default function PengajuanShow({ pengajuan }: { pengajuan: Pengajuan }) {
    return (
        <>
            <Head title={`Pengajuan ${pengajuan.no_registrasi}`} />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">{pengajuan.no_registrasi}</h1>
                        <p className="text-sm text-muted-foreground">
                            {new Date(pengajuan.tgl_pengajuan).toLocaleDateString('id-ID', { dateStyle: 'long' })}
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

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Informasi Pengajuan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">No. Registrasi</span>
                            <span className="font-mono">{pengajuan.no_registrasi}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Tanggal Pengajuan</span>
                            <span>{new Date(pengajuan.tgl_pengajuan).toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
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
            </div>
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
