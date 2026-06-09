import { Head, usePage } from '@inertiajs/react';
import type { Auth } from '@/types';

type PageProps = { auth: Auth };

export default function AkademisDashboard() {
    const { auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Dashboard Akademis" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-semibold">
                    Selamat datang, {auth.user.username}
                </h1>
                <p className="text-muted-foreground">
                    Kelola data mahasiswa, pengajuan SKPI, dan penerbitan dokumen dari menu di samping.
                </p>
            </div>
        </>
    );
}

AkademisDashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/akademis/dashboard' }],
};
