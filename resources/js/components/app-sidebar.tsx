import { Link, usePage } from '@inertiajs/react';
import {
    Award,
    BookOpen,
    Building2,
    Calendar,
    ClipboardList,
    FileText,
    LayoutGrid,
    Package,
    Send,
    Tag,
    User,
    Users,
    BarChart3,
    FileCheck,
    Hand,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Badge } from '@/components/ui/badge';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { Auth, NavItem } from '@/types';

type NavGroup = { label: string; items: NavItem[] };

const validatorNav: NavGroup[] = [
    {
        label: 'Master',
        items: [
            { title: 'Dashboard', href: '/validator/dashboard', icon: LayoutGrid },
            { title: 'Data Mahasiswa', href: '/validator/mahasiswa', icon: Users },
            { title: 'Kategori Kegiatan', href: '/validator/kategori', icon: Tag },
            { title: 'Identitas PT', href: '/validator/identitas-pt', icon: Building2 },
            { title: 'Jurusan', href: '/validator/jurusan', icon: BookOpen },
        ],
    },
    {
        label: 'Validasi',
        items: [
            { title: 'Validasi Aktivitas', href: '/validator/validasi-aktivitas', icon: ClipboardList },
        ],
    },
    {
        label: 'Transaksi',
        items: [
            { title: 'Terbitkan SKPI', href: '/validator/skpi', icon: Award },
            { title: 'Pengambilan', href: '/validator/pengambilan', icon: Package },
            { title: 'Periode SKPI', href: '/validator/periode-skpi', icon: Tag },
        ],
    },
    {
        label: 'Laporan',
        items: [
            { title: 'Laporan Kategori', href: '/validator/laporan/kategori', icon: BarChart3 },
            { title: 'Laporan Pengajuan', href: '/validator/laporan/pengajuan', icon: FileText },
            { title: 'Laporan Penerbitan SKPI', href: '/validator/laporan/penerbitan', icon: FileCheck },
            { title: 'Laporan Pengambilan', href: '/validator/laporan/pengambilan', icon: Hand },
            { title: 'Laporan Aktivitas Mahasiswa', href: '/validator/laporan/aktivitas', icon: ClipboardList },
        ],
    },
];

const ketuaNav: NavGroup[] = [
    {
        label: 'Menu',
        items: [
            { title: 'Dashboard', href: '/ketua/dashboard', icon: LayoutGrid },
        ],
    },
    {
        label: 'Laporan',
        items: [
            { title: 'Laporan Pengajuan', href: '/ketua/laporan/pengajuan', icon: FileText },
            { title: 'Laporan Penerbitan SKPI', href: '/ketua/laporan/penerbitan', icon: FileCheck },
            { title: 'Laporan Pengambilan', href: '/ketua/laporan/pengambilan', icon: Hand },
            { title: 'Laporan Aktivitas Mahasiswa', href: '/ketua/laporan/aktivitas', icon: ClipboardList },
        ],
    },
];

function getMahasiswaNav(isProfileLengkap: boolean, kompreStatus: boolean, periodeAktif: boolean): NavGroup[] {
    const canAjukan = isProfileLengkap && kompreStatus && periodeAktif;
    let disabledMessage = '';

    if (!isProfileLengkap) {
        disabledMessage = 'Lengkapi profil terlebih dahulu';
    } else if (!kompreStatus) {
        disabledMessage = 'Anda belum lulus kompre';
    } else if (!periodeAktif) {
        disabledMessage = 'Tidak ada periode SKPI aktif';
    }

    return [
        {
            label: 'Menu',
            items: [
                { title: 'Dashboard', href: '/mahasiswa/dashboard', icon: LayoutGrid },
                { title: 'Profil Saya', href: '/mahasiswa/profil', icon: User },
                { title: 'Aktivitas Saya', href: '/mahasiswa/aktivitas', icon: ClipboardList },
                {
                    title: 'Pengajuan SKPI',
                    href: '/mahasiswa/skpi',
                    icon: Send,
                    disabled: !canAjukan,
                    disabledMessage,
                },
            ],
        },
    ];
}

const navByRole: Record<string, (isProfileLengkap: boolean, kompreStatus: boolean, periodeAktif: boolean) => NavGroup[]> = {
    mahasiswa: (isProfileLengkap, kompreStatus, periodeAktif) => getMahasiswaNav(isProfileLengkap, kompreStatus, periodeAktif),
    validator: () => validatorNav,
    ketua: () => ketuaNav,
};

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const role = auth?.user?.role ?? 'mahasiswa';
    const isProfileLengkap = auth?.isProfileLengkap ?? false;
    const kompreStatus = auth?.kompreStatus ?? false;
    const periodeAktif = auth?.periodeAktif ?? false;
    const periodeInfo = auth?.periodeInfo ?? null;
    const navGroups = (navByRole[role] ?? (() => []))(isProfileLengkap, kompreStatus, periodeAktif);
    const dashboardHref = `/${role}/dashboard`;

    return (
        <Sidebar collapsible="icon" variant="inset" data-tour="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardHref} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                {periodeInfo && (
                    <SidebarGroup className="px-2 py-0">
                        <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs">
                            <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            <div className="min-w-0">
                                <p className="truncate font-medium">{periodeInfo.nama}</p>
                                <p className="text-muted-foreground">{periodeInfo.kode}</p>
                            </div>
                            <Badge variant="secondary" className="ml-auto shrink-0 text-[10px]">Aktif</Badge>
                        </div>
                    </SidebarGroup>
                )}
            </SidebarHeader>

            <SidebarContent>
                {navGroups.map((group) => (
                    <NavMain key={group.label} label={group.label} items={group.items} />
                ))}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
