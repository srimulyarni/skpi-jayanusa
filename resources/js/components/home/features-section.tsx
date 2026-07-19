import { motion } from 'framer-motion';
import { FileText, CheckCircle, Clock, Download, BarChart3, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const features = [
    {
        icon: FileText,
        title: 'Input Aktivitas',
        description: 'Mahasiswa dapat menginput kegiatan dan prestasi kapan saja tanpa terikat periode',
    },
    {
        icon: CheckCircle,
        title: 'Validasi Online',
        description: 'Validator memverifikasi setiap aktivitas secara digital dengan sistem approve/reject',
    },
    {
        icon: Shield,
        title: 'SKPI Digital',
        description: 'Dokumen SKPI terbit sesuai standar Permendikbudristek No. 6/2022',
    },
    {
        icon: Clock,
        title: 'Periode Fleksibel',
        description: 'Pengajuan SKPI dilakukan dalam periode yang dapat dikonfigurasi oleh admin',
    },
    {
        icon: BarChart3,
        title: 'Tracking Status',
        description: 'Pantau status pengajuan dan aktivitas secara real-time dari dashboard',
    },
    {
        icon: Download,
        title: 'PDF Download',
        description: 'Cetak dan download dokumen SKPI dalam format PDF resmi dengan kop surat',
    },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export function FeaturesSection() {
    return (
        <section id="fitur" className="py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="mb-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5 }}
                >
                    <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                        Fitur Utama
                    </Badge>
                    <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                        Kemudahan Pengelolaan SKPI
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Sistem terintegrasi untuk Mahasiswa
                    </p>
                </motion.div>

                <motion.div
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {features.map((feature, index) => (
                        <motion.div key={index} variants={item}>
                            <Card className="group h-full transition-all hover:shadow-lg">
                                <CardContent className="p-6">
                                    <motion.div
                                        className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: 'spring', stiffness: 400 }}
                                    >
                                        <feature.icon className="h-6 w-6" />
                                    </motion.div>
                                    <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
