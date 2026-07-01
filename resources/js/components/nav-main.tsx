import { Link } from '@inertiajs/react';
import { toast } from 'sonner';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ label = 'Menu', items = [] }: { label?: string; items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild={!item.disabled}
                            isActive={isCurrentUrl(item.href)}
                            tooltip={{ children: item.disabled ? (item.disabledMessage ?? 'Lengkapi profil terlebih dahulu') : item.title }}
                            onClick={item.disabled ? () => toast.warning(item.disabledMessage ?? 'Lengkapi profil terlebih dahulu') : undefined}
                            className={item.disabled ? 'cursor-not-allowed opacity-50' : ''}
                        >
                            {item.disabled ? (
                                <>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </>
                            ) : (
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            )}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
