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
import { NavFooter } from '@/components/nav-footer';
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

const navByRole: Record<string, NavItem[]> = {
    mahasiswa: [
        { title: 'Dashboard', href: '/mahasiswa/dashboard', icon: LayoutGrid },
        { title: 'Profil Saya', href: '/mahasiswa/profil', icon: User },
        { title: 'Pengajuan SKPI', href: '/mahasiswa/pengajuan', icon: FileText },
    ],
    akademis: [
        { title: 'Dashboard', href: '/akademis/dashboard', icon: LayoutGrid },
        { title: 'Data Mahasiswa', href: '/akademis/mahasiswa', icon: Users },
        { title: 'Pengajuan', href: '/akademis/pengajuan', icon: FileText },
        { title: 'Kategori Kegiatan', href: '/akademis/kategori', icon: Tag },
        { title: 'Identitas PT', href: '/akademis/identitas-pt', icon: Building2 },
        { title: 'Jurusan', href: '/akademis/jurusan', icon: BookOpen },
        { title: 'Pengambilan', href: '/akademis/pengambilan', icon: Package },
        { title: 'Terbitkan SKPI', href: '/akademis/skpi', icon: Award },
        { title: 'Laporan', href: '/akademis/laporan', icon: Printer },
    ],
    ketua: [
        { title: 'Dashboard', href: '/ketua/dashboard', icon: LayoutGrid },
        { title: 'Laporan', href: '/ketua/laporan', icon: Printer },
    ],
};

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const role = auth?.user?.role ?? 'mahasiswa';
    const mainNavItems = navByRole[role] ?? [];
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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
