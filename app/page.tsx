import { Metadata } from 'next';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import FormationsPreview from '@/components/FormationsPreview';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'GestionMax Formation Hub - Centre de Formation Professionnelle',
  description: 'Organisme de formation professionnelle certifié Qualiopi. Formations WordPress, développement web, bureautique et management pour entreprises et particuliers.',
  keywords: ['formation professionnelle', 'WordPress', 'développement web', 'Qualiopi', 'organisme formation', 'entreprise', 'particuliers'],
  openGraph: {
    title: 'GestionMax Formation Hub - Centre de Formation Professionnelle',
    description: 'Organisme de formation professionnelle certifié Qualiopi. Formations WordPress, développement web, bureautique et management.',
    url: process.env.NEXT_PUBLIC_API_URL || 'https://gestionmax-formation-hub.vercel.app',
    siteName: 'GestionMax Formation Hub',
    locale: 'fr_FR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <FormationsPreview />
      </main>
      <Footer />
    </div>
  );
}
