import { Link, usePage } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useRef } from 'react';
import jayanusaLogo from '@/assets/images/jayanusa.webp';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function HeroSection() {
    const { auth } = usePage<any>().props;
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    });

    const bgY = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const gridY = useTransform(scrollYProgress, [0, 1], [0, 80]);
    const logoY = useTransform(scrollYProgress, [0, 1], [0, -60]);
    const textY = useTransform(scrollYProgress, [0, 1], [0, -30]);

    return (
        <section ref={ref} id="home" className="relative overflow-hidden">
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background"
                style={{ y: bgY }}
            />
            <motion.div
                className="absolute inset-0 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]"
                style={{
                    y: gridY,
                    backgroundImage: 'radial-gradient(circle, oklch(0.417 0.191 265 / 0.08) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
            />

            <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
                    <motion.div
                        className="flex flex-col justify-center space-y-8"
                        style={{ y: textY }}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <Badge className="w-fit bg-primary/10 text-primary hover:bg-primary/20">
                                    <ShieldCheck className="mr-1 h-3 w-3" />
                                    Universitas Jayanusa
                                </Badge>
                            </motion.div>
                            <motion.h1
                                className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                Surat Keterangan{' '}
                                <span className="bg-gradient-to-r from-primary via-blue-500 to-blue-600 bg-clip-text text-transparent">
                                    Pendamping Ijazah
                                </span>
                            </motion.h1>
                            <motion.p
                                className="text-lg text-muted-foreground"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                            >
                                Verifikasi data capaian pembelajaran dan kompetensi lulusan Jayanusa secara digital dan aman.
                            </motion.p>
                        </div>

                        <motion.div
                            className="flex flex-col gap-3 sm:flex-row"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            <Link href={auth.user ? `/${auth.user.role}/dashboard` : '/mahasiswa/login'}>
                                <Button size="lg" className="w-full sm:w-auto">
                                    {auth.user ? 'Dashboard' : 'Login Untuk Pengajuan'}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <a href="#fitur">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                    Pelajari Fitur
                                </Button>
                            </a>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="relative flex items-center justify-center"
                        style={{ y: logoY }}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                    >
                        <div className="absolute -right-4 -top-4 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
                        <div className="absolute -bottom-4 -left-4 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
                        <div className="relative">
                            <motion.img
                                src={jayanusaLogo}
                                alt="Jayanusa Logo"
                                className="h-64 w-auto drop-shadow-2xl lg:h-80"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 0.9 }}
                                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
