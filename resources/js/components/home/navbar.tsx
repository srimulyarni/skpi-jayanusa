import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import jayanusaLogo from '@/assets/images/jayanusa.webp';
import { Button } from '@/components/ui/button';

export function Navbar() {
    const { auth } = usePage<any>().props;
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const dashboardHref = auth.user ? `/${auth.user.role}/dashboard` : '/dashboard';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);

            const sections = ['home', 'fitur', 'alur', 'faq'];
            const scrollPosition = window.scrollY + 100;

            for (const section of sections) {
                const element = document.getElementById(section);

                if (element) {
                    const offsetTop = element.offsetTop;
                    const offsetBottom = offsetTop + element.offsetHeight;

                    if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
                        setActiveSection(section);
                        break;
                    }
                }
            }

            if (window.scrollY < 100) {
                setActiveSection('home');
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { label: 'Home', href: '#home', id: 'home' },
        { label: 'Fitur', href: '#fitur', id: 'fitur' },
        { label: 'Alur', href: '#alur', id: 'alur' },
        { label: 'FAQ', href: '#faq', id: 'faq' },
        { label: 'Tutorial', href: '/tutorial', id: 'tutorial' },
    ];

    return (
        <nav className="sticky top-0 z-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className={`transition-all duration-300 ${isScrolled ? 'my-4' : 'my-0'}`}>
                    <div
                        className={`flex h-16 items-center justify-between bg-background px-6 transition-all duration-300 ${
                            isScrolled
                                ? 'rounded-full shadow-lg ring-1 ring-black/5'
                                : 'rounded-none border-b backdrop-blur supports-[backdrop-filter]:bg-background/60'
                        }`}
                    >
                        <Link href="/" className="flex items-center gap-2">
                            <img src={jayanusaLogo} alt="Jayanusa" className="h-10 w-10" />
                            <span className="text-sm font-bold tracking-tight">Universitas Jayanusa</span>
                        </Link>

                        <div className="hidden items-center gap-2 md:flex">
                            {navItems.map((item) =>
                                item.href.startsWith('/') ? (
                                    <Link key={item.id} href={item.href}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="rounded-full"
                                        >
                                            {item.label}
                                        </Button>
                                    </Link>
                                ) : (
                                    <a key={item.id} href={item.href}>
                                        <Button
                                            variant={activeSection === item.id ? 'default' : 'ghost'}
                                            size="sm"
                                            className="rounded-full"
                                        >
                                            {item.label}
                                        </Button>
                                    </a>
                                ),
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Link href={dashboardHref}>
                                    <Button size="sm" className="rounded-full">
                                        Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/mahasiswa/login">
                                    <Button size="sm" className="rounded-full">
                                        Login
                                    </Button>
                                </Link>
                            )}
                            <button
                                className="flex h-9 w-9 items-center justify-center rounded-md border transition-colors hover:bg-muted md:hidden"
                                onClick={() => setIsMobileOpen(!isMobileOpen)}
                            >
                                {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isMobileOpen && (
                <div className="border-b bg-background px-4 py-4 shadow-lg md:hidden">
                    <div className="flex flex-col gap-2">
                        {navItems.map((item) =>
                            item.href.startsWith('/') ? (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                                    onClick={() => setIsMobileOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <a
                                    key={item.id}
                                    href={item.href}
                                    className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                                    onClick={() => setIsMobileOpen(false)}
                                >
                                    {item.label}
                                </a>
                            ),
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
