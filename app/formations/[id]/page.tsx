import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { FileDown, Calendar, CheckCircle, BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ProgrammeFormation {
  id: string;
  titre: string;
  description: string;
  duree: string;
  niveau: string;
  objectifs?: string[];
  prerequis?: string;
  publicConcerne?: string;
  programme?: string[];
  modalitesPedagogiques?: string;
  modalitesEvaluation?: string;
  validation?: string;
  accessibiliteHandicap?: boolean;
  categorie?: {
    id: string;
    titre: string;
    code: string;
  };
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const formation = await getFormation(params.id);
  
  if (!formation) {
    return {
      title: 'Formation non trouvée',
      description: 'La formation demandée est introuvable.'
    };
  }

  return {
    title: `${formation.titre} | GestionMax`,
    description: formation.description.substring(0, 160),
    openGraph: {
      title: formation.titre,
      description: formation.description.substring(0, 160),
      type: 'website',
    },
  };
}

async function getFormation(id: string): Promise<ProgrammeFormation | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/programmes-formation/${id}`, {
      next: { revalidate: 60 } // Revalider toutes les 60 secondes
    });
    
    if (!res.ok) {
      return null;
    }
    
    return await res.json();
  } catch (error) {
    console.error('Erreur lors de la récupération de la formation:', error);
    return null;
  }
}

export default async function FormationDetailPage({ params }: { params: { id: string } }) {
  const formation = await getFormation(params.id);
  
  if (!formation) {
    notFound();
  }
  
  // URL du programme de formation
  const programmeUrl = `/programmes/ml/${formation.id}-programme.html`;
  
  // Fonction pour gérer le téléchargement du PDF
  const handleDownload = async () => {
    'use client';
    
    try {
      // Ici, vous pouvez ajouter la logique de téléchargement du PDF
      // similaire à celle que nous avons dans FormationDetailsModal
      // ou ouvrir simplement le fichier HTML dans un nouvel onglet
      window.open(programmeUrl, '_blank');
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link 
            href="/catalogue" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au catalogue
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900">{formation.titre}</h1>
          <p className="mt-2 text-lg text-gray-600">
            {formation.categorie?.titre} • {formation.duree} • Niveau {formation.niveau}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                Description
              </h2>
              <p className="text-gray-700">{formation.description}</p>
            </div>

            {/* Objectifs */}
            {formation.objectifs && formation.objectifs.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Objectifs de la formation
                </h2>
                <ul className="space-y-3">
                  {formation.objectifs.map((objectif, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{objectif}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Programme détaillé */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
                <FileDown className="h-5 w-5 mr-2" />
                Programme détaillé
              </h2>
              <p className="text-blue-800 mb-4">
                Téléchargez le programme complet de la formation au format PDF pour le consulter hors ligne.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleDownload}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Télécharger le PDF
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.open(programmeUrl, '_blank')}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Voir en ligne
                </Button>
              </div>
            </div>
            
            {/* Programme détaillé */}
            {formation.programme && formation.programme.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-4">Programme détaillé</h2>
                <div className="space-y-4">
                  {formation.programme.map((item, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-1">
                      <h3 className="font-medium">Module {index + 1}</h3>
                      <p className="text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Public concerné */}
            {formation.publicConcerne && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-4">Public concerné</h2>
                <p className="text-gray-700">{formation.publicConcerne}</p>
              </div>
            )}
            
            {/* Prérequis */}
            {formation.prerequis && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-4">Prérequis</h2>
                <p className="text-gray-700">{formation.prerequis}</p>
              </div>
            )}
            
            {/* Modalités pédagogiques */}
            {formation.modalitesPedagogiques && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-4">Modalités pédagogiques</h2>
                <p className="text-gray-700">{formation.modalitesPedagogiques}</p>
              </div>
            )}
            
            {/* Modalités d'évaluation */}
            {formation.modalitesEvaluation && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-4">Modalités d'évaluation</h2>
                <p className="text-gray-700">{formation.modalitesEvaluation}</p>
              </div>
            )}
            
            {/* Validation */}
            {formation.validation && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-4">Validation</h2>
                <p className="text-gray-700">{formation.validation}</p>
              </div>
            )}
            
            {/* Accessibilité */}
            {formation.accessibiliteHandicap !== undefined && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-4">Accessibilité</h2>
                <p className="text-gray-700">
                  {formation.accessibiliteHandicap 
                    ? "Cette formation est accessible aux personnes en situation de handicap. N'hésitez pas à nous contacter pour plus d'informations sur les aménagements possibles."
                    : "Pour toute question concernant l'accessibilité de cette formation, veuillez nous contacter."}
                </p>
              </div>
            )}
          </div>
          
          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Informations pratiques */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Informations pratiques
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Durée</p>
                  <p className="text-gray-900">{formation.duree}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Niveau</p>
                  <p className="text-gray-900">{formation.niveau}</p>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-500">Prix</p>
                  <p className="text-2xl font-bold text-blue-700">Sur devis</p>
                  <p className="text-xs text-gray-500">Net de taxes</p>
                </div>
              </div>
            </div>

            {/* Bouton de positionnement */}
            <Button 
              asChild
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base"
            >
              <Link href={`/rendezvous-positionnement?formation=${encodeURIComponent(formation.titre)}`}>
                <Calendar className="h-5 w-5 mr-2" />
                Réserver un RDV de positionnement
              </Link>
            </Button>

            {/* Bouton de téléchargement mobile */}
            <div className="lg:hidden">
              <Button 
                variant="outline" 
                className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                onClick={handleDownload}
              >
                <FileDown className="h-4 w-4 mr-2" />
                Télécharger le programme
              </Button>
            </div>

            {/* Financement */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-green-800">Financement possible</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Cette formation est éligible au CPF et aux financements professionnels.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Contact */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2">Une question sur cette formation ?</h3>
              <p className="text-sm text-blue-700 mb-3">
                Notre équipe est à votre disposition pour vous renseigner.
              </p>
              <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50">
                Nous contacter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
