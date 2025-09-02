"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import PositionnementForm from '@/components/rendez-vous/PositionnementForm';

export default function RendezvousPositionnementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formationTitre = searchParams.get('formation') || '';

  const handleSubmit = (data: any) => {
    // Envoyer les données du formulaire à l'API
    fetch('/api/rendezvous', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      router.push('/confirmation-rendezvous');
    })
    .catch((error) => {
      console.error('Error:', error);
    });
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
