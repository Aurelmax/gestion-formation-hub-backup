import { Metadata } from 'next';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import FormationsPreview from '@/components/FormationsPreview';
import IllustrationSection from '@/components/IllustrationSection';
import OffreEntreprise from '@/components/OffreEntreprise';
import Footer from '@/components/Footer';
import { ArrowDownCircle } from 'lucide-react';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'GestionMax Formation Hub - Accueil',
  description: 'Centre de formation professionnelle et continue pour les entreprises et les particuliers',
};

export default function HomePage() {
  redirect('/catalogue');
  
  // Ce code ne sera jamais exécuté
  return null;
}
