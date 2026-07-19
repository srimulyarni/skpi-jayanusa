import { Link } from '@inertiajs/react';
import jayanusaLogo from '@/assets/images/jayanusa.webp';

export function Footer() {
    return (
        <footer className="border-t bg-muted/50">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <div className="mb-4 flex items-center gap-2">
                            <img src={jayanusaLogo} alt="Jayanusa" className="h-8 w-8" />
                            <span className="text-xs font-bold tracking-tight">Universitas Jayanusa</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Sistem Informasi Surat Keterangan Pendamping Ijazah Universitas Jayanusa
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Menu</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <a href="#fitur" className="hover:text-foreground">
                                    Fitur
                                </a>
                            </li>
                            <li>
                                <a href="#alur" className="hover:text-foreground">
                                    Alur Pengajuan
                                </a>
                            </li>
                            <li>
                                <a href="#faq" className="hover:text-foreground">
                                    FAQ
                                </a>
                            </li>
                            <li>
                                <Link href="/tutorial" className="hover:text-foreground">
                                    Tutorial
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Akses</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/mahasiswa/login" className="hover:text-foreground">
                                    Login Mahasiswa
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="hover:text-foreground">
                                    Login Admin
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Kontak</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>Universitas Jayanusa</li>
                            <li>Jl. Olo Ladang No. 10, Padang</li>
                            <li>Sumatera Barat</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Sri Mulyarni &middot; Skripsi Sistem Informasi &middot; Universitas Jayanusa</p>
                </div>
            </div>
        </footer>
    );
}
