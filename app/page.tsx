import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import CatalogueClient from '@/components/client/CatalogueClient';
import WordPressFAQ from '@/components/wordpress/WordPressFAQ';
import FormationsAdaptabilite from '@/components/catalogue/FormationsAdaptabilite';
import ArticlesCarousel from '@/components/blog/ArticlesCarousel';
import GSAPCatalogueSection from '@/components/animations/GSAPCatalogueSection';
import { generateMetadata as generateSeoMetadata } from '@/lib/seo';
import { SEO_CONFIG } from '@/lib/constants';

export const metadata = generateSeoMetadata({
  title: 'Centre de Formation Professionnelle Certifié Qualiopi',
  description: 'Organisme de formation professionnelle certifié Qualiopi. Catalogue complet de formations WordPress, développement web, bureautique et management. Blog expertise et conseils. Formations éligibles CPF pour entreprises et particuliers.',
  keywords: [
    'formation professionnelle',
    'catalogue formations',
    'WordPress',
    'développement web',
    'Qualiopi',
    'CPF',
    'organisme formation',
    'entreprise',
    'particuliers',
    'certification',
    'bureautique',
    'management',
    'blog WordPress',
    'conseils experts',
    'tutoriels',
    'actualités formation'
  ],
  image: SEO_CONFIG.images.ogCatalogue,
});

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
