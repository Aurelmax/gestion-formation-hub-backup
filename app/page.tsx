import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import FormationsPreview from '@/components/FormationsPreview';
import Footer from '@/components/Footer';
import { generateMetadata as generateSeoMetadata } from '@/lib/seo';

export const metadata = generateSeoMetadata({
  title: 'Centre de Formation Professionnelle',
  description: 'Organisme de formation professionnelle certifié Qualiopi. Formations WordPress, développement web, bureautique et management pour entreprises et particuliers.',
  keywords: [
    'formation professionnelle',
    'WordPress',
    'développement web',
    'Qualiopi',
    'organisme formation',
    'entreprise',
    'particuliers',
    'CPF',
    'certification'
  ],
});

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
