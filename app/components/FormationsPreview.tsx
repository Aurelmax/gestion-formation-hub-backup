"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, Users, CheckCircle } from "lucide-react";
import Link from "next/link";
import PositionnementForm from "@/components/rendez-vous/PositionnementForm";
import FormationDetailsModal from "@/components/catalogue/FormationDetailsModal";
import { Formation } from "@/components/catalogue/types";

const FormationsPreview = () => {
  const [showPositionnementForm, setShowPositionnementForm] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<string>("");
  const [selectedFormationDetails, setSelectedFormationDetails] = useState<Formation | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const formationsPreview: Formation[] = [
    {
      id: "A001-WP-DD",
      titre: "CRÉATION DE SON SITE INTERNET (WORDPRESS) + STRATÉGIE DE DÉVELOPPEMENT DIGITAL",
      description: "Formation complète pour créer et gérer un site WordPress et développer une stratégie digitale efficace pour votre activité.",
      duree: "14 heures (2 jours)",
      prix: "980€",
      niveau: "Débutant",
      participants: "Artisans, commerçants ou professions libérales",
      objectifs: [
        "Créer et personnaliser un site internet avec WordPress",
        "Gérer le contenu et la structure du site",
        "Définir une stratégie de développement digital",
        "Mettre en œuvre des actions SEO et réseaux sociaux"
      ],
      prerequis: "Maîtriser son environnement et les fonctions de base pour utiliser un ordinateur",
      modalites: "Présentiel",
      tauxParticipation: "98%",
      tauxReussite: "94%",
      programmeUrl: "/programmes/A001-WP-DD-programme.html"
    },
    {
      id: "2", 
      titre: "WordPress avancé",
      description: "Maîtrisez les fonctionnalités avancées de WordPress : thèmes personnalisés, extensions, optimisation et sécurité.",
      duree: "35 heures",
      prix: "2 890€",
      niveau: "Avancé",
      participants: "Formation en présentiel individuel",
      objectifs: [
        "Développer des thèmes personnalisés",
        "Configurer des extensions avancées",
        "Optimiser les performances et la sécurité"
      ],
      prerequis: "Connaissance de base de WordPress",
      modalites: "Présentiel ou à distance",
      tauxParticipation: "96%",
      tauxReussite: "92%",
      programmeUrl: "/programmes/programme-exemple.html"
    }
  ];

  const handlePositionnement = (formationTitre: string) => {
    console.log(`Ouverture du formulaire de positionnement pour: ${formationTitre}`);
    setSelectedFormation(formationTitre);
    setShowPositionnementForm(true);
  };

  const handlePositionnementSubmit = (data: any) => {
    console.log("Données du positionnement:", data);
    setShowPositionnementForm(false);
    setSelectedFormation("");
  };

  return (
    <>
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nos formations phares
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez un aperçu de nos formations WordPress les plus populaires, 
              adaptées à tous les niveaux.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {formationsPreview.map((formation) => (
              <Card key={formation.id} className="hover:shadow-lg transition-all duration-300 flex flex-col border-t-4 border-primary overflow-hidden h-auto">
                {/* En-tête avec style "STARTER PACK" */}
                <div className="bg-yellow-500 text-xs font-bold uppercase tracking-wider text-white py-1 px-3 text-center">
                  STARTER PACK
                </div>
                
                <CardHeader className="py-3">
                  <CardTitle className="text-base font-bold text-blue-900 uppercase">{formation.titre}</CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0 pb-4 flex flex-col">
                  {/* Niveau et badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline" className="text-xs bg-blue-50">{formation.niveau}</Badge>
                    <Badge variant="secondary" className="text-xs bg-green-50 text-green-700">Éligible FAF et OPCO</Badge>
                  </div>
                  
                  <div className="mt-auto">
                    {/* Prix */}
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <span className="text-xs text-gray-500">À partir de</span>
                        <p className="text-xl font-bold text-primary">
                          {formation.prix}
                        </p>
                        <span className="text-xs text-gray-500">Net de taxes</span>
                      </div>
                    </div>
                    
                    {/* Boutons */}
                    <div className="flex flex-col space-y-2">
                      <Button 
                        className="w-full bg-accent hover:bg-accent/80"
                        onClick={() => handlePositionnement(formation.titre)}
                      >
                        RDV de positionnement
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        onClick={() => {
                          setSelectedFormationDetails(formation);
                          setModalOpen(true);
                        }}
                      >
                        En savoir plus
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/catalogue">
              <Button size="lg" className="text-lg px-8 py-3">
                Voir toutes nos formations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Modal pour le formulaire de positionnement */}
      <Dialog open={showPositionnementForm} onOpenChange={setShowPositionnementForm}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Rendez-vous de positionnement - {selectedFormation}</DialogTitle>
          </DialogHeader>
          <PositionnementForm
            formationTitre={selectedFormation}
            onSubmit={handlePositionnementSubmit}
            onCancel={() => {
              setShowPositionnementForm(false);
              setSelectedFormation("");
            }}
          />
        </DialogContent>
      </Dialog>
      
      {/* Modal pour les détails de la formation */}
      {selectedFormationDetails && (
        <FormationDetailsModal
          formation={selectedFormationDetails}
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};

export default FormationsPreview;
