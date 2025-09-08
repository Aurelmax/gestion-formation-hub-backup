"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ConfirmationRendezVousPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-12 pb-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Demande envoyée avec succès !
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Votre demande de rendez-vous de positionnement a été bien enregistrée. 
              Notre équipe vous contactera dans les <strong>24-48 heures</strong> pour 
              confirmer votre rendez-vous et planifier votre entretien.
            </p>
            
            <div className="bg-blue-50 p-6 rounded-lg mb-8 text-left">
              <h2 className="font-semibold text-blue-900 mb-3">Prochaines étapes :</h2>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2"></span>
                  Un conseiller vous appellera pour confirmer les détails
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2"></span>
                  Nous fixerons ensemble un créneau qui vous convient
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2"></span>
                  L'entretien durera environ 30-45 minutes
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => router.push('/catalogue')}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Retour au catalogue
              </Button>
              <Button 
                onClick={() => router.push('/')}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
              >
                Retour à l'accueil
              </Button>
            </div>
            
            <p className="text-sm text-gray-500 mt-8">
              Une question ? Contactez-nous au <strong>01 23 45 67 89</strong> ou 
              par email à <a href="mailto:contact@gestionmax.fr" className="text-blue-600 hover:underline">contact@gestionmax.fr</a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}