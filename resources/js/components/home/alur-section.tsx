import { motion, useScroll, useTransform } from 'framer-motion';
import { FileText, CheckCircle, FolderCheck, Printer } from 'lucide-react';
import { useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
    {
        number: '01',
        icon: FileText,
        title: 'Input Aktivitas',
        description: 'Mahasiswa menambahkan kegiatan dan prestasi beserta link bukti Google Drive',
    },
    {
        number: '02',
        icon: CheckCircle,
        title: 'Validasi Validator',
        description: 'Validator memverifikasi dan menyetujui aktivitas yang telah diinput',
    },
    {
        number: '03',
        icon: FolderCheck,
        title: 'Pilih & Ajukan SKPI',
        description: 'Mahasiswa memilih aktivitas yang sudah disetujui untuk diajukan ke SKPI',
    },
    {
        number: '04',
        icon: Printer,
        title: 'Cetak PDF SKPI',
        description: 'Validator menerbitkan dan mencetak dokumen SKPI dalam format PDF resmi',
    },
];

export function AlurSection() {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const blobY = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const blob2Y = useTransform(scrollYProgress, [0, 1], [50, -150]);

    return (
        <section ref={ref} id="alur" className="relative overflow-hidden py-20">
            <motion.div
                className="absolute -right-32 top-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
                style={{ y: blobY }}
            />
            <motion.div
                className="absolute -left-32 bottom-1/4 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"
                style={{ y: blob2Y }}
            />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="mb-16 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5 }}
                >
                    <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                        Alur Pengajuan
                    </Badge>
                    <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                        4 Langkah Mudah
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Proses pengajuan SKPI yang sederhana dan transparan
                    </p>
                </motion.div>

                <div className="relative">
                    <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-border lg:block" />

                    <div className="space-y-12 lg:space-y-0">
                        {steps.map((step, index) => {
                            const isEven = index % 2 === 0;

                            return (
                                <motion.div
                                    key={index}
                                    className={`relative flex items-center lg:gap-8 ${
                                        isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                                    }`}
                                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.6, delay: index * 0.15 }}
                                >
                                    <div className={`flex-1 ${isEven ? 'lg:text-right' : 'lg:text-left'}`}>
                                        <Card className="transition-all hover:shadow-lg">
                                            <CardContent className="p-6">
                                                <div className={`flex items-start gap-4 ${isEven ? 'lg:flex-row-reverse lg:text-right' : ''}`}>
                                                    <motion.div
                                                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                                        transition={{ type: 'spring', stiffness: 400 }}
                                                    >
                                                        <step.icon className="h-6 w-6" />
                                                    </motion.div>
                                                    <div>
                                                        <h3 className="mb-1 text-lg font-semibold">{step.title}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {step.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <motion.div
                                        className="hidden lg:flex"
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.15 + 0.2, type: 'spring', stiffness: 300 }}
                                    >
                                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground shadow-lg">
                                            {step.number}
                                        </div>
                                    </motion.div>

                                    <div className="flex-1 hidden lg:block" />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
