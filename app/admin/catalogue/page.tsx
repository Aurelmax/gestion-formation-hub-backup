import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import CatalogueManager from './CatalogueManager';

export const metadata: Metadata = {
  title: 'Administration - Gestion du Catalogue Public',
  description: 'Interface de gestion du catalogue public de formations avec traçabilité pour audit',
};

export default async function AdminCataloguePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/auth?redirect_url=/admin/catalogue');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <CatalogueManager />
      </div>
    </div>
  );
}