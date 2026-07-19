import { Head } from '@inertiajs/react';
import { Printer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Kategori = {
    id: number; nama_kategori: string; status: string;
};

export default function LaporanKategori({ data }: { data: Kategori[] }) {
    return (
        <>
            <Head title="Laporan Kategori" />
            <div className="space-y-4 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Laporan Kategori Kegiatan</h1>
                    <Button variant="outline" size="sm" onClick={() => window.open('/validator/laporan/kategori/pdf', '_blank')}>
                        <Printer className="mr-1 h-4 w-4" /> Cetak PDF
                    </Button>
                </div>

                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">No</TableHead>
                                <TableHead>Nama Kategori</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">Tidak ada data</TableCell></TableRow>
                            ) : data.map((k, i) => (
                                <TableRow key={k.id}>
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell className="font-medium">{k.nama_kategori}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{k.status}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <p className="text-sm text-muted-foreground">Total: {data.length} kategori</p>
            </div>
        </>
    );
}

LaporanKategori.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/validator/dashboard' },
        { title: 'Laporan Kategori', href: '/validator/laporan/kategori' },
    ],
};
