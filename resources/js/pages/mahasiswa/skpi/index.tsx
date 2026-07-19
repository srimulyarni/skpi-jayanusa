import { Head, Link } from '@inertiajs/react';
import { Download, Eye, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTour } from '@/hooks/use-tour';

type Aktivitas = { id: number; nama_kegiatan: string; kategori: { nama_kategori: string } };
type Periode = { id: number; nama: string; tgl_mulai: string; tgl_selesai: string; max_aktivitas: number | null } | null;
type Pengajuan = {
    id: number; no_registrasi: string | null; tgl_pengajuan: string | null;
    tgl_proses: string | null;
    status: string; catatan_validator: string | null;
    aktivitas: Aktivitas[]; periode_skpi: { nama: string };
};

const statusColors: Record<string, string> = {
    menunggu: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    disetujui: 'bg-green-100 text-green-800 border-green-300',
    revisi: 'bg-orange-100 text-orange-800 border-orange-300',
    ditolak: 'bg-red-100 text-red-800 border-red-300',
    dibatalkan: 'bg-gray-100 text-gray-800 border-gray-300',
};

export default function SkpiIndex({ pengajuan, kompreStatus, periodeAktif }: { pengajuan: Pengajuan[]; kompreStatus: boolean; periodeAktif: Periode }) {
    const canCreate = kompreStatus && periodeAktif && !pengajuan.some((p) => ['menunggu', 'disetujui'].includes(p.status));

    useTour({
        tourKey: 'has_seen_mahasiswa_skpi_tour',
        steps: [
            { element: '[data-tour="skpi-buat"]', popover: { title: 'Buat Pengajuan', description: 'Klik tombol ini untuk membuat pengajuan SKPI baru.', side: 'bottom', align: 'end' } },
            { element: '[data-tour="skpi-table"]', popover: { title: 'Daftar Pengajuan', description: 'Riwayat pengajuan SKPI Anda beserta status dan tanggal prosesnya.', side: 'top', align: 'start' } },
        ],
    });

    return (
        <>
            <Head title="Pengajuan SKPI" />
            <div className="space-y-4 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Pengajuan SKPI</h1>
                    {canCreate && (
                        <Button asChild data-tour="skpi-buat">
                            <Link href="/mahasiswa/skpi/create"><Plus className="mr-2 h-4 w-4" /> Buat Pengajuan</Link>
                        </Button>
                    )}
                </div>

                {!kompreStatus && (
                    <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                        <strong>Catatan:</strong> Anda belum lulus kompre. Hubungi validator untuk mengubah status kompre.
                    </div>
                )}

                {kompreStatus && !periodeAktif && (
                    <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                        <strong>Catatan:</strong> Saat ini tidak ada periode SKPI yang aktif. Hubungi validator.
                    </div>
                )}

                {periodeAktif && (
                    <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800 space-y-1">
                        <p>Batas pengajuan: {new Date(periodeAktif.tgl_selesai).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
                        {periodeAktif.max_aktivitas != null && (
                            <p>Maksimal aktivitas yang diajukan: <strong>{periodeAktif.max_aktivitas}</strong></p>
                        )}
                    </div>
                )}

                {pengajuan.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <p className="text-muted-foreground">Anda belum memiliki pengajuan SKPI.</p>
                            {canCreate && (
                                <Button className="mt-4" asChild>
                                    <Link href="/mahasiswa/skpi/create"><Plus className="mr-2 h-4 w-4" /> Buat Pengajuan</Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="overflow-hidden rounded-md border" data-tour="skpi-table">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">No</TableHead>
                                    <TableHead>No. Registrasi</TableHead>
                                    <TableHead>Tanggal Pengajuan</TableHead>
                                    <TableHead>Periode</TableHead>
                                    <TableHead>Jumlah Aktivitas</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Tgl. Proses</TableHead>
                                    <TableHead className="w-20">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pengajuan.map((p, i) => (
                                    <TableRow key={p.id}>
                                        <TableCell>{i + 1}</TableCell>
                                        <TableCell className="font-mono text-sm">{p.no_registrasi ?? '-'}</TableCell>
                                        <TableCell>{p.tgl_pengajuan ? new Date(p.tgl_pengajuan).toLocaleDateString('id-ID') : '-'}</TableCell>
                                        <TableCell>{p.periode_skpi.nama}</TableCell>
                                        <TableCell>{p.aktivitas.length}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={statusColors[p.status] ?? ''}>{p.status}</Badge>
                                            {p.catatan_validator && <p className="mt-1 text-xs text-destructive">{p.catatan_validator}</p>}
                                        </TableCell>
                                        <TableCell>{p.tgl_proses ? new Date(p.tgl_proses).toLocaleDateString('id-ID') : '-'}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <Button size="icon" variant="ghost" asChild>
                                                    <Link href={`/mahasiswa/skpi/${p.id}`}><Eye className="h-4 w-4" /></Link>
                                                </Button>
                                                <Button size="icon" variant="ghost" asChild>
                                                    <a href={`/mahasiswa/skpi/${p.id}/bukti-pdf/download`}><Download className="h-4 w-4" /></a>
                                                </Button>
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

SkpiIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/mahasiswa/dashboard' },
        { title: 'Pengajuan SKPI', href: '/mahasiswa/skpi' },
    ],
};
