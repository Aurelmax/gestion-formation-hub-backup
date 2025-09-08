"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import PositionnementForm from '@/components/rendez-vous/PositionnementForm';

function PositionnementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formationTitre = searchParams.get('formation') || '';

  const handleSubmit = (data: any) => {
    // Le formulaire gère déjà l'appel API, on redirige juste vers la confirmation
    setTimeout(() => {
      router.push('/confirmation-rendezvous');
    }, 2000); // Délai pour permettre à l'animation confetti de se terminer
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <PositionnementForm 
          formationTitre={decodeURIComponent(formationTitre)}
          onCancel={() => router.back()}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default function RendezVousPositionnementPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Chargement...</div>}>
      <PositionnementContent />
    </Suspense>
  );
}
