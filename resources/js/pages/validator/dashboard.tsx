import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Award,
    Calendar,
    ClipboardCheck,
    ClipboardList,
    FileText,
    Layers,
    Package,
    TrendingUp,
} from 'lucide-react';
import { Bar, BarChart, XAxis, YAxis, Pie, PieChart, Cell, Area, AreaChart, CartesianGrid } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent  } from '@/components/ui/chart';
import type {ChartConfig} from '@/components/ui/chart';
import { useTour } from '@/hooks/use-tour';

type Kpi = {
    aktivitas_menunggu: number;
    pengajuan_menunggu: number;
    skpi_terbit_bulan_ini: number;
    belum_diambil: number;
};

type PeriodeAktif = {
    id: number;
    nama: string;
    kode: string;
    tgl_mulai: string;
    tgl_selesai: string;
    sisa_hari: number;
    max_aktivitas: number | null;
} | null;

type RecentActivity = {
    waktu: string;
    tanggal: string;
    nama: string;
    aksi: string;
    tipe: string;
};

type StatItem = { nama: string; total: number };
type StatusItem = { status: string; total: number };
type TrendItem = { bulan: string; pengajuan: number; terbit: number };

const kategoriChartConfig = {
    total: { label: 'Aktivitas', color: 'var(--chart-1)' },
} satisfies ChartConfig;

const statusChartConfig = {
    menunggu: { label: 'Menunggu', color: '#eab308' },
    disetujui: { label: 'Disetujui', color: '#22c55e' },
    ditolak: { label: 'Ditolak', color: '#ef4444' },
} satisfies ChartConfig;

const trendChartConfig = {
    pengajuan: { label: 'Pengajuan', color: 'var(--chart-1)' },
    terbit: { label: 'Terbit', color: 'var(--chart-2)' },
} satisfies ChartConfig;

const STATUS_COLORS: Record<string, string> = {
    menunggu: '#eab308',
    disetujui: '#22c55e',
    ditolak: '#ef4444',
};

export default function ValidatorDashboard({
    kpi = { aktivitas_menunggu: 0, pengajuan_menunggu: 0, skpi_terbit_bulan_ini: 0, belum_diambil: 0 },
    periodeAktif = null,
    recentActivities = [],
    statKategori = [],
    statStatus = [],
    trendBulanan = [],
}: {
    kpi: Kpi;
    periodeAktif: PeriodeAktif;
    recentActivities: RecentActivity[];
    statKategori: StatItem[];
    statStatus: StatusItem[];
    trendBulanan: TrendItem[];
}) {
    useTour({
        tourKey: 'has_seen_validator_dashboard_tour',
        steps: [
            { element: '[data-tour="sidebar"]', popover: { title: 'Menu Navigasi', description: 'Gunakan menu di samping untuk mengelola data.', side: 'right', align: 'start' } },
            { element: '[data-tour="kpi-cards"]', popover: { title: 'Kartu KPI', description: 'Ringkasan data yang perlu perhatian Anda.', side: 'bottom', align: 'start' } },
        ],
    });

    const kpiCards = [
        { label: 'Aktivitas Menunggu', value: kpi.aktivitas_menunggu, icon: ClipboardList, color: 'text-yellow-600', bg: 'bg-yellow-50', link: '/validator/validasi-aktivitas' },
        { label: 'Pengajuan Menunggu', value: kpi.pengajuan_menunggu, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', link: '/validator/skpi' },
        { label: 'SKPI Terbit (Bulan Ini)', value: kpi.skpi_terbit_bulan_ini, icon: Award, color: 'text-green-600', bg: 'bg-green-50', link: '/validator/skpi' },
        { label: 'Belum Diambil', value: kpi.belum_diambil, icon: Package, color: 'text-red-600', bg: 'bg-red-50', link: '/validator/pengambilan' },
    ];

    const quickActions = [
        { label: 'Validasi Aktivitas', href: '/validator/validasi-aktivitas', icon: ClipboardCheck, count: kpi.aktivitas_menunggu },
        { label: 'Terbitkan SKPI', href: '/validator/skpi', icon: FileText, count: kpi.pengajuan_menunggu },
        { label: 'Pengambilan', href: '/validator/pengambilan', icon: Package, count: kpi.belum_diambil },
        { label: 'Periode SKPI', href: '/validator/periode-skpi', icon: Calendar, count: null },
    ];

    const tipeColors: Record<string, string> = {
        pengajuan: 'bg-blue-100 text-blue-700',
        disetujui: 'bg-green-100 text-green-700',
        ditolak: 'bg-red-100 text-red-700',
        skpi: 'bg-purple-100 text-purple-700',
    };

    return (
        <>
            <Head title="Dashboard Validator" />

            <div className="space-y-6 p-4 md:p-6">
                <h1 className="text-2xl font-semibold">Dashboard</h1>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-tour="kpi-cards">
                    {kpiCards.map((card) => (
                        <Link key={card.label} href={card.link}>
                            <Card className="transition-shadow hover:shadow-md">
                                <CardContent className="flex items-center gap-4 p-4">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.bg}`}>
                                        <card.icon className={`h-6 w-6 ${card.color}`} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{card.value}</p>
                                        <p className="text-xs text-muted-foreground">{card.label}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Calendar className="h-4 w-4" /> Periode Aktif
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {periodeAktif ? (
                                <div className="space-y-3">
                                    <div>
                                        <p className="font-medium">{periodeAktif.nama}</p>
                                        <p className="text-sm text-muted-foreground">Kode: {periodeAktif.kode}</p>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Mulai</span>
                                        <span>{periodeAktif.tgl_mulai}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Selesai</span>
                                        <span>{periodeAktif.tgl_selesai}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Sisa</span>
                                        <Badge variant={periodeAktif.sisa_hari <= 7 ? 'destructive' : periodeAktif.sisa_hari <= 14 ? 'secondary' : 'default'}>
                                            {periodeAktif.sisa_hari} hari
                                        </Badge>
                                    </div>
                                    {periodeAktif.max_aktivitas != null && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Max Aktivitas</span>
                                            <span className="font-medium">{periodeAktif.max_aktivitas}</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Tidak ada periode aktif</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Layers className="h-4 w-4" /> Aksi Cepat
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {quickActions.map((action) => (
                                    <Link key={action.label} href={action.href}>
                                        <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                                            <div className="flex items-center gap-3">
                                                <action.icon className="h-5 w-5 text-muted-foreground" />
                                                <span className="text-sm font-medium">{action.label}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {action.count != null && action.count > 0 && (
                                                    <Badge variant="secondary">{action.count}</Badge>
                                                )}
                                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-5">
                    <Card className="lg:col-span-3">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <TrendingUp className="h-4 w-4" /> Trend 6 Bulan Terakhir
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={trendChartConfig} className="h-[250px] w-full">
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

                    <Card className="lg:col-span-2">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Status Aktivitas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={statusChartConfig} className="h-[250px] w-full">
                                <PieChart>
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Pie data={statStatus} dataKey="total" nameKey="status" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} label={({ status, total }) => `${status}: ${total}`}>
                                        {statStatus.map((entry) => (
                                            <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? '#94a3b8'} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-5">
                    <Card className="lg:col-span-3">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Aktivitas per Kategori</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={kategoriChartConfig} className="h-[250px] w-full">
                                <BarChart data={statKategori} layout="vertical">
                                    <XAxis type="number" tickLine={false} axisLine={false} fontSize={11} />
                                    <YAxis type="category" dataKey="nama" tickLine={false} axisLine={false} width={120} fontSize={11} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="total" fill="var(--color-total)" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Aktivitas Terbaru</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentActivities.length > 0 ? recentActivities.map((item, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                                            {item.waktu}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm">
                                                <span className="font-medium">{item.nama}</span>{' '}
                                                <span className="text-muted-foreground">{item.aksi}</span>
                                            </p>
                                            <p className="text-xs text-muted-foreground">{item.tanggal}</p>
                                        </div>
                                        <Badge variant="outline" className={`shrink-0 text-[10px] ${tipeColors[item.tipe] ?? ''}`}>
                                            {item.tipe}
                                        </Badge>
                                    </div>
                                )) : (
                                    <p className="text-sm text-muted-foreground">Belum ada aktivitas</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

ValidatorDashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/validator/dashboard' }],
};
