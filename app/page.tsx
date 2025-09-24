import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import CatalogueClient from '@/components/client/CatalogueClient';
import WordPressFAQ from '@/components/wordpress/WordPressFAQ';
import FormationsAdaptabilite from '@/components/catalogue/FormationsAdaptabilite';
import { generateMetadata as generateSeoMetadata } from '@/lib/seo';
import { SEO_CONFIG } from '@/lib/constants';

export const metadata = generateSeoMetadata({
  title: 'Centre de Formation Professionnelle Certifié Qualiopi',
  description: 'Organisme de formation professionnelle certifié Qualiopi. Catalogue complet de formations WordPress, développement web, bureautique et management. Formations éligibles CPF pour entreprises et particuliers.',
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
    'management'
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

        {/* Section principale : Catalogue complet */}
        <section id="catalogue" className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Notre Catalogue de Formations
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                Découvrez notre catalogue complet de formations professionnelles certifiées Qualiopi.
                Formations éligibles CPF, adaptées aux entreprises et particuliers.
              </p>
            </div>
          </div>
        </section>

        {/* Catalogue complet intégré */}
        <section className="bg-gray-50">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <CatalogueClient />
            </div>
          </div>
        </section>

        {/* Section Adaptabilité des formations */}
        <FormationsAdaptabilite />

        {/* Section FAQ WordPress */}
        <WordPressFAQ />
      </main>

      <Footer />
    </div>
  );
}
