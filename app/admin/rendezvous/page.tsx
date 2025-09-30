import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import RendezvousManagerSimple from './RendezvousManagerSimple';

export const metadata: Metadata = {
  title: 'Gestion des Rendez-vous - GestionMax',
  description: 'Interface d\'administration pour la gestion des rendez-vous de positionnement et autres rendez-vous',
};

export default async function RendezvousPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/auth?redirect_url=/admin/rendezvous');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <RendezvousManagerSimple />
    </div>
  );
}