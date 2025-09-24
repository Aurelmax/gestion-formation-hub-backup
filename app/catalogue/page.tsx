import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CatalogueClient from '@/components/client/CatalogueClient';
import WordPressFAQ from '@/components/wordpress/WordPressFAQ';
import FormationsAdaptabilite from '@/components/catalogue/FormationsAdaptabilite';
import { generateMetadata as generateSeoMetadata } from '@/lib/seo';
import { SEO_CONFIG } from '@/lib/constants';

export const metadata = generateSeoMetadata({
  title: 'Catalogue des Formations',
  description: 'Découvrez notre catalogue complet de formations professionnelles certifiées Qualiopi. Formations WordPress, développement web, bureautique et management. Filtrez par catégorie et trouvez la formation qui vous correspond.',
  url: '/catalogue',
  image: SEO_CONFIG.images.ogCatalogue,
  keywords: [
    'catalogue formations',
    'formations professionnelles',
    'WordPress',
    'développement web',
    'bureautique',
    'management',
    'Qualiopi',
    'CPF'
  ],
});

export default function CataloguePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Notre Catalogue de Formations</h1>
            <p className="mt-2 text-sm text-gray-600">
              Découvrez nos formations professionnelles adaptées à vos besoins
            </p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <CatalogueClient />
          </div>
        </div>

        {/* Section Adaptabilité des formations */}
        <FormationsAdaptabilite />

        {/* Section FAQ WordPress */}
        <WordPressFAQ />
        
      </main>
      
      <Footer />
    </div>
  );
}
