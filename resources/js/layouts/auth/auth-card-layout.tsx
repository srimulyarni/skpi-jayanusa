import type { PropsWithChildren, ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';

export default function AuthCardLayout({
    children,
    title,
    description,
    brandingContent,
    brandingPosition = 'right',
    footer,
}: PropsWithChildren<{
    title?: string;
    description?: string;
    brandingContent?: ReactNode;
    brandingPosition?: 'left' | 'right';
    footer?: ReactNode;
}>) {
    const isLeft = brandingPosition === 'left';

    return (
        <div className="bg-muted/30 flex min-h-svh items-center justify-center p-4 md:p-6">
            <div className="bg-background relative flex h-[620px] w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl">
                {brandingContent && (
                    <div
                        className={`from-primary to-primary/90 absolute inset-y-0 z-10 hidden w-1/2 flex-col items-center justify-center bg-gradient-to-br p-12 text-white md:flex ${
                            isLeft ? 'left-0' : 'right-0'
                        }`}
                    >
                        <div className="relative z-10 flex flex-col items-center justify-center space-y-6 text-center">
                            <div className="absolute inset-0 overflow-hidden opacity-10">
                                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white" />
                                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white" />
                            </div>

                            <div className="relative rounded-2xl bg-white p-4 shadow-xl">
                                <img src="/assets/images/jayanusa.webp" alt="Logo Jayanusa" className="h-48 w-48 object-contain" />
                            </div>

                            <div className="relative space-y-2">
                                <p className="text-xl font-bold uppercase tracking-widest text-white">
                                    Universitas Jayanusa
                                </p>
                                <div className="mx-auto h-px w-3/4 bg-white/30" />
                                <p className="text-sm font-medium italic text-yellow-300">
                                    Sistem Informasi SKPI
                                </p>
                            </div>

                            <p className="relative max-w-xs text-sm text-white/80">
                                Surat Keterangan Pendamping Ijazah untuk pengelolaan aktivitas, prestasi, dan kegiatan mahasiswa.
                            </p>
                        </div>
                    </div>
                )}

                <div
                    className={`flex w-full flex-col p-8 md:w-1/2 md:p-12 ${isLeft ? 'md:ml-auto' : 'md:mr-auto'}`}
                >
                    <div className="mb-6 flex flex-col items-center gap-4 md:items-start">
                        <div className="space-y-1 text-center md:text-left">
                            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                            {description && <p className="text-muted-foreground text-sm">{description}</p>}
                        </div>
                    </div>

                    <div className="flex-1">{children}</div>

                    {footer && (
                        <div className="mt-4 text-center">{footer}</div>
                    )}
                </div>
            </div>
            <Toaster />
        </div>
    );
}
