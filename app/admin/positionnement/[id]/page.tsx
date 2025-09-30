import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import PositionnementView from './PositionnementView';

export const metadata: Metadata = {
  title: 'Détails du Positionnement - GestionMax',
  description: 'Consultation détaillée du rendez-vous de positionnement et du programme personnalisé associé',
};

export default async function PositionnementDetailsPage({
  params
}: {
  params: { id: string }
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/auth?redirect_url=/admin/positionnement/' + params.id);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PositionnementView positionnementId={params.id} />
    </div>
  );
}