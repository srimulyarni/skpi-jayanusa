import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Calendar, ClipboardCheck, Clock, FileText, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SkpiJourneyMap } from '@/components/skpi-journey-map';
import { useTour } from '@/hooks/use-tour';

type Step = {
    label: string;
    description: string;
    status: 'done' | 'current' | 'locked';
    count: number;
    countLabel: string;
};

type Journey = {
    steps: Step[];
    currentStep: number;
    currentLabel: string;
    currentDescription: string;
};

type PeriodeAktif = {
    nama: string;
    kode: string;
    tgl_selesai: string;
    sisa_hari: number;
} | null;

type RecentActivity = {
    id: number;
    nama_kegiatan: string;
    kategori: string;
    status: string;
    waktu: string;
};

type Suggestion = {
    text: string;
    action: string | null;
    label: string | null;
    type: 'primary' | 'info' | 'warning';
};

const statusColors: Record<string, string> = {
    menunggu: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    disetujui: 'bg-green-100 text-green-800 border-green-300',
    ditolak: 'bg-red-100 text-red-800 border-red-300',
};

export default function MahasiswaDashboard({
    aktivitasStats = { total: 0, disetujui: 0, menunggu: 0, ditolak: 0 },
    journey = { steps: [], currentStep: 1, currentLabel: '', currentDescription: '' },
    periodeAktif = null,
    recentActivities = [],
    suggestions = [],
}: {
    aktivitasStats: { total: number; disetujui: number; menunggu: number; ditolak: number };
    journey: Journey;
    periodeAktif: PeriodeAktif;
    recentActivities: RecentActivity[];
    suggestions: Suggestion[];
}) {
    useTour({
        tourKey: 'has_seen_mahasiswa_dashboard_tour',
        steps: [
            { element: '[data-tour="sidebar"]', popover: { title: 'Menu Navigasi', description: 'Gunakan menu di samping untuk mengakses fitur-fitur.', side: 'right', align: 'start' } },
            { element: '[data-tour="journey-map"]', popover: { title: 'Alur SKPI', description: 'Ini adalah progres pengajuan SKPI Anda. Ikuti langkah-langkahnya.', side: 'bottom', align: 'start' } },
        ],
    });

    return (
        <>
            <Head title="Dashboard" />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Dashboard</h1>
                    <Button asChild>
                        <Link href="/mahasiswa/aktivitas/create"><Plus className="mr-2 h-4 w-4" /> Tambah Aktivitas</Link>
                    </Button>
                </div>

                <Card data-tour="journey-map">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <FileText className="h-4 w-4" /> Alur Pengajuan SKPI
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <SkpiJourneyMap steps={journey.steps} />

                        <div className="rounded-lg border bg-muted/30 p-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                                    <span className="text-sm font-bold">{journey.currentStep}</span>
                                </div>
                                <div>
                                    <p className="font-medium">Langkah {journey.currentStep}: {journey.currentLabel}</p>
                                    <p className="text-sm text-muted-foreground">{journey.currentDescription}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                                <ClipboardCheck className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xl font-bold">{aktivitasStats.total}</p>
                                <p className="text-xs text-muted-foreground">Total Aktivitas</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                <ClipboardCheck className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xl font-bold">{aktivitasStats.disetujui}</p>
                                <p className="text-xs text-muted-foreground">Disetujui</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50">
                                <Clock className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-xl font-bold">{aktivitasStats.menunggu}</p>
                                <p className="text-xs text-muted-foreground">Menunggu</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
                                <FileText className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-xl font-bold">{aktivitasStats.ditolak}</p>
                                <p className="text-xs text-muted-foreground">Ditolak</p>
                            </div>
                        </CardContent>
                    </Card>
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
                                <div className="space-y-2 text-sm">
                                    <p className="font-medium">{periodeAktif.nama}</p>
                                    <div className="flex justify-between"><span className="text-muted-foreground">Kode</span><span>{periodeAktif.kode}</span></div>
                                    <div className="flex justify-between"><span className="text-muted-foreground">Deadline</span><span>{periodeAktif.tgl_selesai}</span></div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Sisa</span>
                                        <Badge variant={periodeAktif.sisa_hari <= 7 ? 'destructive' : 'default'}>{periodeAktif.sisa_hari} hari</Badge>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Tidak ada periode aktif saat ini.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Yang Perlu Dilakukan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {suggestions.length > 0 ? (
                                <div className="space-y-2">
                                    {suggestions.map((s, i) => (
                                        <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                                            <p className="text-sm">{s.text}</p>
                                            {s.action && s.label && (
                                                <Button size="sm" variant={s.type === 'primary' ? 'default' : 'outline'} asChild>
                                                    <Link href={s.action}>{s.label} <ArrowRight className="ml-1 h-3 w-3" /></Link>
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Tidak ada yang perlu dilakukan saat ini.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between text-base">
                            <span>Aktivitas Terbaru</span>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/mahasiswa/aktivitas">Lihat Semua <ArrowRight className="ml-1 h-3 w-3" /></Link>
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentActivities.length > 0 ? (
                            <div className="space-y-2">
                                {recentActivities.map((a) => (
                                    <div key={a.id} className="flex items-center justify-between rounded-lg border p-3">
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">{a.nama_kegiatan}</p>
                                            <p className="text-xs text-muted-foreground">{a.kategori} - {a.waktu}</p>
                                        </div>
                                        <Badge variant="outline" className={statusColors[a.status] ?? ''}>{a.status}</Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Belum ada aktivitas.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

MahasiswaDashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/mahasiswa/dashboard' }],
};
