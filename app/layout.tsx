import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClientProviders } from './components/providers/ClientProviders';
import { ReactQueryProvider } from './components/providers/ReactQueryProvider';
import { AuthProvider } from "./hooks/useAuth";
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GestionMax Formation Hub',
  description: 'Plateforme de gestion de formations professionnelles',
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ReactQueryProvider>
          <AuthProvider>
            <ClientProviders>
              {children}
            </ClientProviders>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
