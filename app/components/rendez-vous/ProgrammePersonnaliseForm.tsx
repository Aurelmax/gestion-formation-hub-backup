
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import api from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface PositionnementRequest {
  id: string;
  prenom_beneficiaire: string;
  nom_beneficiaire: string;
  email_beneficiaire: string;
  telephone_beneficiaire?: string;
  objectifs?: string;
  competences_actuelles?: string;
  niveau?: string;
  format_souhaite?: string;
  disponibilites?: string;
  commentaires?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProgrammePersonnaliseFormProps {
  positionnementRequest: PositionnementRequest;
  onCancel: () => void;
  onSuccess: (programmeId: string) => void;
}

const ProgrammePersonnaliseForm = ({ positionnementRequest, onCancel, onSuccess }: ProgrammePersonnaliseFormProps) => {
  const [formData, setFormData] = useState({
    // Informations générales
    titre: `Formation WordPress personnalisée - ${positionnementRequest.prenom_beneficiaire} ${positionnementRequest.nom_beneficiaire}`,
    description: "Formation WordPress adaptée aux besoins spécifiques du bénéficiaire",
    contenu: "Programme détaillé de la formation WordPress",
    duree: "35", // 35h par défaut
    objectifsSpecifiques: "Acquérir les compétences nécessaires pour créer et gérer un site WordPress",
    evaluationSur: "Projet de création de site vitrine et QCM d'évaluation des connaissances",
    
    // Champs légaux et réglementaires
    prerequis: "Connaissance de base en informatique, savoir naviguer sur internet",
    publicConcerne: "Toute personne souhaitant créer et gérer un site web avec WordPress",
    horaires: "9h-12h30 et 14h-17h30, adaptables selon les besoins du bénéficiaire",
    modalitesAcces: "Formation accessible à distance ou en présentiel selon le contexte",
    delaiAcces: "15 jours après signature de la convention",
    tarif: "1750€ HT (non assujetti à la TVA)",
    modalitesReglement: "Paiement en 2 fois : 30% à la signature, solde en fin de formation",
    referentPedagogique: "Jean Dupont - jean.dupont@gestionmax.fr",
    referentQualite: "Marie Martin - marie.martin@gestionmax.fr",
    modalitesTechniques: "Formation synchrone à distance via visioconférence et partage d'écran",
    formateur: "Formateur spécialisé WordPress avec 5+ ans d'expérience",
    ressourcesDisposition: "Support de cours, tutoriels vidéo, accès à une plateforme d'exercices",
    modalitesEvaluation: "Évaluation continue par exercices pratiques et projet final",
    sanctionFormation: "Attestation de fin de formation et certificat de réalisation",
    niveauCertification: "Formation non certifiante",
    delaiAcceptation: "7 jours ouvrables",
    accessibiliteHandicap: "Formation accessible aux personnes en situation de handicap. Contactez notre référent handicap pour adapter le parcours.",
    cessationAnticipee: "En cas d'abandon, facturation des heures de formation effectuées plus 30% du solde à titre de dédommagement",
    
    // Éléments dynamiques
    competences_visees: ["Créer un site vitrine avec WordPress", "Maîtriser l'interface d'administration", "Optimiser le référencement de base"],
    ressources_necessaires: ["Ordinateur avec connexion internet", "Accès à un hébergement web", "Logiciels: navigateur web, éditeur de texte"]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCompetenceChange = (index: number, value: string) => {
    const newCompetences = [...formData.competences_visees];
    newCompetences[index] = value;
    setFormData(prev => ({ ...prev, competences_visees: newCompetences }));
  };

  const addCompetence = () => {
    setFormData(prev => ({ 
      ...prev, 
      competences_visees: [...prev.competences_visees, ""] 
    }));
  };

  const removeCompetence = (index: number) => {
    const newCompetences = formData.competences_visees.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, competences_visees: newCompetences }));
  };

  const handleRessourceChange = (index: number, value: string) => {
    const newRessources = [...formData.ressources_necessaires];
    newRessources[index] = value;
    setFormData(prev => ({ ...prev, ressources_necessaires: newRessources }));
  };

  const addRessource = () => {
    setFormData(prev => ({ 
      ...prev, 
      ressources_necessaires: [...prev.ressources_necessaires, ""] 
    }));
  };

  const removeRessource = (index: number) => {
    const newRessources = formData.ressources_necessaires.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, ressources_necessaires: newRessources }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Création du programme personnalisé via l'API
      const programmeData = {
        positionnementRequestId: positionnementRequest.id,
        // Champ formationId obligatoire dans le schéma Prisma
        formationId: "c9d9fbba-e229-457c-abb3-f2913fd4609f", // ID de la formation existante dans la base de données
        titre: formData.titre,
        description: formData.description,
        contenu: formData.contenu,
        duree: formData.duree,
        objectifsSpecifiques: formData.objectifsSpecifiques,
        evaluationSur: formData.evaluationSur,
        
        // Champs légaux et réglementaires
        prerequis: formData.prerequis,
        publicConcerne: formData.publicConcerne,
        horaires: formData.horaires,
        modalitesAcces: formData.modalitesAcces,
        delaiAcces: formData.delaiAcces,
        tarif: formData.tarif,
        modalitesReglement: formData.modalitesReglement,
        referentPedagogique: formData.referentPedagogique,
        referentQualite: formData.referentQualite,
        modalitesTechniques: formData.modalitesTechniques,
        formateur: formData.formateur,
        ressourcesDisposition: formData.ressourcesDisposition,
        modalitesEvaluation: formData.modalitesEvaluation,
        sanctionFormation: formData.sanctionFormation,
        niveauCertification: formData.niveauCertification,
        delaiAcceptation: formData.delaiAcceptation,
        accessibiliteHandicap: formData.accessibiliteHandicap,
        cessationAnticipee: formData.cessationAnticipee,
        
        // Données dynamiques
        competencesVisees: formData.competences_visees.filter(c => c.trim() !== ''),
        ressourcesNecessaires: formData.ressources_necessaires.filter(r => r.trim() !== '')
      };
      
      const response = await api.post('/programmes-personnalises', programmeData);
      const data = response.data;

      toast({
        title: "Programme créé",
        description: "Le programme de formation personnalisé a été créé avec succès.",
      });

      onSuccess(data.id);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du programme.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>Création du programme personnalisé</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form id="programme-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4 p-2 bg-blue-50 rounded-md text-sm">
            <p>Ce formulaire contient 5 onglets. Remplissez tous les champs nécessaires puis cliquez sur "Créer le programme" en bas du formulaire.</p>
          </div>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="legal">Champs légaux</TabsTrigger>
              <TabsTrigger value="regulation">Réglementation</TabsTrigger>
              <TabsTrigger value="contacts">Contacts & Formateurs</TabsTrigger>
              <TabsTrigger value="competences">Compétences & Ressources</TabsTrigger>
            </TabsList>
            
            {/* Onglet Général */}
            <TabsContent value="general" className="space-y-4 pt-4">
              <div>
                <Label htmlFor="titre">Titre du programme</Label>
                <Input
                  id="titre"
                  value={formData.titre}
                  onChange={(e) => handleChange("titre", e.target.value)}
                  className="mt-2"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="mt-2 min-h-[100px]"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="contenu">Contenu détaillé du programme</Label>
                <Textarea
                  id="contenu"
                  value={formData.contenu}
                  onChange={(e) => handleChange("contenu", e.target.value)}
                  className="mt-2 min-h-[150px]"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="duree">Durée (en heures)</Label>
                <Input
                  id="duree"
                  type="number"
                  value={formData.duree}
                  onChange={(e) => handleChange("duree", e.target.value)}
                  className="mt-2"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="objectifsSpecifiques">Objectifs spécifiques</Label>
                <Textarea
                  id="objectifsSpecifiques"
                  value={formData.objectifsSpecifiques}
                  onChange={(e) => handleChange("objectifsSpecifiques", e.target.value)}
                  className="mt-2 min-h-[100px]"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="evaluationSur">Méthode d'évaluation</Label>
                <Textarea
                  id="evaluationSur"
                  value={formData.evaluationSur}
                  onChange={(e) => handleChange("evaluationSur", e.target.value)}
                  className="mt-2"
                  required
                />
              </div>
            </TabsContent>
            
            {/* Onglet Champs légaux */}
            <TabsContent value="legal" className="space-y-4 pt-4">
              <div>
                <Label htmlFor="prerequis">Prérequis</Label>
                <Textarea
                  id="prerequis"
                  value={formData.prerequis}
                  onChange={(e) => handleChange("prerequis", e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="publicConcerne">Public concerné</Label>
                <Textarea
                  id="publicConcerne"
                  value={formData.publicConcerne}
                  onChange={(e) => handleChange("publicConcerne", e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="horaires">Horaires</Label>
                <Input
                  id="horaires"
                  value={formData.horaires}
                  onChange={(e) => handleChange("horaires", e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="tarif">Tarif</Label>
                <Input
                  id="tarif"
                  value={formData.tarif}
                  onChange={(e) => handleChange("tarif", e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="modalitesReglement">Modalités de règlement</Label>
                <Textarea
                  id="modalitesReglement"
                  value={formData.modalitesReglement}
                  onChange={(e) => handleChange("modalitesReglement", e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="delaiAcceptation">Délai d'acceptation</Label>
                <Input
                  id="delaiAcceptation"
                  value={formData.delaiAcceptation}
                  onChange={(e) => handleChange("delaiAcceptation", e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="cessationAnticipee">Cessation anticipée/abandon</Label>
                <Textarea
                  id="cessationAnticipee"
                  value={formData.cessationAnticipee}
                  onChange={(e) => handleChange("cessationAnticipee", e.target.value)}
                  className="mt-2"
                />
              </div>
            </TabsContent>
            
            {/* Onglet Réglementation */}
            <TabsContent value="regulation" className="space-y-4 pt-4">
              <div>
                <Label htmlFor="modalitesAcces">Modalités d'accès</Label>
                <Textarea
                  id="modalitesAcces"
                  value={formData.modalitesAcces}
                  onChange={(e) => handleChange("modalitesAcces", e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="delaiAcces">Délai d'accès</Label>
                <Input
                  id="delaiAcces"
                  value={formData.delaiAcces}
                  onChange={(e) => handleChange("delaiAcces", e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="modalitesTechniques">Modalités techniques et pédagogiques</Label>
                <Textarea
                  id="modalitesTechniques"
                  value={formData.modalitesTechniques}
                  onChange={(e) => handleChange("modalitesTechniques", e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="modalitesEvaluation">Modalités d'évaluation</Label>
                <Textarea
                  id="modalitesEvaluation"
                  value={formData.modalitesEvaluation}
                  onChange={(e) => handleChange("modalitesEvaluation", e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="sanctionFormation">Sanction de la formation</Label>
                <Textarea
                  id="sanctionFormation"
                  value={formData.sanctionFormation}
                  onChange={(e) => handleChange("sanctionFormation", e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="niveauCertification">Niveau/certification</Label>
                <Input
                  id="niveauCertification"
                  value={formData.niveauCertification}
                  onChange={(e) => handleChange("niveauCertification", e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="accessibiliteHandicap">Accessibilité handicapée</Label>
                <Textarea
                  id="accessibiliteHandicap"
                  value={formData.accessibiliteHandicap}
                  onChange={(e) => handleChange("accessibiliteHandicap", e.target.value)}
                  className="mt-2"
                />
              </div>
            </TabsContent>
            
            {/* Onglet Contacts & Formateurs */}
            <TabsContent value="contacts" className="space-y-4 pt-4">
              <div>
                <Label htmlFor="referentPedagogique">Référent pédagogique</Label>
                <Input
                  id="referentPedagogique"
                  value={formData.referentPedagogique}
                  onChange={(e) => handleChange("referentPedagogique", e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="referentQualite">Référent qualité</Label>
                <Input
                  id="referentQualite"
                  value={formData.referentQualite}
                  onChange={(e) => handleChange("referentQualite", e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="formateur">Formateur</Label>
                <Textarea
                  id="formateur"
                  value={formData.formateur}
                  onChange={(e) => handleChange("formateur", e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="ressourcesDisposition">Ressources mises à disposition</Label>
                <Textarea
                  id="ressourcesDisposition"
                  value={formData.ressourcesDisposition}
                  onChange={(e) => handleChange("ressourcesDisposition", e.target.value)}
                  className="mt-2"
                />
              </div>
            </TabsContent>
            
            {/* Onglet Compétences & Ressources */}
            <TabsContent value="competences" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Compétences visées</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addCompetence}
                  >
                    Ajouter
                  </Button>
                </div>
                {formData.competences_visees.map((comp, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={comp}
                      onChange={(e) => handleCompetenceChange(index, e.target.value)}
                      placeholder={`Compétence ${index + 1}`}
                      className="flex-1"
                      required
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeCompetence(index)}
                      disabled={formData.competences_visees.length <= 1}
                    >
                      X
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mt-8">
                <div className="flex items-center justify-between">
                  <Label>Ressources nécessaires</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addRessource}
                  >
                    Ajouter
                  </Button>
                </div>
                {formData.ressources_necessaires.map((res, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={res}
                      onChange={(e) => handleRessourceChange(index, e.target.value)}
                      placeholder={`Ressource ${index + 1}`}
                      className="flex-1"
                      required
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeRessource(index)}
                      disabled={formData.ressources_necessaires.length <= 1}
                    >
                      X
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </CardContent>
      
      <div className="p-6 bg-gray-50 border-t flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button form="programme-form" type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
          {isSubmitting ? "Création en cours..." : "Créer le programme"}
        </Button>
      </div>
    </Card>
  );
};

export default ProgrammePersonnaliseForm;
