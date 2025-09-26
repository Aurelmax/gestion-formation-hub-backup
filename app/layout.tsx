import './globals.css';
import { ReactNode } from 'react';
import Providers from './providers';
import { Inter } from 'next/font/google';

// Force dynamic rendering si nécessaire
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', 'arial'],
});

type LayoutProps = {
  children: ReactNode;
};

export const metadata = {
  title: {
    default: 'GestionMax Formation Hub',
    template: '%s | GestionMax Formation Hub',
  },
  description: 'Organisme de formation professionnelle certifié Qualiopi. Spécialisé dans les formations WordPress, développement web, bureautique et management.',
  keywords: ['formation professionnelle', 'Qualiopi', 'WordPress', 'développement web', 'organisme formation'],
  authors: [{ name: 'GestionMax' }],
  creator: 'GestionMax',
  publisher: 'GestionMax',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'GestionMax Formation Hub',
  },
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="antialiased" style={{ fontFamily: 'var(--font-inter), system-ui, arial' }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
