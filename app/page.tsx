import { Metadata } from 'next';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import FormationsPreview from '@/components/FormationsPreview';
import PartenaireFormations from '@/components/PartenaireFormations';
import IllustrationSection from '@/components/IllustrationSection';
import OffreEntreprise from '@/components/OffreEntreprise';
import Footer from '@/components/Footer';
import { ArrowDownCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'GestionMax Formation Hub - Accueil',
  description: 'Centre de formation professionnelle et continue pour les entreprises et les particuliers',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Header />
      
      <main id="main-content" role="main">
        {/* Hero */}
        <div>
          <HeroSection />
        </div>
      
        {/* Séparateur visuel élégant */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
          <div className="flex flex-col items-center">
            <ArrowDownCircle className="text-blue-600 w-10 h-10 animate-bounce" />
            <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-600 to-transparent mt-8 max-w-md w-full" />
          </div>
        </div>
      
        {/* Section À propos */}
        <div className="relative z-10 bg-gradient-to-b from-white to-gray-50">
          <AboutSection />
        </div>
      
        {/* Séparateur décoratif */}
        <div className="w-full overflow-hidden">
          <svg className="w-full h-24" preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
              className="fill-gray-50"
            />
          </svg>
        </div>
      
        {/* Section Formations */}
        <div className="relative z-10 bg-white pt-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
            <h2 className="text-center text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              <span className="text-blue-700">Formations d'excellence</span>
            </h2>
            <div className="flex justify-center mb-12">
              <div className="h-1 w-24 bg-blue-600 rounded"></div>
            </div>
          </div>
          <FormationsPreview />
        </div>
      
        {/* Section Illustrations */}
        <IllustrationSection />
      
        {/* Séparateur élégant */}
        <div className="w-full overflow-hidden transform rotate-180">
          <svg className="w-full h-24" preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
              className="fill-gray-50"
            />
          </svg>
        </div>
      
        {/* Section Partenariats */}
        <div className="relative z-10 bg-gray-50 pt-6 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
            <h2 className="text-center text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              <span className="text-indigo-700">Partenariats internationaux</span>
            </h2>
            <div className="flex justify-center mb-12">
              <div className="h-1 w-24 bg-indigo-600 rounded"></div>
            </div>
          </div>
          <PartenaireFormations />
        </div>
      
        {/* Section Offre Entreprise */}
        <OffreEntreprise />
      </main>
      
      <Footer />
    </div>
  );
}
