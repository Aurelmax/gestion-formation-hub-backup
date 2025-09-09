import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProgrammesFormation } from "@/hooks/useProgrammesFormation";
import { ProgrammeFormation } from "@/types/programmes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

interface FormationFormProps {
  formation?: Partial<ProgrammeFormation>;
  onSubmit: (data: Partial<ProgrammeFormation>) => void;
  onCancel: () => void;
}

const FormationForm = ({ formation, onSubmit, onCancel }: FormationFormProps) => {
  const { categories } = useProgrammesFormation();
  
  // État du formulaire avec le modèle unifié
  const [formData, setFormData] = useState<Partial<ProgrammeFormation>>({
    // Champs d'identification
    code: formation?.code || "",
    type: formation?.type || "catalogue",
    titre: formation?.titre || "",
    description: formation?.description || "",
    
    // Champs descriptifs
    niveau: formation?.niveau || "Débutant",
    participants: formation?.participants || "1 à 5",
    duree: formation?.duree || "21h (3 jours)",
    prix: formation?.prix || "1500€",
    objectifs: formation?.objectifs || [""],
    prerequis: formation?.prerequis || "Aucun prérequis spécifique",
    modalites: formation?.modalites || "A distance ou en présentiel",
    
    // Champs réglementaires
    publicConcerne: formation?.publicConcerne || "Tout public désirant se former à WordPress",
    contenuDetailleJours: formation?.contenuDetailleJours || "",
    modalitesAcces: formation?.modalitesAcces || "Formation accessible à distance ou en présentiel selon le contexte",
    modalitesTechniques: formation?.modalitesTechniques || "Formation synchrone à distance via visioconférence et partage d'écran",
    modalitesReglement: formation?.modalitesReglement || "Règlement à 30 jours, sans escompte",
    formateur: formation?.formateur || "Formateur spécialisé WordPress avec 5+ ans d'expérience",
    ressourcesDisposition: formation?.ressourcesDisposition || "Support de cours, tutoriels vidéo, accès à une plateforme d'exercices",
    modalitesEvaluation: formation?.modalitesEvaluation || "QCM et exercices pratiques",
    sanctionFormation: formation?.sanctionFormation || "Attestation de formation",
    niveauCertification: formation?.niveauCertification || "Formation non certifiante",
    delaiAcceptation: formation?.delaiAcceptation || "7 jours ouvrables",
    accessibiliteHandicap: formation?.accessibiliteHandicap || "Formation accessible aux personnes en situation de handicap. Contactez notre référent handicap pour adapter le parcours.",
    cessationAbandon: formation?.cessationAbandon || "En cas d'abandon, la facturation sera établie au prorata des heures réalisées.",
    
    // Champs spécifiques aux programmes personnalise
    beneficiaireId: formation?.beneficiaireId || null,
    objectifsSpecifiques: formation?.objectifsSpecifiques || null,
    positionnementRequestId: formation?.positionnementRequestId || null,
    
    // URL vers le programme HTML
    programmeUrl: formation?.programmeUrl || null,
    
    // Catégorie
    categorieId: formation?.categorieId || null,
    
    // Style
    pictogramme: formation?.pictogramme || "📚",
  });

  // Pour gérer les objectifs comme un tableau
  const [objectifsArray, setObjectifsArray] = useState<string[]>(
    Array.isArray(formation?.objectifs) ? formation.objectifs : [""]
  );
  
  useEffect(() => {
    setFormData(prev => ({ ...prev, objectifs: objectifsArray.filter(obj => obj.trim() !== "") }));
  }, [objectifsArray]);
  
  // Pour ajouter un nouvel objectif
  const addObjectif = () => {
    setObjectifsArray([...objectifsArray, ""]);
  };
  
  // Pour supprimer un objectif
  const removeObjectif = (index: number) => {
    setObjectifsArray(objectifsArray.filter((_, i) => i !== index));
  };
  
  // Pour mettre à jour un objectif spécifique
  const updateObjectif = (index: number, value: string) => {
    const newObjectifs = [...objectifsArray];
    newObjectifs[index] = value;
    setObjectifsArray(newObjectifs);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">
          {formation ? "Modifier le programme" : "Nouveau programme"}
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Programme de formation {formData.type === "catalogue" ? "catalogue" : "personnalise"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="infos" className="space-y-6">
              <TabsList>
                <TabsTrigger value="infos">Informations générales</TabsTrigger>
                <TabsTrigger value="contenu">Contenu pédagogique</TabsTrigger>
                <TabsTrigger value="reglementaire">Informations réglementaires</TabsTrigger>
                {formData.type === "personnalise" && (
                  <TabsTrigger value="surmesure">Spécificités personnalise</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="infos" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Code *</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => handleChange("code", e.target.value)}
                      placeholder="Ex: A001-WP-INTRO"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleChange("type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="catalogue">Catalogue</SelectItem>
                        <SelectItem value="personnalise">Personnalisé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="titre">Titre *</Label>
                  <Input
                    id="titre"
                    value={formData.titre}
                    onChange={(e) => handleChange("titre", e.target.value)}
                    placeholder="Ex: WordPress pour débutants"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Description de la formation"
                    rows={3}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="niveau">Niveau *</Label>
                    <Input
                      id="niveau"
                      value={formData.niveau}
                      onChange={(e) => handleChange("niveau", e.target.value)}
                      placeholder="Ex: Débutant"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="participants">Participants *</Label>
                    <Input
                      id="participants"
                      value={formData.participants}
                      onChange={(e) => handleChange("participants", e.target.value)}
                      placeholder="Ex: 1 à 5"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duree">Durée *</Label>
                    <Input
                      id="duree"
                      value={formData.duree}
                      onChange={(e) => handleChange("duree", e.target.value)}
                      placeholder="Ex: 21h (3 jours)"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="prix">Prix *</Label>
                    <Input
                      id="prix"
                      value={formData.prix}
                      onChange={(e) => handleChange("prix", e.target.value)}
                      placeholder="Ex: 1500€"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pictogramme">Pictogramme</Label>
                  <Input
                    id="pictogramme"
                    value={formData.pictogramme}
                    onChange={(e) => handleChange("pictogramme", e.target.value)}
                    placeholder="Ex: 📚"
                    required
                  />
                  <div className="text-sm text-muted-foreground mt-1">
                    Emoji ou icône pour représenter cette formation dans le catalogue
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categorieId">Catégorie *</Label>
                  <Select
                    value={formData.categorieId?.toString() || ""}
                    onValueChange={(value) => handleChange("categorieId", parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((categorie) => (
                        <SelectItem key={categorie.id} value={categorie.id.toString()}>
                          {categorie.titre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="programmeUrl">URL du programme HTML</Label>
                  <Input
                    id="programmeUrl"
                    value={formData.programmeUrl || ""}
                    onChange={(e) => handleChange("programmeUrl", e.target.value)}
                    placeholder="Ex: /programmes/wordpress-debutant.html"
                  />
                  <div className="text-sm text-muted-foreground mt-1">
                    URL relative vers le fichier HTML du programme détaillé (dans le dossier public)
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="contenu" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prerequis">Prérequis *</Label>
                  <Input
                    id="prerequis"
                    value={formData.prerequis}
                    onChange={(e) => handleChange("prerequis", e.target.value)}
                    placeholder="Ex: Aucun prérequis spécifique"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="objectifs">Objectifs *</Label>
                  {objectifsArray.map((objectif, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <Input
                        value={objectif}
                        onChange={(e) => updateObjectif(index, e.target.value)}
                        placeholder={`Objectif ${index + 1}`}
                      />
                      {index > 0 && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon" 
                          onClick={() => removeObjectif(index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                      {index === objectifsArray.length - 1 && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon" 
                          onClick={addObjectif}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="modalites">Modalités *</Label>
                  <Input
                    id="modalites"
                    value={formData.modalites}
                    onChange={(e) => handleChange("modalites", e.target.value)}
                    placeholder="Ex: A distance ou en présentiel"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contenuDetailleJours">Contenu détaillé par jour</Label>
                  <Textarea
                    id="contenuDetailleJours"
                    value={formData.contenuDetailleJours || ""}
                    onChange={(e) => handleChange("contenuDetailleJours", e.target.value)}
                    placeholder="Détail du programme jour par jour"
                    rows={10}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="reglementaire" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="publicConcerne">Public concerné *</Label>
                  <Input
                    id="publicConcerne"
                    value={formData.publicConcerne}
                    onChange={(e) => handleChange("publicConcerne", e.target.value)}
                    placeholder="Ex: Tout public désirant se former à WordPress"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="modalitesAcces">Modalités d'accès *</Label>
                  <Input
                    id="modalitesAcces"
                    value={formData.modalitesAcces}
                    onChange={(e) => handleChange("modalitesAcces", e.target.value)}
                    placeholder="Ex: Formation accessible à distance ou en présentiel selon le contexte"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="modalitesTechniques">Modalités techniques *</Label>
                  <Input
                    id="modalitesTechniques"
                    value={formData.modalitesTechniques}
                    onChange={(e) => handleChange("modalitesTechniques", e.target.value)}
                    placeholder="Ex: Formation synchrone à distance via visioconférence et partage d'écran"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="modalitesReglement">Modalités de règlement *</Label>
                  <Input
                    id="modalitesReglement"
                    value={formData.modalitesReglement}
                    onChange={(e) => handleChange("modalitesReglement", e.target.value)}
                    placeholder="Ex: Règlement à 30 jours, sans escompte"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="delaiAcceptation">Délai d'acceptation *</Label>
                  <Input
                    id="delaiAcceptation"
                    value={formData.delaiAcceptation}
                    onChange={(e) => handleChange("delaiAcceptation", e.target.value)}
                    placeholder="Ex: 7 jours ouvrables"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="formateur">Formateur *</Label>
                  <Input
                    id="formateur"
                    value={formData.formateur}
                    onChange={(e) => handleChange("formateur", e.target.value)}
                    placeholder="Ex: Formateur spécialisé WordPress avec 5+ ans d'expérience"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ressourcesDisposition">Ressources à disposition *</Label>
                  <Input
                    id="ressourcesDisposition"
                    value={formData.ressourcesDisposition}
                    onChange={(e) => handleChange("ressourcesDisposition", e.target.value)}
                    placeholder="Ex: Support de cours, tutoriels vidéo, accès à une plateforme d'exercices"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="modalitesEvaluation">Modalités d'évaluation *</Label>
                  <Input
                    id="modalitesEvaluation"
                    value={formData.modalitesEvaluation}
                    onChange={(e) => handleChange("modalitesEvaluation", e.target.value)}
                    placeholder="Ex: QCM et exercices pratiques"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sanctionFormation">Sanction de la formation *</Label>
                  <Input
                    id="sanctionFormation"
                    value={formData.sanctionFormation}
                    onChange={(e) => handleChange("sanctionFormation", e.target.value)}
                    placeholder="Ex: Attestation de formation"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="niveauCertification">Niveau de certification *</Label>
                  <Input
                    id="niveauCertification"
                    value={formData.niveauCertification}
                    onChange={(e) => handleChange("niveauCertification", e.target.value)}
                    placeholder="Ex: Formation non certifiante"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accessibiliteHandicap">Accessibilité handicap *</Label>
                  <Textarea
                    id="accessibiliteHandicap"
                    value={formData.accessibiliteHandicap}
                    onChange={(e) => handleChange("accessibiliteHandicap", e.target.value)}
                    placeholder="Ex: Formation accessible aux personnes en situation de handicap..."
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cessationAbandon">Cessation / abandon *</Label>
                  <Input
                    id="cessationAbandon"
                    value={formData.cessationAbandon}
                    onChange={(e) => handleChange("cessationAbandon", e.target.value)}
                    placeholder="Ex: En cas d'abandon, la facturation sera établie au prorata..."
                    required
                  />
                </div>
              </TabsContent>
              
              {formData.type === "personnalise" && (
                <TabsContent value="surmesure" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="beneficiaireId">ID du bénéficiaire</Label>
                    <Input
                      id="beneficiaireId"
                      value={formData.beneficiaireId?.toString() || ""}
                      onChange={(e) => handleChange("beneficiaireId", e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="ID du bénéficiaire"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="objectifsSpecifiques">Objectifs spécifiques</Label>
                    <Textarea
                      id="objectifsSpecifiques"
                      value={formData.objectifsSpecifiques || ""}
                      onChange={(e) => handleChange("objectifsSpecifiques", e.target.value)}
                      placeholder="Objectifs spécifiques pour ce programme personnalise"
                      rows={5}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="positionnementRequestId">ID de la demande de positionnement</Label>
                    <Input
                      id="positionnementRequestId"
                      value={formData.positionnementRequestId?.toString() || ""}
                      onChange={(e) => handleChange("positionnementRequestId", e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="ID de la demande de positionnement associée"
                    />
                  </div>
                </TabsContent>
              )}
            </Tabs>
            
            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
              >
                Annuler
              </Button>
              <Button type="submit">
                {formation ? "Mettre à jour" : "Créer le programme"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormationForm;
