
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, FileText, Calendar, Download } from "lucide-react";
import ProgrammePersonnaliseForm from "./ProgrammePersonnaliseForm";
import { generateAllDocuments } from "@/utils/documentGenerator";
import api from "@/services/api";

interface WorkflowPositionnementProps {
  positionnementRequest: any;
  onCancel: () => void;
  onComplete: () => void;
}

const WorkflowPositionnement = ({ positionnementRequest, onCancel, onComplete }: WorkflowPositionnementProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [programmeId, setProgrammeId] = useState<string | null>(null);
  const [dossierId, setDossierId] = useState<string | null>(null);
  const [dossierData, setDossierData] = useState({
    numero_dossier: "",
    date_debut: "",
    date_fin: "",
    notes_formateur: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleProgrammeCreated = (newProgrammeId: string) => {
    setProgrammeId(newProgrammeId);
    setCurrentStep(2);
    toast({
      title: "Étape 1 terminée",
      description: "Programme personnalisé créé, passons à la création du dossier de formation.",
    });
  };

  const createDossierFormation = async () => {
    if (!programmeId) return;

    if (!dossierData.numero_dossier.trim()) {
      toast({
        title: "Numéro de dossier requis",
        description: "Veuillez saisir un numéro de dossier (ex: numéro de devis).",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const insertData: any = {
        programme_personnalise_id: programmeId,
        apprenant_nom: positionnementRequest.nom_beneficiaire,
        apprenant_prenom: positionnementRequest.prenom_beneficiaire,
        apprenant_email: positionnementRequest.email,
        formation_titre: positionnementRequest.formation_selectionnee,
        numero_dossier: dossierData.numero_dossier,
        statut: 'cree'
      };

      // Ajouter les dates seulement si elles sont renseignées
      if (dossierData.date_debut) {
        insertData.date_debut = dossierData.date_debut;
      }
      if (dossierData.date_fin) {
        insertData.date_fin = dossierData.date_fin;
      }
      if (dossierData.notes_formateur) {
        insertData.notes_formateur = dossierData.notes_formateur;
      }

      // Création du dossier de formation via l'API
      const formationData = {
        programmePersonnaliseId: programmeId,
        apprenantNom: positionnementRequest.nom_beneficiaire,
        apprenantPrenom: positionnementRequest.prenom_beneficiaire,
        apprenantEmail: positionnementRequest.email,
        formationTitre: positionnementRequest.formation_selectionnee,
        numeroDossier: dossierData.numero_dossier,
        statut: 'cree',
        dateDebut: dossierData.date_debut ? new Date(dossierData.date_debut).toISOString() : undefined,
        dateFin: dossierData.date_fin ? new Date(dossierData.date_fin).toISOString() : undefined,
        notesFormateur: dossierData.notes_formateur || undefined
      };
      
      const response = await api.post('/dossiers-formation', formationData);
      const data = response.data;

      setDossierId(data.id);
      setCurrentStep(3);
      
      toast({
        title: "Étape 2 terminée",
        description: `Dossier de formation créé avec le numéro ${data.numero_dossier}.`,
      });
    } catch (error) {
      console.error('Erreur lors de la création du dossier:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du dossier.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const generateDocuments = async () => {
    if (!dossierId || !programmeId) return;

    setIsProcessing(true);
    try {
      // Récupérer les données complètes du dossier avec le programme via l'API
      const response = await api.get(`/dossiers-formation/${dossierId}?include=programmePersonnalise`);
      const dossierComplet = response.data;

      if (!dossierComplet) {
        throw new Error("Dossier non trouvé");
      }

      // Générer et télécharger tous les documents
      const documents = await generateAllDocuments({
          id: dossierComplet.id,
          numeroDossier: dossierComplet.numeroDossier,
          apprenantNom: dossierComplet.apprenantNom,
          apprenantPrenom: dossierComplet.apprenantPrenom,
          apprenantEmail: dossierComplet.apprenantEmail,
          formationTitre: dossierComplet.formationTitre,
          dateDebut: dossierComplet.dateDebut,
          dateFin: dossierComplet.dateFin,
          programmePersonnalise: dossierComplet.programmePersonnalise,
          // Options configurables
          options: {
            downloadFiles: true
          }
        });

      // Enregistrer les métadonnées des documents en base via l'API
      for (const doc of documents) {
        await api.post('/documents-formation', {
          dossierFormationId: dossierId,
          typeDocument: doc.type,
          nomFichier: doc.nom_fichier, // Utiliser uniquement le format nom_fichier
          statut: 'genere'
        });
      }

      // Marquer la demande de positionnement comme traitée via l'API
      await api.put(`/positionnement-requests/${positionnementRequest.id}/status`, {
        status: 'traite'
      });

      setCurrentStep(4);
      
      toast({
        title: "Workflow terminé !",
        description: `Tous les documents ont été générés et téléchargés pour le dossier ${dossierComplet.numeroDossier}.`,
      });
    } catch (error) {
      console.error('Erreur lors de la génération des documents:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération des documents.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProgrammePersonnaliseForm
            positionnementRequest={positionnementRequest}
            onCancel={onCancel}
            onSuccess={handleProgrammeCreated}
          />
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Création du dossier de formation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Programme personnalisé créé avec succès</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numero_dossier">Numéro de dossier * (ex: numéro de devis)</Label>
                <Input
                  id="numero_dossier"
                  value={dossierData.numero_dossier}
                  onChange={(e) => setDossierData(prev => ({ ...prev, numero_dossier: e.target.value }))}
                  placeholder="Saisissez le numéro de dossier/devis"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date_debut">Date de début (optionnel)</Label>
                  <Input
                    id="date_debut"
                    type="date"
                    value={dossierData.date_debut}
                    onChange={(e) => setDossierData(prev => ({ ...prev, date_debut: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_fin">Date de fin (optionnel)</Label>
                  <Input
                    id="date_fin"
                    type="date"
                    value={dossierData.date_fin}
                    onChange={(e) => setDossierData(prev => ({ ...prev, date_fin: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes_formateur">Notes du formateur (optionnel)</Label>
                <textarea
                  id="notes_formateur"
                  className="w-full p-2 border rounded"
                  rows={3}
                  value={dossierData.notes_formateur}
                  onChange={(e) => setDossierData(prev => ({ ...prev, notes_formateur: e.target.value }))}
                  placeholder="Notes ou observations particulières..."
                />
              </div>

              <div className="flex gap-4">
                <Button onClick={createDossierFormation} disabled={isProcessing} className="flex-1">
                  {isProcessing ? "Création en cours..." : "Créer le dossier de formation"}
                </Button>
                <Button variant="outline" onClick={onCancel}>
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Génération des documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Programme personnalisé créé</span>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Dossier de formation créé</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Documents qui seront générés :</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Convention de formation</li>
                  <li>• Programme de formation détaillé</li>
                  <li>• Feuille d'émargement</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Button onClick={generateDocuments} disabled={isProcessing} className="flex-1">
                  {isProcessing ? "Génération en cours..." : "Générer tous les documents"}
                </Button>
                <Button variant="outline" onClick={onCancel}>
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                Workflow terminé avec succès !
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Programme personnalisé créé</span>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Dossier de formation créé</span>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Documents générés et téléchargés</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800">
                  Le processus de création est terminé. La demande de positionnement a été marquée comme traitée.
                  Tous les documents sont maintenant disponibles pour la formation.
                </p>
              </div>

              <Button onClick={onComplete} className="w-full">
                Retour à la liste des demandes
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Indicateur de progression */}
      <div className="flex items-center justify-center space-x-4">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step < currentStep ? 'bg-green-500 text-white' :
              step === currentStep ? 'bg-blue-500 text-white' :
              'bg-gray-200 text-gray-600'
            }`}>
              {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
            </div>
            {step < 4 && (
              <div className={`w-12 h-1 ${
                step < currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Étapes */}
      <div className="text-center text-sm text-gray-600">
        <div className="flex justify-between max-w-md mx-auto">
          <span className={currentStep >= 1 ? 'text-green-600 font-medium' : ''}>Programme</span>
          <span className={currentStep >= 2 ? 'text-green-600 font-medium' : ''}>Dossier</span>
          <span className={currentStep >= 3 ? 'text-green-600 font-medium' : ''}>Documents</span>
          <span className={currentStep >= 4 ? 'text-green-600 font-medium' : ''}>Terminé</span>
        </div>
      </div>

      {renderStep()}
    </div>
  );
};

export default WorkflowPositionnement;
