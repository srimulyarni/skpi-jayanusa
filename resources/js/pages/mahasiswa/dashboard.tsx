import { Head, usePage } from '@inertiajs/react';
import type { Auth } from '@/types';

type PageProps = { auth: Auth };

export default function MahasiswaDashboard() {
    const { auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-semibold">
                    Selamat datang, {auth.user.username}
                </h1>
                <p className="text-muted-foreground">
                    Gunakan menu di samping untuk mengajukan SKPI atau melihat status pengajuan Anda.
                </p>
            </div>
        </>
    );
}

MahasiswaDashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/mahasiswa/dashboard' }],
};
