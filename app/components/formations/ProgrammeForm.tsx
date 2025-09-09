import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProgrammeFormation } from "@/types/programmes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProgrammeFormProps {
  programme?: Partial<ProgrammeFormation>;
  onSubmit: (data: Partial<ProgrammeFormation>) => void;
  onCancel: () => void;
  categories: Array<{
    id: string;
    code: string;
    titre: string;
    description: string;
  }>;
}

const ProgrammeForm = ({ programme, onSubmit, onCancel, categories }: ProgrammeFormProps) => {
  
  // État du formulaire avec le modèle unifié
  const [formData, setFormData] = useState<Partial<ProgrammeFormation>>({
    // Champs d'identification
    code: programme?.code || "",
    type: programme?.type || "catalogue",
    titre: programme?.titre || "",
    description: programme?.description || "",
    
    // Champs descriptifs
    niveau: programme?.niveau || "Débutant",
    participants: programme?.participants || "1 à 5",
    duree: programme?.duree || "21h (3 jours)",
    prix: programme?.prix || "1500€",
    objectifs: programme?.objectifs || [""],
    prerequis: programme?.prerequis || "Aucun prérequis spécifique",
    modalites: programme?.modalites || "A distance ou en présentiel",
    
    // Champs réglementaires
    publicConcerne: programme?.publicConcerne || "Tout public désirant se former à WordPress",
    contenuDetailleJours: programme?.contenuDetailleJours || "",
    modalitesAcces: programme?.modalitesAcces || "Formation accessible à distance ou en présentiel selon le contexte",
    modalitesTechniques: programme?.modalitesTechniques || "Formation synchrone à distance via visioconférence et partage d'écran",
    modalitesReglement: programme?.modalitesReglement || "Règlement à 30 jours, sans escompte",
    formateur: programme?.formateur || "Formateur spécialisé WordPress avec 5+ ans d'expérience",
    ressourcesDisposition: programme?.ressourcesDisposition || "Support de cours, tutoriels vidéo, accès à une plateforme d'exercices",
    modalitesEvaluation: programme?.modalitesEvaluation || "QCM et exercices pratiques",
    sanctionFormation: programme?.sanctionFormation || "Attestation de formation",
    niveauCertification: programme?.niveauCertification || "Formation non certifiante",
    delaiAcceptation: programme?.delaiAcceptation || "7 jours ouvrables",
    accessibiliteHandicap: programme?.accessibiliteHandicap || "Formation accessible aux personnes en situation de handicap. Contactez notre référent handicap pour adapter le parcours.",
    cessationAbandon: programme?.cessationAbandon || "En cas d'abandon, la facturation sera établie au prorata des heures réalisées.",
    
    // Champs spécifiques aux programmes personnalise
    beneficiaireId: programme?.beneficiaireId || null,
    objectifsSpecifiques: programme?.objectifsSpecifiques || null,
    positionnementRequestId: programme?.positionnementRequestId || null,
    
    // URL vers le programme HTML
    programmeUrl: programme?.programmeUrl || null,
    
    // Catégorie
    categorieId: programme?.categorieId || null,
    
    // Style
    pictogramme: programme?.pictogramme || "📚",
  });
  
  // Pour gérer les objectifs comme un tableau
  const [objectifsArray, setObjectifsArray] = useState<string[]>(
    Array.isArray(programme?.objectifs) ? programme.objectifs : [""]
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
          {programme ? "Modifier le programme" : "Nouveau programme"}
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
              
              <TabsContent value="infos" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type de programme *</Label>
                    <Select 
                      value={formData.type || ""} 
                      onValueChange={(value) => handleChange("type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="catalogue">Catalogue</SelectItem>
                        <SelectItem value="personnalise">Personnalisé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="code">Code du programme *</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => handleChange("code", e.target.value)}
                      placeholder="Ex: A008-BD-WC"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="titre">Titre du programme *</Label>
                    <Input
                      id="titre"
                      value={formData.titre}
                      onChange={(e) => handleChange("titre", e.target.value)}
                      placeholder="Ex: WordPress pour débutants"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="categorieId">Catégorie</Label>
                    <Select 
                      value={formData.categorieId || "_null"} 
                      onValueChange={(value) => handleChange("categorieId", value === "_null" ? null : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_null">Aucune catégorie</SelectItem>
                        {categories?.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.titre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      placeholder="Description du programme"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pictogramme">Pictogramme</Label>
                    <Input
                      id="pictogramme"
                      value={formData.pictogramme}
                      onChange={(e) => handleChange("pictogramme", e.target.value)}
                      placeholder="📚"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duree">Durée</Label>
                    <Input
                      id="duree"
                      value={formData.duree}
                      onChange={(e) => handleChange("duree", e.target.value)}
                      placeholder="Ex: 21h (3 jours)"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="prix">Prix</Label>
                    <Input
                      id="prix"
                      value={formData.prix}
                      onChange={(e) => handleChange("prix", e.target.value)}
                      placeholder="Ex: 1500€"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="modalites">Modalités</Label>
                    <Input
                      id="modalites"
                      value={formData.modalites}
                      onChange={(e) => handleChange("modalites", e.target.value)}
                      placeholder="A distance ou présentiel"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="niveau">Niveau</Label>
                    <Select 
                      value={formData.niveau || ""} 
                      onValueChange={(value) => handleChange("niveau", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Débutant">Débutant</SelectItem>
                        <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                        <SelectItem value="Avancé">Avancé</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="participants">Participants</Label>
                    <Input
                      id="participants"
                      value={formData.participants}
                      onChange={(e) => handleChange("participants", e.target.value)}
                      placeholder="Ex: 1 à 5"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="programmeUrl">URL du programme HTML</Label>
                    <Input
                      id="programmeUrl"
                      value={formData.programmeUrl || ""}
                      onChange={(e) => handleChange("programmeUrl", e.target.value || null)}
                      placeholder="Ex: /programmes/wordpress-debutant.html"
                    />
                  </div>
                </div>
              </TabsContent>
            
              <TabsContent value="contenu" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Objectifs de la formation</Label>
                    {objectifsArray.map((objectif, index) => (
                      <div key={index} className="flex items-center gap-2 mt-2">
                        <Input
                          value={objectif}
                          onChange={(e) => updateObjectif(index, e.target.value)}
                          placeholder={`Objectif ${index + 1}`}
                        />
                        {objectifsArray.length > 1 && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeObjectif(index)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={addObjectif}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un objectif
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="prerequis">Prérequis</Label>
                    <Textarea
                      id="prerequis"
                      value={formData.prerequis}
                      onChange={(e) => handleChange("prerequis", e.target.value)}
                      placeholder="Prérequis de la formation"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contenuDetailleJours">Contenu détaillé par jour</Label>
                    <Textarea
                      id="contenuDetailleJours"
                      value={formData.contenuDetailleJours}
                      onChange={(e) => handleChange("contenuDetailleJours", e.target.value)}
                      placeholder="Programme détaillé jour par jour"
                      rows={10}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reglementaire" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="publicConcerne">Public concerné</Label>
                    <Textarea
                      id="publicConcerne"
                      value={formData.publicConcerne}
                      onChange={(e) => handleChange("publicConcerne", e.target.value)}
                      placeholder="Public cible de la formation"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="modalitesAcces">Modalités d'accès</Label>
                    <Textarea
                      id="modalitesAcces"
                      value={formData.modalitesAcces}
                      onChange={(e) => handleChange("modalitesAcces", e.target.value)}
                      placeholder="Modalités d'accès à la formation"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="modalitesTechniques">Modalités techniques</Label>
                    <Textarea
                      id="modalitesTechniques"
                      value={formData.modalitesTechniques}
                      onChange={(e) => handleChange("modalitesTechniques", e.target.value)}
                      placeholder="Modalités techniques de la formation"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="modalitesReglement">Modalités de règlement</Label>
                    <Textarea
                      id="modalitesReglement"
                      value={formData.modalitesReglement}
                      onChange={(e) => handleChange("modalitesReglement", e.target.value)}
                      placeholder="Modalités de règlement"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="formateur">Formateur</Label>
                    <Textarea
                      id="formateur"
                      value={formData.formateur}
                      onChange={(e) => handleChange("formateur", e.target.value)}
                      placeholder="Informations sur le formateur"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ressourcesDisposition">Ressources à disposition</Label>
                    <Textarea
                      id="ressourcesDisposition"
                      value={formData.ressourcesDisposition}
                      onChange={(e) => handleChange("ressourcesDisposition", e.target.value)}
                      placeholder="Ressources mises à disposition des apprenants"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="modalitesEvaluation">Modalités d'évaluation</Label>
                    <Textarea
                      id="modalitesEvaluation"
                      value={formData.modalitesEvaluation}
                      onChange={(e) => handleChange("modalitesEvaluation", e.target.value)}
                      placeholder="Modalités d'évaluation des apprenants"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sanctionFormation">Sanction de la formation</Label>
                    <Textarea
                      id="sanctionFormation"
                      value={formData.sanctionFormation}
                      onChange={(e) => handleChange("sanctionFormation", e.target.value)}
                      placeholder="Sanction de la formation (certificat, attestation...)"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="niveauCertification">Niveau/certification obtenue</Label>
                    <Input
                      id="niveauCertification"
                      value={formData.niveauCertification}
                      onChange={(e) => handleChange("niveauCertification", e.target.value)}
                      placeholder="Niveau ou certification obtenue"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="delaiAcceptation">Délai d'acceptation</Label>
                    <Input
                      id="delaiAcceptation"
                      value={formData.delaiAcceptation}
                      onChange={(e) => handleChange("delaiAcceptation", e.target.value)}
                      placeholder="Délai d'acceptation de la formation"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accessibiliteHandicap">Accessibilité handicap</Label>
                    <Textarea
                      id="accessibiliteHandicap"
                      value={formData.accessibiliteHandicap}
                      onChange={(e) => handleChange("accessibiliteHandicap", e.target.value)}
                      placeholder="Informations sur l'accessibilité aux personnes en situation de handicap"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cessationAbandon">Cessation anticipée/abandon</Label>
                    <Textarea
                      id="cessationAbandon"
                      value={formData.cessationAbandon}
                      onChange={(e) => handleChange("cessationAbandon", e.target.value)}
                      placeholder="Conditions en cas de cessation anticipée ou d'abandon"
                      rows={2}
                    />
                  </div>
                </div>
              </TabsContent>
              
              {formData.type === "personnalise" && (
                <TabsContent value="surmesure" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="beneficiaireId">ID du bénéficiaire</Label>
                      <Input
                        id="beneficiaireId"
                        value={formData.beneficiaireId || ""}
                        onChange={(e) => handleChange("beneficiaireId", e.target.value || null)}
                        placeholder="ID du bénéficiaire"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="positionnementRequestId">ID de la demande de positionnement</Label>
                      <Input
                        id="positionnementRequestId"
                        value={formData.positionnementRequestId || ""}
                        onChange={(e) => handleChange("positionnementRequestId", e.target.value || null)}
                        placeholder="ID de la demande de positionnement"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="objectifsSpecifiques">Objectifs spécifiques</Label>
                      <Textarea
                        id="objectifsSpecifiques"
                        value={formData.objectifsSpecifiques || ""}
                        onChange={(e) => handleChange("objectifsSpecifiques", e.target.value || null)}
                        placeholder="Objectifs spécifiques pour ce bénéficiaire"
                        rows={3}
                      />
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                {programme ? "Modifier" : "Créer"} le programme
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgrammeForm;
