import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Kategori = { id: number; nama_kategori: string; tipe: string };

type Aktivitas = {
    id: number;
    nama_kegiatan: string;
    tahun_kegiatan: string;
    peran: string;
    bukti_link: string | null;
    juara: string | null;
    tingkat: string | null;
    status: string;
    catatan_validator: string | null;
    kategori: Kategori;
};

const statusColors: Record<string, string> = {
    menunggu: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    disetujui: 'bg-green-100 text-green-800 border-green-300',
    ditolak: 'bg-red-100 text-red-800 border-red-300',
};

export default function AktivitasShow({ aktivitas }: { aktivitas: Aktivitas }) {
    return (
        <>
            <Head title={`Aktivitas: ${aktivitas.nama_kegiatan}`} />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/mahasiswa/aktivitas"><ArrowLeft className="h-4 w-4" /></Link>
                        </Button>
                        <h1 className="text-xl font-semibold">Detail Aktivitas</h1>
                    </div>
                    <Badge variant="outline" className={statusColors[aktivitas.status] ?? ''}>
                        {aktivitas.status}
                    </Badge>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Informasi Aktivitas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Kategori</span>
                            <span>
                                {aktivitas.kategori.nama_kategori}
                                {aktivitas.kategori.tipe === 'lomba' && (
                                    <Badge variant="outline" className="ml-1 text-[10px]">Lomba</Badge>
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Nama Kegiatan</span>
                            <span className="font-medium">{aktivitas.nama_kegiatan}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Tahun</span>
                            <span>{aktivitas.tahun_kegiatan}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Peran</span>
                            <span>{aktivitas.peran}</span>
                        </div>
                        {aktivitas.juara && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Juara</span>
                                <span>{aktivitas.juara}</span>
                            </div>
                        )}
                        {aktivitas.tingkat && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tingkat</span>
                                <span className="capitalize">{aktivitas.tingkat}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Bukti</span>
                            {aktivitas.bukti_link ? (
                                <a href={aktivitas.bukti_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary underline underline-offset-2">
                                    <ExternalLink className="h-3 w-3" />
                                    Link Google Drive
                                </a>
                            ) : (
                                <span className="text-muted-foreground">-</span>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {aktivitas.catatan_validator && (
                    <Card className="border-destructive">
                        <CardHeader>
                            <CardTitle className="text-base text-destructive">Catatan Validator</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">{aktivitas.catatan_validator}</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

AktivitasShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/mahasiswa/dashboard' },
        { title: 'Aktivitas Saya', href: '/mahasiswa/aktivitas' },
        { title: 'Detail', href: '#' },
    ],
};
