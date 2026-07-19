import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

const faqs = [
    {
        question: 'Apa itu SKPI?',
        answer: 'SKPI (Surat Keterangan Pendamping Ijazah) adalah dokumen resmi yang memuat informasi tentang capaian pembelajaran, kompetensi, dan kegiatan/ prestasi mahasiswa selama menempuh pendidikan. Dokumen ini diatur berdasarkan Permendikbudristek No. 6/2022.',
    },
    {
        question: 'Siapa yang bisa mengajukan SKPI?',
        answer: 'SKPI hanya dapat diajukan oleh mahasiswa yang telah dinyatakan lulus uji komprehensif (kompre). Selain itu, mahasiswa harus melengkapi profil terlebih dahulu sebelum dapat mengajukan SKPI.',
    },
    {
        question: 'Kapan SKPI bisa diajukan?',
        answer: 'SKPI hanya bisa diajukan selama periode SKPI aktif yang ditentukan oleh validator. Namun, mahasiswa dapat menginput aktivitas dan prestasi kapan saja tanpa terikat periode.',
    },
    {
        question: 'Bagaimana cara menginput bukti kegiatan?',
        answer: 'Bukti kegiatan diupload melalui link Google Drive. Mahasiswa cukup menempelkan link file bukti di Google Drive pada form input aktivitas. Pastikan link dapat diakses oleh validator.',
    },
    {
        question: 'Berapa maksimal aktivitas yang ditampilkan di SKPI?',
        answer: 'Jumlah maksimal aktivitas yang ditampilkan di SKPI ditentukan oleh periode SKPI yang aktif. Default adalah 10 aktivitas, namun validator dapat mengubah batas ini per periode.',
    },
    {
        question: 'Apakah SKPI bisa dicetak ulang?',
        answer: 'Ya, mahasiswa dan validator dapat mencetak ulang SKPI kapan saja melalui sistem. Dokumen PDF yang dihasilkan menggunakan tanggal penerbitan asli, bukan tanggal cetak ulang.',
    },
];

export function FaqSection() {
    return (
        <section id="faq" className="bg-muted/30 py-20">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="mb-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5 }}
                >
                    <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                        Pertanyaan Umum
                    </Badge>
                    <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                        Masih Ada Pertanyaan?
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Berikut pertanyaan yang sering diajukan oleh mahasiswa
                    </p>
                </motion.div>

                <motion.div
                    className="rounded-2xl bg-background p-6 shadow-sm sm:p-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left font-semibold hover:text-primary">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>
            </div>
        </section>
    );
}
