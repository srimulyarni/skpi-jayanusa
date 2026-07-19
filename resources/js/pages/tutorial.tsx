import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, FolderCheck, Printer, Play } from 'lucide-react';
import { Footer } from '@/components/home/footer';
import { Navbar } from '@/components/home/navbar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
    {
        number: '01',
        icon: FileText,
        title: 'Login dengan NOBP',
        description: 'Masukkan NOBP mahasiswa Anda untuk mengakses sistem. Pastikan data Anda terdaftar di sistem akademik.',
    },
    {
        number: '02',
        icon: FileText,
        title: 'Input Aktivitas & Prestasi',
        description: 'Tambahkan kegiatan dan prestasi yang pernah diikuti. Lampirkan link Google Drive sebagai bukti.',
    },
    {
        number: '03',
        icon: CheckCircle,
        title: 'Tunggu Validasi',
        description: 'Validator akan memverifikasi setiap aktivitas yang diinput. Status dapat dipantau dari dashboard.',
    },
    {
        number: '04',
        icon: FolderCheck,
        title: 'Pilih Aktivitas untuk SKPI',
        description: 'Setelah periode SKPI aktif, pilih aktivitas yang sudah disetujui untuk diajukan ke SKPI.',
    },
    {
        number: '05',
        icon: Printer,
        title: 'Cetak PDF SKPI',
        description: 'Setelah SKPI diterbitkan oleh validator, Anda dapat mengunduh dokumen SKPI dalam format PDF.',
    },
];

export default function Tutorial() {
    return (
        <>
            <Head title="Tutorial - SKPI Jayanusa" />

            <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
                <Navbar />

                <section className="py-16">
                    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            className="mb-12 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                                Video Tutorial
                            </Badge>
                            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                                Cara Menggunakan SKPI
                            </h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Panduan lengkap penggunaan sistem SKPI Jayanusa
                            </p>
                        </motion.div>

                        <motion.div
                            className="mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Card className="overflow-hidden shadow-lg">
                                <CardContent className="p-0">
                                    <div className="relative aspect-video w-full bg-muted">
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <Play className="h-10 w-10" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-lg font-semibold">Video Tutorial</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Video akan segera tersedia
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            className="mb-12 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                                Langkah-Langkah Pengajuan
                            </h2>
                            <p className="mt-4 text-muted-foreground">
                                Ikuti langkah berikut untuk mengajukan SKPI
                            </p>
                        </motion.div>

                        <div className="space-y-6">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                >
                                    <Card className="transition-all hover:shadow-md">
                                        <CardContent className="flex items-start gap-4 p-6">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                                {step.number}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="mb-1 text-lg font-semibold">{step.title}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {step.description}
                                                </p>
                                            </div>
                                            <step.icon className="h-5 w-5 shrink-0 text-primary/40" />
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
}

Tutorial.layout = (page: any) => page;
