import './globals.css';
import { ReactNode } from 'react';
import Providers from './providers';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

type LayoutProps = {
  children: ReactNode;
};

export const metadata = {
  title: 'GestionMax Formation Hub',
  description: 'Plateforme de gestion des formations',
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
