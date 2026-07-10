import { Link, usePage } from '@inertiajs/react';
import {
    Award,
    BookOpen,
    Building2,
    FileText,
    LayoutGrid,
    Package,
    Printer,
    Send,
    Tag,
    User,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { Auth, NavItem } from '@/types';

type NavGroup = { label: string; items: NavItem[] };

const akademisNav: NavGroup[] = [
    {
        label: 'Master',
        items: [
            { title: 'Dashboard', href: '/akademis/dashboard', icon: LayoutGrid },
            { title: 'Data Mahasiswa', href: '/akademis/mahasiswa', icon: Users },
            { title: 'Kategori Kegiatan', href: '/akademis/kategori', icon: Tag },
            { title: 'Identitas PT', href: '/akademis/identitas-pt', icon: Building2 },
            { title: 'Jurusan', href: '/akademis/jurusan', icon: BookOpen },
        ],
    },
    {
        label: 'Transaksi',
        items: [
            { title: 'Pengajuan', href: '/akademis/pengajuan', icon: FileText },
            { title: 'Terbitkan SKPI', href: '/akademis/skpi', icon: Award },
            { title: 'Pengambilan', href: '/akademis/pengambilan', icon: Package },
        ],
    },
    {
        label: 'Laporan',
        items: [
            { title: 'Laporan', href: '', icon: Printer },
        ],
    },
];

const ketuaNav: NavGroup[] = [
    {
        label: 'Menu',
        items: [
            { title: 'Dashboard', href: '/ketua/dashboard', icon: LayoutGrid },
            { title: 'Laporan', href: '/ketua/laporan', icon: Printer },
        ],
    },
];

function getMahasiswaNav(isProfileLengkap: boolean): NavGroup[] {
    return [
        {
            label: 'Menu',
            items: [
                { title: 'Dashboard', href: '/mahasiswa/dashboard', icon: LayoutGrid },
                { title: 'Profil Saya', href: '/mahasiswa/profil', icon: User },
                {
                    title: 'Pengajuan SKPI',
                    href: '/mahasiswa/pengajuan',
                    icon: Send,
                    disabled: !isProfileLengkap,
                    disabledMessage: 'Lengkapi profil terlebih dahulu',
                },
            ],
        },
    ];
}

const navByRole: Record<string, (isProfileLengkap: boolean) => NavGroup[]> = {
    mahasiswa: (isProfileLengkap) => getMahasiswaNav(isProfileLengkap),
    akademis: () => akademisNav,
    ketua: () => ketuaNav,
};

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const role = auth?.user?.role ?? 'mahasiswa';
    const isProfileLengkap = auth?.isProfileLengkap ?? false;
    const navGroups = (navByRole[role] ?? (() => []))(isProfileLengkap);
    const dashboardHref = `/${role}/dashboard`;

    return (
        <Sidebar collapsible="icon" variant="inset">
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
