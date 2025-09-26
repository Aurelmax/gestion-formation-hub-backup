'use client';

import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import CatalogueClient from '@/components/client/CatalogueClient';

// Lazy load heavy components with loading fallbacks
const WordPressFAQ = dynamic(() => import('@/components/wordpress/WordPressFAQ'), {
  loading: () => (
    <div className="flex justify-center items-center py-16">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ),
  ssr: true
});

const FormationsAdaptabilite = dynamic(() => import('@/components/catalogue/FormationsAdaptabilite'), {
  loading: () => (
    <div className="flex justify-center items-center py-16">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ),
  ssr: true
});

const ArticlesCarousel = dynamic(() => import('@/components/blog/ArticlesCarousel'), {
  loading: () => (
    <div className="flex justify-center items-center py-16">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ),
  ssr: true
});

const GSAPCatalogueSection = dynamic(() => import('@/components/animations/GSAPCatalogueSection'), {
  loading: () => (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ),
  ssr: false // GSAP animations should not be server-side rendered
});
import { generateMetadata as generateSeoMetadata } from '@/lib/seo';
import { SEO_CONFIG } from '@/lib/constants';

// Metadata moved to layout.tsx since this is now a client component

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Hero Section - Présentation rapide */}
        <HeroSection />

        {/* About Section - Pourquoi nous choisir */}
        <AboutSection />

        {/* Section principale : Catalogue complet avec GSAP */}
        <GSAPCatalogueSection />

        {/* Catalogue complet intégré */}
        <section className="bg-gray-50">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <CatalogueClient />
            </div>
          </div>
        </section>

        {/* Section Articles Récents */}
        <ArticlesCarousel />

        {/* Section Adaptabilité des formations */}
        <FormationsAdaptabilite />

        {/* Section FAQ WordPress */}
        <WordPressFAQ />
      </main>

      <Footer />
    </div>
  );
}
