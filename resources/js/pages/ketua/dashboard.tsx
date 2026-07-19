import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Award, Calendar, FileText, Package, TrendingUp, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { useTour } from '@/hooks/use-tour';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell, Bar, BarChart } from 'recharts';

type Summary = {
    total_mahasiswa: number;
    total_skpi_terbit: number;
    skpi_bulan_ini: number;
    pengajuan_menunggu: number;
    belum_diambil: number;
    total_aktivitas: number;
    aktivitas_disetujui: number;
};

type PeriodeAktif = {
    nama: string;
    kode: string;
    tgl_mulai: string;
    tgl_selesai: string;
    sisa_hari: number;
} | null;

type TrendItem = { bulan: string; pengajuan: number; terbit: number };
type StatusItem = { status: string; total: number };
type KategoriItem = { nama: string; total: number };

const trendConfig = {
    pengajuan: { label: 'Pengajuan', color: 'var(--chart-1)' },
    terbit: { label: 'Terbit', color: 'var(--chart-2)' },
} satisfies ChartConfig;

const statusConfig = {
    menunggu: { label: 'Menunggu', color: '#eab308' },
    disetujui: { label: 'Disetujui', color: '#22c55e' },
    ditolak: { label: 'Ditolak', color: '#ef4444' },
    dibatalkan: { label: 'Dibatalkan', color: '#94a3b8' },
} satisfies ChartConfig;

const kategoriConfig = {
    total: { label: 'Aktivitas', color: 'var(--chart-1)' },
} satisfies ChartConfig;

const STATUS_COLORS: Record<string, string> = {
    menunggu: '#eab308',
    disetujui: '#22c55e',
    ditolak: '#ef4444',
    dibatalkan: '#94a3b8',
};

export default function KetuaDashboard({
    summary = { total_mahasiswa: 0, total_skpi_terbit: 0, skpi_bulan_ini: 0, pengajuan_menunggu: 0, belum_diambil: 0, total_aktivitas: 0, aktivitas_disetujui: 0 },
    periodeAktif = null,
    trendBulanan = [],
    statPengajuan = [],
    topKategori = [],
}: {
    summary: Summary;
    periodeAktif: PeriodeAktif;
    trendBulanan: TrendItem[];
    statPengajuan: StatusItem[];
    topKategori: KategoriItem[];
}) {
    useTour({
        tourKey: 'has_seen_ketua_dashboard_tour',
        steps: [
            { element: '[data-tour="sidebar"]', popover: { title: 'Menu Navigasi', description: 'Gunakan menu di samping untuk mengakses laporan SKPI.', side: 'right', align: 'start' } },
            { element: '[data-tour="summary-cards"]', popover: { title: 'Ringkasan', description: 'Statistik keseluruhan sistem SKPI.', side: 'bottom', align: 'start' } },
        ],
    });

    const summaryCards = [
        { label: 'Total Mahasiswa', value: summary.total_mahasiswa, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'SKPI Terbit', value: summary.total_skpi_terbit, icon: Award, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'SKPI Bulan Ini', value: summary.skpi_bulan_ini, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Pengajuan Menunggu', value: summary.pengajuan_menunggu, icon: FileText, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        { label: 'Belum Diambil', value: summary.belum_diambil, icon: Package, color: 'text-red-600', bg: 'bg-red-50' },
        { label: 'Total Aktivitas', value: summary.total_aktivitas, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Aktivitas Disetujui', value: summary.aktivitas_disetujui, icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    return (
        <>
            <Head title="Dashboard Ketua" />

            <div className="space-y-6 p-4 md:p-6">
                <h1 className="text-2xl font-semibold">Dashboard Ketua</h1>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-tour="summary-cards">
                    {summaryCards.slice(0, 4).map((card) => (
                        <Card key={card.label}>
                            <CardContent className="flex items-center gap-3 p-4">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bg}`}>
                                    <card.icon className={`h-5 w-5 ${card.color}`} />
                                </div>
                                <div>
                                    <p className="text-xl font-bold">{card.value}</p>
                                    <p className="text-xs text-muted-foreground">{card.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    {summaryCards.slice(4).map((card) => (
                        <Card key={card.label}>
                            <CardContent className="flex items-center gap-3 p-4">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bg}`}>
                                    <card.icon className={`h-5 w-5 ${card.color}`} />
                                </div>
                                <div>
                                    <p className="text-xl font-bold">{card.value}</p>
                                    <p className="text-xs text-muted-foreground">{card.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Calendar className="h-4 w-4" /> Periode Aktif
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {periodeAktif ? (
                                <div className="space-y-2 text-sm">
                                    <p className="font-medium">{periodeAktif.nama}</p>
                                    <div className="flex justify-between"><span className="text-muted-foreground">Kode</span><span>{periodeAktif.kode}</span></div>
                                    <div className="flex justify-between"><span className="text-muted-foreground">Mulai</span><span>{periodeAktif.tgl_mulai}</span></div>
                                    <div className="flex justify-between"><span className="text-muted-foreground">Selesai</span><span>{periodeAktif.tgl_selesai}</span></div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Sisa</span>
                                        <Badge variant={periodeAktif.sisa_hari <= 7 ? 'destructive' : 'default'}>{periodeAktif.sisa_hari} hari</Badge>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Tidak ada periode aktif.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-3">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <TrendingUp className="h-4 w-4" /> Trend 6 Bulan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={trendConfig} className="h-[220px] w-full">
                                <AreaChart data={trendBulanan}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="bulan" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
                                    <YAxis tickLine={false} axisLine={false} fontSize={11} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Area type="monotone" dataKey="pengajuan" stroke="var(--color-pengajuan)" fill="var(--color-pengajuan)" fillOpacity={0.1} strokeWidth={2} />
                                    <Area type="monotone" dataKey="terbit" stroke="var(--color-terbit)" fill="var(--color-terbit)" fillOpacity={0.1} strokeWidth={2} />
                                </AreaChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Status Pengajuan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={statusConfig} className="h-[220px] w-full">
                                <PieChart>
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Pie data={statPengajuan} dataKey="total" nameKey="status" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} label={({ status, total }) => `${status}: ${total}`}>
                                        {statPengajuan.map((entry) => (
                                            <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? '#94a3b8'} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Top 5 Kategori Aktivitas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={kategoriConfig} className="h-[220px] w-full">
                                <BarChart data={topKategori} layout="vertical">
                                    <XAxis type="number" tickLine={false} axisLine={false} fontSize={11} />
                                    <YAxis type="category" dataKey="nama" tickLine={false} axisLine={false} width={120} fontSize={11} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="total" fill="var(--color-total)" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Akses Cepat</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                { label: 'Laporan Pengajuan', href: '/ketua/laporan/pengajuan', icon: FileText },
                                { label: 'Laporan Penerbitan', href: '/ketua/laporan/penerbitan', icon: Award },
                                { label: 'Laporan Pengambilan', href: '/ketua/laporan/pengambilan', icon: Package },
                                { label: 'Laporan Aktivitas', href: '/ketua/laporan/aktivitas', icon: TrendingUp },
                            ].map((action) => (
                                <Link key={action.label} href={action.href}>
                                    <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            <action.icon className="h-5 w-5 text-muted-foreground" />
                                            <span className="text-sm font-medium">{action.label}</span>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

KetuaDashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/ketua/dashboard' }],
};
