"use client";

import { FileDown, X, ExternalLink, Calendar, CheckCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Formation } from "./types";

interface FormationDetailsModalProps {
  formation: Formation | null;
  isOpen: boolean;
  onClose: () => void;
  onPositionnement?: () => void;
}

const FormationDetailsModal = ({ 
  formation, 
  isOpen, 
  onClose, 
  onPositionnement 
}: FormationDetailsModalProps) => {
  if (!formation) return null;

  // Utiliser l'URL du programme si elle existe, sinon créer une URL par défaut
  const programmeUrl = formation.programmeUrl || `/programmes/ml/${formation.id}-programme.html`;
  
  // Fonction pour gérer le clic sur le bouton de positionnement
  const handlePositionnementClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onPositionnement) {
      onPositionnement();
    }
  };

  // Fonction pour déclencher le téléchargement du fichier en PDF
  const handleDownload = async () => {
    try {
      toast({
        title: "Téléchargement en cours...",
        description: "Préparation du programme de formation au format PDF.",
      });
      
      // Import dynamique de html2pdf.js (uniquement côté client)
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default;
      
      // Récupérer le contenu du fichier HTML
      const response = await fetch(programmeUrl);
      const htmlContent = await response.text();
      
      // Créer un élément div temporaire pour contenir le HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      document.body.appendChild(tempDiv);
      
      // Configuration pour html2pdf
      const options = {
        margin: 10,
        filename: `programme-${formation.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      // Générer le PDF à partir du contenu HTML et le télécharger
      await html2pdf()
        .from(tempDiv)
        .set(options)
        .save();
      
      // Nettoyer l'élément temporaire
      document.body.removeChild(tempDiv);
      
      toast({
        title: "Téléchargement terminé",
        description: "Le programme a été téléchargé avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      
      toast({
        variant: "destructive",
        title: "Erreur lors du téléchargement",
        description: "Impossible de générer le PDF. Téléchargement du format HTML à la place.",
      });
      
      // En cas d'erreur, ouvrir simplement le fichier dans un nouvel onglet
      window.open(programmeUrl, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {formation.titre}
              </DialogTitle>
              <DialogDescription className="text-blue-600">
                {formation.id} • {formation.duree} • Niveau {formation.niveau}
              </DialogDescription>
            </div>
            <DialogClose className="rounded-full p-1 hover:bg-gray-100">
              <X className="h-5 w-5" />
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                Description
              </h3>
              <p className="text-gray-700">{formation.description}</p>
            </div>

            {/* Objectifs */}
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Objectifs de la formation
              </h3>
              <ul className="space-y-3">
                {formation.objectifs.map((objectif, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{objectif}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Téléchargement du programme */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <FileDown className="h-5 w-5 mr-2" />
                Programme détaillé
              </h3>
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
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Voir en ligne
                </Button>
              </div>
            </div>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Informations pratiques */}
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Informations pratiques
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Durée</p>
                  <p className="text-gray-900">{formation.duree}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Niveau</p>
                  <p className="text-gray-900">{formation.niveau}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Prix</p>
                  <p className="text-2xl font-bold text-blue-700">{formation.prix}</p>
                  <p className="text-xs text-gray-500">Net de taxes</p>
                </div>
              </div>
            </div>

            {/* Bouton de positionnement */}
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base"
              onClick={handlePositionnementClick}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Réserver un RDV de positionnement
            </Button>

            {/* Financement */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-800">Financement possible</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Cette formation est éligible au CPF et aux financements professionnels.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormationDetailsModal;
