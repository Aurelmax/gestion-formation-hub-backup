import './globals.css';
import { ReactNode } from 'react';
import Providers from './providers';
import { Inter } from 'next/font/google';

// Force dynamic rendering to prevent Html import errors
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

type LayoutProps = {
  children: ReactNode;
};

export const metadata = {
  title: 'GestionMax Formation Hub',
  description: 'Plateforme de gestion des formations',
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
