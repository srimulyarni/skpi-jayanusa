import { Head, usePage } from '@inertiajs/react';
import type { Auth } from '@/types';

type PageProps = { auth: Auth };

export default function KetuaDashboard() {
    const { auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Dashboard Ketua" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-semibold">
                    Selamat datang, {auth.user.username}
                </h1>
                <p className="text-muted-foreground">
                    Pantau dan cetak laporan SKPI dari menu di samping.
                </p>
            </div>
        </>
    );
}

KetuaDashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/ketua/dashboard' }],
};
