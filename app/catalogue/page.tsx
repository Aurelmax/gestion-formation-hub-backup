import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CatalogueClient from '@/components/client/CatalogueClient';
import WordPressFAQ from '@/components/wordpress/WordPressFAQ';

export const metadata: Metadata = {
  title: 'Catalogue des Formations | GestionMax',
  description: 'Découvrez notre catalogue complet de formations professionnelles. Filtrez par catégorie et trouvez la formation qui vous correspond.',
  keywords: ['formations', 'catalogue', 'formations professionnelles', 'développement', 'bureautique', 'management'],
  openGraph: {
    title: 'Catalogue des Formations | GestionMax',
    description: 'Découvrez notre catalogue complet de formations professionnelles.',
    url: 'https://votresite.com/catalogue',
    siteName: 'GestionMax',
    locale: 'fr_FR',
    type: 'website',
  },
};

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

        {/* Section FAQ WordPress */}
        <WordPressFAQ />
        
      </main>
      
      <Footer />
    </div>
  );
}
