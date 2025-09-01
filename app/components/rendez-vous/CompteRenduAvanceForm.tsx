import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Rendezvous } from "@/hooks/useRendezvous";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  FileText,
  Check,
  CalendarIcon,
  UserIcon,
  ClipboardListIcon,
  MapPinIcon,
  ClockIcon,
  InfoIcon,
  CreditCardIcon,
  CheckCircleIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CompteRenduAvanceFormProps {
  onSubmit: (data: CompteRenduData) => Promise<void>;
  onClose: () => void;
  onGenerateProgramme: () => Promise<{ programmeId: string; dossierId: string }>;
  initialData?: Rendezvous;
  loading?: boolean;
  generationLoading?: boolean;
}

interface CompteRenduData {
  projet: string;
  date: string;
  objectifOperation: string;
  qui: string;
  quoi: string;
  ou: string;
  quand: string;
  comment: string;
  combien: string;
  etatVerification: string;
  syntheseRdv: string;
  besoinExprime: string;
  problematique: string;
  objectifsFormation: string;
  recommendations: string;
  competencesActuelles: string;
  competencesRecherchees: string;
}

// Modèles de programmes disponibles
const programmesModeles = [
  { id: "wp-debutant", nom: "WordPress - Débutant", duree: 21 },
  { id: "wp-intermediaire", nom: "WordPress - Intermédiaire", duree: 28 },
  { id: "wp-avance", nom: "WordPress - Avancé", duree: 35 },
  { id: "seo-base", nom: "SEO - Fondamentaux", duree: 14 },
  { id: "seo-avance", nom: "SEO - Stratégie avancée", duree: 21 },
  { id: "graphisme-web", nom: "Graphisme pour le web", duree: 28 },
] as const;

// Modules disponibles
const modulesDisponibles = [
  { id: "mod-wp-intro", nom: "Introduction à WordPress", duree: 3, categorie: "wordpress" },
  { id: "mod-wp-themes", nom: "Thèmes et personnalisation", duree: 7, categorie: "wordpress" },
  { id: "mod-wp-plugins", nom: "Extension et fonctionnalités", duree: 7, categorie: "wordpress" },
  { id: "mod-wp-seo", nom: "SEO sur WordPress", duree: 7, categorie: "wordpress" },
  { id: "mod-wp-maint", nom: "Maintenance et sécurité", duree: 7, categorie: "wordpress" },
  { id: "mod-seo-base", nom: "Bases du référencement", duree: 7, categorie: "seo" },
  { id: "mod-seo-tech", nom: "SEO technique", duree: 7, categorie: "seo" },
  { id: "mod-seo-cont", nom: "Stratégie de contenu", duree: 7, categorie: "seo" },
  { id: "mod-graph-bases", nom: "Fondamentaux du design web", duree: 7, categorie: "graphisme" },
  { id: "mod-graph-ui", nom: "UI Design", duree: 7, categorie: "graphisme" },
  { id: "mod-graph-ux", nom: "UX Design", duree: 7, categorie: "graphisme" },
] as const;

type ModuleId = typeof modulesDisponibles[number]["id"];

type ProgrammePreview = {
  titre: string;
  description: string;
  duree: number;
  modules: { id: string; nom: string; duree: number }[];
  niveau: string;
  adaptationsSpecifiques?: string;
};

export default function CompteRenduAvanceForm({
  onSubmit,
  onClose,
  onGenerateProgramme,
  initialData,
  loading = false,
  generationLoading = false,
}: CompteRenduAvanceFormProps) {
  // Tabs
  const [activeTab, setActiveTab] = useState<string>("compte-rendu");

  // États Compte rendu (style Notion)
  const [projet, setProjet] = useState<string>(initialData?.formationSelectionnee || "");
  const [dateRdv, setDateRdv] = useState<string>(
    initialData?.dateRdv ? format(new Date(initialData.dateRdv), "d MMMM yyyy", { locale: fr }) : ""
  );
  const [objectifOperation, setObjectifOperation] = useState<string>("");
  const [qui, setQui] = useState<string>(`${initialData?.prenomBeneficiaire || ""} ${initialData?.nomBeneficiaire || ""}`.trim());
  const [quoi, setQuoi] = useState<string>("");
  // Utiliser le canal du RDV au lieu de modalité/adresse
  const [ou, setOu] = useState<string>(initialData?.canal === "presentiel" ? "Présentiel" : initialData?.canal ? "En ligne" : "");
  const [quand, setQuand] = useState<string>(
    initialData?.dateRdv ? `Du ${format(new Date(initialData.dateRdv), "dd/MM/yyyy", { locale: fr })}` : ""
  );
  const [comment, setComment] = useState<string>("");
  const [combien, setCombien] = useState<string>("");
  const [etatVerification, setEtatVerification] = useState<string>("En cours");

  // Synthèse du RDV
  const [syntheseRdv, setSyntheseRdv] = useState<string>(initialData?.synthese || "");
  const [besoinExprime, setBesoinExprime] = useState<string>("");
  const [problematique, setProblematique] = useState<string>("");
  const [objectifsFormation, setObjectifsFormation] = useState<string>("");
  const [recommendations, setRecommendations] = useState<string>("");
  // Champ competencesActuelles ajouté à l'interface Rendezvous
  const [competencesActuelles, setCompetencesActuelles] = useState<string>(initialData?.competencesActuelles || "");
  // Champ competencesRecherchees ajouté à l'interface Rendezvous
  const [competencesRecherchees, setCompetencesRecherchees] = useState<string>(initialData?.competencesRecherchees || "");

  // Programme
  const [modeleSelectionne, setModeleSelectionne] = useState<string>("");
  const [modulesSelectionnes, setModulesSelectionnes] = useState<ModuleId[]>([]);
  const [genererDepuisZero, setGenererDepuisZero] = useState<boolean>(false);
  const [ajusterDuree, setAjusterDuree] = useState<boolean>(false);
  const [dureePersonnalisee, setDureePersonnalisee] = useState<number>(21);
  const [niveauSelectionne, setNiveauSelectionne] = useState<string>("debutant");
  const [adaptationsSpecifiques, setAdaptationsSpecifiques] = useState<string>("");

  // Aperçu
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [programmeGenere, setProgrammeGenere] = useState<ProgrammePreview | null>(null);

  const dureeModulesSelectionnes = useMemo(
    () =>
      modulesSelectionnes
        .map((id) => modulesDisponibles.find((m) => m.id === id)?.duree || 0)
        .reduce((acc, n) => acc + n, 0),
    [modulesSelectionnes]
  );

  const dureeCalculee = useMemo(() => {
    if (ajusterDuree) return dureePersonnalisee;
    if (modulesSelectionnes.length > 0) return dureeModulesSelectionnes;
    const modele = programmesModeles.find((m) => m.id === modeleSelectionne);
    return modele?.duree ?? 21;
  }, [ajusterDuree, dureePersonnalisee, modulesSelectionnes, dureeModulesSelectionnes, modeleSelectionne]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const compteRenduData: CompteRenduData = {
      projet,
      date: dateRdv,
      objectifOperation,
      qui,
      quoi,
      ou,
      quand,
      comment,
      combien,
      etatVerification,
      syntheseRdv,
      besoinExprime,
      problematique,
      objectifsFormation,
      recommendations,
      competencesActuelles,
      competencesRecherchees,
    };
    await onSubmit(compteRenduData);
  };

  const handleModuleToggle = (id: ModuleId, checked: boolean | "indeterminate") => {
    if (checked === true) {
      setModulesSelectionnes((prev) => (prev.includes(id) ? prev : [...prev, id]));
    } else {
      setModulesSelectionnes((prev) => prev.filter((m) => m !== id));
    }
  };

  const handlePreviewProgramme = () => {
    try {
      const selectedModules = modulesSelectionnes.map(id => 
        modulesDisponibles.find(m => m.id === id)
      ).filter(Boolean) as typeof modulesDisponibles;
      
      const programmePreview: ProgrammePreview = {
        titre: `Formation ${modeleSelectionne?.nom || 'Personnalisée'}`,
        description: `Formation ${niveauSelectionne.toLowerCase()} basée sur ${modeleSelectionne?.nom || 'modules personnalisés'}`,
        duree: selectedModules.reduce((sum, m) => sum + m.duree, 0),
        modules: selectedModules,
        niveau: niveauSelectionne,
        adaptationsSpecifiques: adaptationsSpecifiques || undefined,
      };
      
      setProgrammeGenere(programmePreview);
      setActiveTab("apercu");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer l'aperçu du programme.",
        variant: "destructive"
      });
    }
    setShowPreview(true);
    setActiveTab("apercu");
  };

  const handleGenerateProgramme = async () => {
    if (!programmeGenere) return;
    
    try {
      // Supposons que vous avez une fonction pour générer le programme et le dossier
      const { programmeId, dossierId } = await onGenerateProgramme();
      
      toast({
        title: "Programme généré",
        description: `Le programme de formation et le dossier ont été créés avec succès.`,
      });
      
      // Rediriger vers le dossier créé
      router.push(`/dossiers/${dossierId}`);
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le programme et le dossier.",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="compte-rendu" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="compte-rendu">Compte rendu</TabsTrigger>
          <TabsTrigger value="programme">Programme personnalisé</TabsTrigger>
          <TabsTrigger value="apercu" disabled={!showPreview}>
            Aperçu
          </TabsTrigger>
        </TabsList>

        {/* Onglet Compte Rendu */}
        <TabsContent value="compte-rendu" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Étape 1 : RDV positionnement initial (Découverte)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {/* Projet */}
                <div className="flex items-start gap-2">
                  <div className="w-6 mt-1">
                    <ClipboardListIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="projet" className="text-sm font-medium">
                      Projet
                    </Label>
                    <Input id="projet" value={projet} onChange={(e) => setProjet(e.target.value)} placeholder="Titre du projet" />
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-start gap-2">
                  <div className="w-6 mt-1">
                    <CalendarIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="date" className="text-sm font-medium">
                      Date
                    </Label>
                    <Input id="date" value={dateRdv} onChange={(e) => setDateRdv(e.target.value)} placeholder="Date du rendez-vous" />
                  </div>
                </div>

                {/* Objectif opérationnel */}
                <div className="flex items-start gap-2">
                  <div className="w-6 mt-1">
                    <CheckCircleIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="objectifOperation" className="text-sm font-medium">
                      Objectif opérationnel
                    </Label>
                    <Textarea
                      id="objectifOperation"
                      value={objectifOperation}
                      onChange={(e) => setObjectifOperation(e.target.value)}
                      placeholder="Être capable de..."
                      className="min-h-[80px]"
                    />
                  </div>
                </div>

                {/* Qui */}
                <div className="flex items-start gap-2">
                  <div className="w-6 mt-1">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="qui" className="text-sm font-medium">
                      Qui
                    </Label>
                    <Input id="qui" value={qui} onChange={(e) => setQui(e.target.value)} placeholder="Participant(s)" />
                  </div>
                </div>

                {/* Quoi */}
                <div className="flex items-start gap-2">
                  <div className="w-6 mt-1">
                    <ClipboardListIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="quoi" className="text-sm font-medium">
                      Quoi
                    </Label>
                    <Textarea id="quoi" value={quoi} onChange={(e) => setQuoi(e.target.value)} placeholder="Contenu de la formation" className="min-h-[60px]" />
                  </div>
                </div>

                {/* Où */}
                <div className="flex items-start gap-2">
                  <div className="w-6 mt-1">
                    <MapPinIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="ou" className="text-sm font-medium">
                      Où
                    </Label>
                    <Input id="ou" value={ou} onChange={(e) => setOu(e.target.value)} placeholder="Lieu / Canal" />
                  </div>
                </div>

                {/* Quand */}
                <div className="flex items-start gap-2">
                  <div className="w-6 mt-1">
                    <ClockIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="quand" className="text-sm font-medium">
                      Quand
                    </Label>
                    <Input id="quand" value={quand} onChange={(e) => setQuand(e.target.value)} placeholder="Période de la formation" />
                  </div>
                </div>

                {/* Comment */}
                <div className="flex items-start gap-2">
                  <div className="w-6 mt-1">
                    <InfoIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="comment" className="text-sm font-medium">
                      Comment
                    </Label>
                    <Input id="comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Modalités pédagogiques" />
                  </div>
                </div>

                {/* Combien */}
                <div className="flex items-start gap-2">
                  <div className="w-6 mt-1">
                    <CreditCardIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="combien" className="text-sm font-medium">
                      Combien
                    </Label>
                    <Input id="combien" value={combien} onChange={(e) => setCombien(e.target.value)} placeholder="Budget et durée" />
                  </div>
                </div>

                {/* État de vérification */}
                <div className="flex items-start gap-2">
                  <div className="w-6 mt-1">
                    <Check className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="etatVerification" className="text-sm font-medium">
                      État de la Vérification
                    </Label>
                    <Select value={etatVerification} onValueChange={setEtatVerification}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="En attente">En attente</SelectItem>
                        <SelectItem value="En cours">En cours</SelectItem>
                        <SelectItem value="Vérifié - Accepté">Vérifié - Accepté</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Synthèse du RDV */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Synthèse du RDV</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="syntheseRdv" className="text-sm font-medium block mb-2">
                  Synthèse du rendez-vous
                </Label>
                <Textarea
                  id="syntheseRdv"
                  placeholder="Synthèse globale du rendez-vous de positionnement..."
                  className="min-h-[100px]"
                  value={syntheseRdv}
                  onChange={(e) => setSyntheseRdv(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="besoinExprime" className="text-sm font-medium block mb-2">
                  Besoin exprimé par le client
                </Label>
                <Textarea
                  id="besoinExprime"
                  placeholder="Exemple: Besoin d'améliorer le travail administratif grâce à l'IA et à l'automatisation"
                  className="min-h-[80px]"
                  value={besoinExprime}
                  onChange={(e) => setBesoinExprime(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="problematique" className="text-sm font-medium block mb-2">
                  Problématique concrète et actuelle
                </Label>
                <Textarea
                  id="problematique"
                  placeholder="Exemple: Multiplicité de formats de documents et canaux de communication non structurés..."
                  className="min-h-[80px]"
                  value={problematique}
                  onChange={(e) => setProblematique(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="objectifsFormation" className="text-sm font-medium block mb-2">
                  Objectifs de la formation
                </Label>
                <Textarea
                  id="objectifsFormation"
                  placeholder="Exemple: Reprendre le contrôle sur les flux entrants, structurer les processus..."
                  className="min-h-[80px]"
                  value={objectifsFormation}
                  onChange={(e) => setObjectifsFormation(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="competencesActuelles" className="text-sm font-medium block mb-2">
                  Compétences actuelles
                </Label>
                <Textarea
                  id="competencesActuelles"
                  placeholder="Décrivez les compétences actuelles du bénéficiaire..."
                  className="min-h-[80px]"
                  value={competencesActuelles}
                  onChange={(e) => setCompetencesActuelles(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="competencesRecherchees" className="text-sm font-medium block mb-2">
                  Compétences recherchées
                </Label>
                <Textarea
                  id="competencesRecherchees"
                  placeholder="Décrivez les compétences que le bénéficiaire souhaite acquérir..."
                  className="min-h-[80px]"
                  value={competencesRecherchees}
                  onChange={(e) => setCompetencesRecherchees(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="recommendations" className="text-sm font-medium block mb-2">
                  Recommandations
                </Label>
                <Textarea
                  id="recommendations"
                  placeholder="Recommandations et notes personnalisées..."
                  className="min-h-[80px]"
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2 mt-2">
            <Button type="button" onClick={() => setActiveTab("programme")}>Continuer vers programme</Button>
            <Button type="submit" disabled={loading || !syntheseRdv}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer le compte rendu"
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Onglet Programme Personnalisé */}
        <TabsContent value="programme" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-md">Création du programme personnalisé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="generer-zero"
                    checked={genererDepuisZero}
                    onCheckedChange={(checked) => setGenererDepuisZero(checked === true)}
                  />
                  <label htmlFor="generer-zero" className="text-sm font-medium">
                    Créer un programme entièrement personnalisé
                  </label>
                </div>

                {!genererDepuisZero && (
                  <div className="space-y-2 mt-2">
                    <Label htmlFor="modele">Sélectionner un modèle de programme</Label>
                    <Select value={modeleSelectionne} onValueChange={setModeleSelectionne}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un modèle" />
                      </SelectTrigger>
                      <SelectContent>
                        {programmesModeles.map((modele) => (
                          <SelectItem key={modele.id} value={modele.id}>
                            {modele.nom} ({modele.duree}h)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2 mt-4">
                  <Label>Niveau cible</Label>
                  <Select value={niveauSelectionne} onValueChange={setNiveauSelectionne}>
                    <SelectTrigger>
                      <SelectValue placeholder="Niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debutant">Débutant</SelectItem>
                      <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                      <SelectItem value="avance">Avancé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 mt-4">
                  <Label>Modules à inclure</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {modulesDisponibles.map((module) => (
                      <div key={module.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={module.id}
                          checked={modulesSelectionnes.includes(module.id)}
                          onCheckedChange={(checked) => handleModuleToggle(module.id, checked)}
                        />
                        <label htmlFor={module.id} className="text-sm">
                          {module.nom} ({module.duree}h)
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Durée cumulée des modules sélectionnés : {dureeModulesSelectionnes} h
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="ajuster-duree" checked={ajusterDuree} onCheckedChange={(c) => setAjusterDuree(c === true)} />
                    <label htmlFor="ajuster-duree" className="text-sm font-medium">
                      Ajuster la durée totale
                    </label>
                  </div>

                  {ajusterDuree && (
                    <div className="flex items-center space-x-2 mt-2">
                      <Input
                        type="number"
                        value={dureePersonnalisee}
                        onChange={(e) => setDureePersonnalisee(parseInt(e.target.value) || 21)}
                        min={7}
                        max={70}
                        className="w-24"
                      />
                      <span className="text-sm">heures</span>
                    </div>
                  )}

                  {!ajusterDuree && (
                    <div className="text-sm text-muted-foreground">
                      Durée calculée : {dureeCalculee} h
                    </div>
                  )}
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="adaptations">Adaptations spécifiques</Label>
                  <Textarea
                    id="adaptations"
                    placeholder="Précisez les adaptations spécifiques (handicap, contraintes, etc.)"
                    className="min-h-[100px]"
                    value={adaptationsSpecifiques}
                    onChange={(e) => setAdaptationsSpecifiques(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setActiveTab("compte-rendu")}>
                  Retour au compte rendu
                </Button>
                <Button type="button" onClick={handlePreviewProgramme}>
                  Prévisualiser le programme
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Aperçu */}
        <TabsContent value="apercu" className="space-y-4 mt-4">
          {programmeGenere && (
            <Card>
              <CardHeader>
                <CardTitle>{programmeGenere.titre}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Description</h3>
                  <p>{programmeGenere.description}</p>
                </div>

                <div>
                  <h3 className="font-medium">Durée totale</h3>
                  <p>{programmeGenere.duree} heures</p>
                </div>

                <div>
                  <h3 className="font-medium">Niveau</h3>
                  <p className="capitalize">{programmeGenere.niveau}</p>
                </div>

                <div>
                  <h3 className="font-medium">Modules ({programmeGenere.modules.length})</h3>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    {programmeGenere.modules.map((module) => (
                      <li key={module.id}>
                        {module.nom} ({module.duree}h)
                      </li>
                    ))}
                  </ul>
                </div>

                {programmeGenere.adaptationsSpecifiques && (
                  <div>
                    <h3 className="font-medium">Adaptations spécifiques</h3>
                    <p>{programmeGenere.adaptationsSpecifiques}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <DialogFooter className="space-x-2">
            <Button type="button" variant="outline" onClick={() => setActiveTab("programme")}>
              Retour au programme
            </Button>
            <Button type="button" onClick={handleGenerateProgramme} disabled={generationLoading}>
              {generationLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Générer programme et dossier
                </>
              )}
            </Button>
          </DialogFooter>
        </TabsContent>
      </Tabs>

      {/* Footer global (fermeture + save CR) */}
      <DialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={loading || generationLoading}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Enregistrer le compte rendu
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
