import { Head, Link, usePage } from '@inertiajs/react';
import { Search, ShieldCheck } from 'lucide-react';
import jayanusaLogo from '@/assets/images/jayanusa.webp';

export default function Welcome() {
    const { auth } = usePage<any>().props;

    const dashboardHref = auth.user ? `/${auth.user.role}/dashboard` : '/dashboard';

    return (
        <div className="h-screen flex flex-col bg-[#ffffff] text-[#0a0b0d] dark:bg-[#0a0b0d] dark:text-[#ffffff] selection:bg-[#0052ff] selection:text-white font-sans overflow-hidden">
            <Head title="SKPI Jayanusa" />

            {/* Navigation */}
            <nav className="mx-auto w-full max-w-[1280px] flex h-20 items-center justify-between px-6 lg:px-12 shrink-0">
                <div className="flex items-center gap-3">
                    <img src={jayanusaLogo} alt="Jayanusa Logo" className="h-8 w-auto" />
                    <span className="text-lg font-semibold tracking-tight">Universitas Jayanusa</span>
                </div>
                <div className="flex items-center gap-6">
                    {auth.user ? (
                        <Link
                            href={dashboardHref}
                            className="bg-[#0052ff] text-white px-5 py-2 rounded-[56px] text-sm font-semibold hover:bg-[#578bfa] transition-all duration-200 active:scale-[0.98]"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <Link
                            href="/mahasiswa/login"
                            className="text-[#0a0b0d] dark:text-[#ffffff] text-sm font-medium hover:text-[#0052ff] transition-colors"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </nav>

            {/* Main Content - Centered */}
            <main className="flex-grow flex items-center justify-center px-6">
                <div className="mx-auto max-w-[1280px] w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 space-y-8 lg:pr-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0052ff]/5 text-[#0052ff] text-xs font-bold tracking-wider uppercase">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Universitas Jayanusa
                        </div>
                        <h1 className="text-[52px] lg:text-[72px] leading-[1.05] font-bold tracking-tighter text-[#0a0b0d] dark:text-[#ffffff]">
                            Surat Keterangan Pendamping Ijazah.
                        </h1>
                        <p className="text-lg lg:text-xl text-[#706f6c] dark:text-[#A1A09A] max-w-[50ch] leading-[1.6]">
                            Verifikasi data capaian pembelajaran dan kompetensi lulusan Jayanusa secara digital dan aman.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <Link
                                href="/mahasiswa/login"
                                className="inline-flex items-center justify-center gap-2 bg-[#0052ff] text-white px-8 py-4 rounded-[56px] text-lg font-bold hover:bg-[#578bfa] transition-all duration-300 shadow-lg shadow-blue-500/20 active:translate-y-[1px]"
                            >
                                <Search className="w-5 h-5" />
                                Login Untuk Pengajuan
                            </Link>
                        </div>
                    </div>
                    
                    <div className="hidden lg:col-span-5 lg:flex justify-end">
                        <div className="relative">
                            <div className="absolute -inset-10 bg-[#0052ff]/10 blur-[100px] rounded-full" />
                            <img 
                                src={jayanusaLogo} 
                                alt="Jayanusa Logo Large" 
                                className="relative w-72 h-auto animate-fade-in opacity-90 drop-shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mx-auto w-full max-w-[1280px] px-6 lg:px-12 py-8 shrink-0">
                <div className="border-t border-[rgba(91,97,110,0.1)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 opacity-40">
                        <img src={jayanusaLogo} alt="Logo" className="h-4 w-auto grayscale" />
                        <span className="text-xs font-medium uppercase tracking-widest">© 2026 Sri Mulyarni • Skripsi Jayanusa</span>
                    </div>
                    <div className="flex gap-6 text-xs font-bold uppercase tracking-widest text-[#706f6c] dark:text-[#A1A09A]">
                        <a href="#" className="hover:text-[#0052ff] transition-colors">Support</a>
                        <a href="#" className="hover:text-[#0052ff] transition-colors">Privacy</a>
                        <a href="#" className="hover:text-[#0052ff] transition-colors">Security</a>
                    </div>
                </div>
            </footer>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 0.9; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out forwards;
                }
            `}</style>
        </div>
    );
}

Welcome.layout = (page: any) => page;
