import { Link, usePage } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';

export function CtaSection() {
    const { auth } = usePage<any>().props;
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const bgY = useTransform(scrollYProgress, [0, 1], [30, -30]);
    const gridY = useTransform(scrollYProgress, [0, 1], [20, -20]);

    return (
        <section ref={ref} className="py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-blue-600 px-8 py-16 text-center shadow-2xl sm:px-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            y: gridY,
                            backgroundImage:
                                'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                            backgroundSize: '24px 24px',
                        }}
                    />
                    <motion.div
                        className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
                        style={{ y: bgY }}
                    />
                    <motion.div
                        className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
                        style={{ y: bgY }}
                    />

                    <div className="relative">
                        <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Siap Mengajukan SKPI?
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
                            Login sekarang untuk mulai menginput aktivitas dan mengajukan SKPI Anda
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <Link
                                href={auth.user ? `/${auth.user.role}/dashboard` : '/mahasiswa/login'}
                            >
                                <Button size="lg" variant="secondary" className="rounded-full">
                                    {auth.user ? 'Buka Dashboard' : 'Login Sekarang'}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <a href="#fitur">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="rounded-full border-white bg-transparent text-white hover:bg-white/10"
                                >
                                    Pelajari Lebih Lanjut
                                </Button>
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
