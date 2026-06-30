import { Link, usePage } from '@inertiajs/react';
import {
    Award,
    BookOpen,
    Building2,
    FileText,
    LayoutGrid,
    Package,
    Printer,
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

const navByRole: Record<string, NavGroup[]> = {
    mahasiswa: [
        {
            label: 'Menu',
            items: [
                { title: 'Dashboard', href: '/mahasiswa/dashboard', icon: LayoutGrid },
                { title: 'Profil Saya', href: '/mahasiswa/profil', icon: User },
            ],
        },
    ],
    akademis: [
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
                { title: 'Pengambilan', href: '/akademis/pengambilan', icon: Package },
                { title: 'Terbitkan SKPI', href: '/akademis/skpi', icon: Award },
            ],
        },
        {
            label: 'Laporan',
            items: [
                { title: 'Laporan', href: '/akademis/laporan', icon: Printer },
            ],
        },
    ],
    ketua: [
        {
            label: 'Menu',
            items: [
                { title: 'Dashboard', href: '/ketua/dashboard', icon: LayoutGrid },
                { title: 'Laporan', href: '/ketua/laporan', icon: Printer },
            ],
        },
    ],
};

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const role = auth?.user?.role ?? 'mahasiswa';
    const navGroups = navByRole[role] ?? [];
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
