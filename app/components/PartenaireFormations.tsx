"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Clock, Users, Globe, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import EnglishFAQ from "@/components/english/EnglishFAQ";

interface PartenaireFormation {
  id: string;
  titre: string;
  description: string;
  duree: string;
  prix: string;
  niveau: string;
  participants: string;
  langue: string;
  objectifs: string[];
  prerequis: string;
  modalites: string;
  partenaireNom: string;
  partenaireImage?: string;
}

const PartenaireFormations = () => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<string>("");
  
  const partenaireNom = "English4French";
  const conseillerNom = "Aurélien Lavayssière";
  const conseillerRole = "CONSEILLER FORMATION";
  const conseillerContact = "aurelien@english4french.com";
  const conseillerPhone = "06.46.02.24.68";
  const partenaireImage = "/partenaires/english4french.png"; // À placer dans le dossier public/partenaires/

  const formationsPartenaires: PartenaireFormation[] = [
    {
      id: "p1",
      titre: "Business English - Fundamentals",
      description: "Master professional English essentials for effective communication in international business environments.",
      duree: "13h (12h d'ateliers + 1h évaluation)",
      prix: "€1,490",
      niveau: "A2+ (Pré-indépendant)",
      participants: "Cours individuels ou collectifs jusqu'à 5 participants",
      langue: "English",
      objectifs: [
        "Les basics de l'anglais professionnel",
        "Rédaction d'e-mails professionnels",
        "Appels téléphoniques et visioconférences",
        "Conversations informelles en milieu professionnel"
      ],
      prerequis: "Niveau A2+",
      modalites: "En présence d'un formateur (en entreprise, en centre ou classes virtuelles)",
      partenaireNom: partenaireNom,
      partenaireImage: partenaireImage
    },
    {
      id: "p2", 
      titre: "Business English - Meetings & Presentations",
      description: "Enhance your ability to participate in, lead and present effectively in English-speaking professional settings.",
      duree: "13h (12h d'ateliers + 1h évaluation)",
      prix: "€ 1 490",
      niveau: "B1 (Indépendant)",
      participants: "Cours individuels ou collectifs jusqu'à 5 participants",
      langue: "English",
      objectifs: [
        "Participer à une réunion",
        "Prévoir et animer une réunion",
        "Préparer et réaliser une présentation",
        "Vocabulaire spécifique par métier"
      ],
      prerequis: "Niveau B1",
      modalites: "En présence d'un formateur (en entreprise, en centre ou classes virtuelles)",
      partenaireNom: partenaireNom,
      partenaireImage: partenaireImage
    }
  ];

  const handleContactRequest = (formationTitre: string) => {
    setSelectedFormation(formationTitre);
    setShowContactForm(true);
  };

  const handleFormSubmit = (data: any) => {
    // Ici vous pourriez ajouter une logique pour traiter différemment 
    // les demandes selon qu'elles concernent vos formations ou celles des partenaires
    console.log("Données du formulaire:", data);
    console.log("Formation partenaire sélectionnée:", selectedFormation);
    setShowContactForm(false);
    setSelectedFormation("");
    // Traitement spécifique pour les formations partenaires
    // Exemple: envoyer un email au partenaire ou marquer dans votre CRM
  };

  return (
    <>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                En partenariat avec {partenaireNom}
              </h2>
              <p className="text-lg text-gray-600">
                Des formations en anglais dispensées par notre partenaire de confiance.
              </p>
            </div>
            
            {/* Logo du partenaire */}
            <div className="flex items-center">
              <Image 
                src={partenaireImage} 
                alt={`Logo ${partenaireNom}`} 
                width={120}
                height={64}
                className="h-16 object-contain"
                onError={() => {
                  // Fallback géré par la propriété next/image 'placeholder' ou 'fallback'
                  // mais on pourrait aussi implémenter une logique personnalisée avec useState
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {formationsPartenaires.map((formation) => (
              <Card key={formation.id} className="hover:shadow-lg transition-all duration-300 flex flex-col border-t-4 border-indigo-600 overflow-hidden">
                {/* Badge partenaire */}
                <div className="bg-indigo-500 text-xs font-bold uppercase tracking-wider text-white py-1 px-3 text-center">
                  INTERNATIONAL PROGRAM
                </div>
                
                <CardHeader>
                  <div className="mb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-bold text-indigo-900 uppercase mb-2">
                        {formation.titre}
                      </CardTitle>
                      <Badge className="bg-indigo-200 text-indigo-900 hover:bg-indigo-300">
                        {formation.langue}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{formation.description}</p>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col">
                  <div className="border-t border-b border-gray-100 py-3 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-indigo-600" />
                      <span className="text-sm font-medium">{formation.duree}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-indigo-600" />
                      <span className="text-sm">{formation.participants}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-indigo-600" />
                      <span className="text-sm">{formation.langue}</span>
                    </div>
                  </div>

                  {/* Niveau et badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="text-xs bg-indigo-200 text-indigo-900">{formation.niveau}</Badge>
                    <Badge variant="secondary" className="text-xs bg-green-200 text-green-900">Certification English 360°</Badge>
                  </div>

                  {/* Objectifs */}
                  <div className="mb-4 bg-gray-50 p-3 rounded-md">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">Main objectives:</h4>
                    <ul className="space-y-1">
                      {formation.objectifs.slice(0, 3).map((objectif, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs text-gray-700">
                          <CheckCircle className="h-3 w-3 text-indigo-500 mt-0.5 flex-shrink-0" />
                          {objectif}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1 mb-5 text-xs text-gray-600">
                    <p><span className="font-medium">Prerequisites:</span> {formation.prerequis}</p>
                    <p><span className="font-medium">Methods:</span> {formation.modalites}</p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100">
                    {/* Partenaire */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-xs text-gray-500">Starting from</span>
                        <p className="text-2xl font-bold text-indigo-600">
                          {formation.prix}
                        </p>
                        <span className="text-xs text-gray-500">Tax-free</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Provided by</p>
                        <p className="text-sm font-medium text-gray-700">{formation.partenaireNom}</p>
                      </div>
                    </div>
                    
                    {/* Boutons */}
                    <Button 
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => handleContactRequest(formation.titre)}
                    >
                      Contact us for this training
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 bg-indigo-50 p-6 rounded-lg">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h4 className="text-xl font-bold text-indigo-900 mb-2">
                Intéressé par nos formations en anglais professionnel ?
              </h4>
              <p className="mb-6 text-gray-600">
                Toutes nos formations partenaires sont disponibles via notre plateforme. Contactez-nous pour plus d'informations ou pour un rendez-vous de positionnement de 15 minutes.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="text-center">
                <p className="font-semibold text-indigo-900">{conseillerNom}</p>
                <p className="text-sm text-gray-600">{conseillerRole}</p>
                <p className="text-sm text-indigo-700">{conseillerContact}</p>
                <p className="text-sm text-indigo-700">{conseillerPhone}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="text-indigo-700 border-indigo-300 hover:bg-indigo-50"
              onClick={() => handleContactRequest("General inquiry about partner trainings")}
            >
              Request information
            </Button>
          </div>
        </div>
      </section>

      {/* Formulaire de contact unifié */}
      <Dialog open={showContactForm} onOpenChange={setShowContactForm}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Contact us about this training</DialogTitle>
            <DialogDescription>
              {selectedFormation ? (
                <>Interested in <span className="font-semibold">{selectedFormation}</span>? Please fill in the form below and we'll get back to you shortly.</>
              ) : (
                <>Please fill in the form below and we'll get back to you shortly.</>
              )}
            </DialogDescription>
          </DialogHeader>
          <ContactForm 
            trainingTitle={selectedFormation}
            isPartnerTraining={true}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowContactForm(false);
              setSelectedFormation("");
            }}
          />
        </DialogContent>
      </Dialog>
      
      {/* Section FAQ pour les formations d'anglais */}
      <EnglishFAQ />
    </>
  );
};

export default PartenaireFormations;
