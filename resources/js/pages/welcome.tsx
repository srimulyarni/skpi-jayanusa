import { Head } from '@inertiajs/react';
import { AlurSection } from '@/components/home/alur-section';
import { CtaSection } from '@/components/home/cta-section';
import { FaqSection } from '@/components/home/faq-section';
import { FeaturesSection } from '@/components/home/features-section';
import { Footer } from '@/components/home/footer';
import { HeroSection } from '@/components/home/hero-section';
import { Navbar } from '@/components/home/navbar';

export default function Welcome() {
    return (
        <>
            <Head title="SKPI Jayanusa" />

            <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
                <Navbar />
                <HeroSection />
                <FeaturesSection />
                <AlurSection />
                <FaqSection />
                <CtaSection />
                <Footer />
            </div>
        </>
    );
}

Welcome.layout = (page: any) => page;
