import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Rendezvous, RendezvousFormData } from "@/hooks/useRendezvous";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface RendezvousFormProps {
  onSubmit: (data: RendezvousFormData) => void;
  initialData?: Rendezvous;
  onClose: () => void;
}

const RendezvousFormUnified = ({
  onSubmit,
  initialData,
  onClose,
}: RendezvousFormProps) => {
  // État du formulaire avec valeurs par défaut ou valeurs initiales
  const [formData, setFormData] = useState<RendezvousFormData>({
    nomBeneficiaire: initialData?.nomBeneficiaire || "",
    prenomBeneficiaire: initialData?.prenomBeneficiaire || "",
    emailBeneficiaire: initialData?.emailBeneficiaire || "",
    telephoneBeneficiaire: initialData?.telephoneBeneficiaire || "",
    objectifs: initialData?.objectifs || [],
    formationSelectionnee: initialData?.formationSelectionnee || "",
    dateRdv: initialData?.dateRdv ? new Date(initialData.dateRdv) : undefined,
    canal: initialData?.canal || "visio",
    synthese: initialData?.synthese || "",
    commentaires: initialData?.commentaires || "",
  });

  // États pour les informations additionnelles
  const [isFormationAffichee, setIsFormationAffichee] = useState(!!initialData?.formationSelectionnee);
  const [isEntrepriseAffichee, setIsEntrepriseAffichee] = useState(!!initialData?.entreprise);
  const [isHandicapAffiche, setIsHandicapAffiche] = useState(!!initialData?.hasHandicap);
  const [isFinancementAffiche, setIsFinancementAffiche] = useState(!!initialData?.isFinancement);

  // Objectifs temporaires pour la gestion des objectifs multiples
  const [objectifTemp, setObjectifTemp] = useState("");

  // Mise à jour du formulaire lorsque les données initiales changent
  useEffect(() => {
    if (initialData) {
      setFormData({
        nomBeneficiaire: initialData.nomBeneficiaire || "",
        prenomBeneficiaire: initialData.prenomBeneficiaire || "",
        emailBeneficiaire: initialData.emailBeneficiaire || "",
        telephoneBeneficiaire: initialData.telephoneBeneficiaire || "",
        objectifs: initialData.objectifs || [],
        formationSelectionnee: initialData.formationSelectionnee || "",
        dateRdv: initialData.dateRdv ? new Date(initialData.dateRdv) : undefined,
        canal: initialData.canal || "visio",
        synthese: initialData.synthese || "",
        commentaires: initialData.commentaires || "",
      });

      setIsFormationAffichee(!!initialData.formationSelectionnee);
      setIsEntrepriseAffichee(!!initialData.entreprise);
      setIsHandicapAffiche(!!initialData.hasHandicap);
      setIsFinancementAffiche(!!initialData.isFinancement);
    }
  }, [initialData]);

  // Gestion des changements de champs
  const handleChange = (field: keyof RendezvousFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Gestion des objectifs
  const addObjectif = () => {
    if (objectifTemp.trim()) {
      setFormData((prev) => ({
        ...prev,
        objectifs: [...(prev.objectifs || []), objectifTemp.trim()],
      }));
      setObjectifTemp("");
    }
  };

  const removeObjectif = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      objectifs: prev.objectifs?.filter((_, i) => i !== index) || [],
    }));
  };

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="infos-perso" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="infos-perso">Informations personnelles</TabsTrigger>
          <TabsTrigger value="rdv">Planification</TabsTrigger>
          <TabsTrigger value="formation">Formation</TabsTrigger>
          {isEntrepriseAffichee && (
            <TabsTrigger value="entreprise">Entreprise</TabsTrigger>
          )}
          {isHandicapAffiche && (
            <TabsTrigger value="handicap">Accessibilité</TabsTrigger>
          )}
          {isFinancementAffiche && (
            <TabsTrigger value="financement">Financement</TabsTrigger>
          )}
        </TabsList>

        {/* Informations personnelles */}
        <TabsContent value="infos-perso">
          <Card>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomBeneficiaire">Nom *</Label>
                  <Input
                    id="nomBeneficiaire"
                    value={formData.nomBeneficiaire}
                    onChange={(e) => handleChange("nomBeneficiaire", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prenomBeneficiaire">Prénom *</Label>
                  <Input
                    id="prenomBeneficiaire"
                    value={formData.prenomBeneficiaire}
                    onChange={(e) => handleChange("prenomBeneficiaire", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emailBeneficiaire">Email *</Label>
                  <Input
                    id="emailBeneficiaire"
                    type="email"
                    value={formData.emailBeneficiaire}
                    onChange={(e) => handleChange("emailBeneficiaire", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephoneBeneficiaire">Téléphone</Label>
                  <Input
                    id="telephoneBeneficiaire"
                    value={formData.telephoneBeneficiaire}
                    onChange={(e) => handleChange("telephoneBeneficiaire", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="situationActuelle">Situation actuelle</Label>
                <Select
                  value={formData.situationActuelle || ""}
                  onValueChange={(value) => handleChange("situationActuelle", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une situation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salarie">Salarié</SelectItem>
                    <SelectItem value="independant">Indépendant / Freelance</SelectItem>
                    <SelectItem value="creation_entreprise">En création d'entreprise</SelectItem>
                    <SelectItem value="demandeur_emploi">Demandeur d'emploi</SelectItem>
                    <SelectItem value="etudiant">Étudiant</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showEntreprise"
                    checked={isEntrepriseAffichee}
                    onCheckedChange={(checked) => setIsEntrepriseAffichee(!!checked)}
                  />
                  <Label htmlFor="showEntreprise">Ajouter des informations d'entreprise</Label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showHandicap"
                    checked={isHandicapAffiche}
                    onCheckedChange={(checked) => {
                      setIsHandicapAffiche(!!checked);
                      if (checked) handleChange("hasHandicap", true);
                      else handleChange("hasHandicap", false);
                    }}
                  />
                  <Label htmlFor="showHandicap">Situation de handicap</Label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showFinancement"
                    checked={isFinancementAffiche}
                    onCheckedChange={(checked) => {
                      setIsFinancementAffiche(!!checked);
                      if (checked) handleChange("isFinancement", true);
                      else handleChange("isFinancement", false);
                    }}
                  />
                  <Label htmlFor="showFinancement">Financement externe</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rendez-vous */}
        <TabsContent value="rdv">
          <Card>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateRdv">Date et heure du rendez-vous</Label>
                  <DateTimePicker
                    date={formData.dateRdv ? (formData.dateRdv instanceof Date ? formData.dateRdv : new Date(formData.dateRdv)) : undefined}
                    setDate={(date) => handleChange("dateRdv", date)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="canal">Canal</Label>
                  <Select
                    value={formData.canal || "visio"}
                    onValueChange={(value) => handleChange("canal", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un canal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visio">Visioconférence</SelectItem>
                      <SelectItem value="telephone">Téléphone</SelectItem>
                      <SelectItem value="presentiel">Présentiel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateRdv">Date et heure du rendez-vous</Label>
                <div className="flex flex-col w-full">
                  <DateTimePicker
                    date={formData.dateRdv instanceof Date ? formData.dateRdv : formData.dateRdv ? new Date(formData.dateRdv) : undefined}
                    setDate={(date) => handleChange("dateRdv", date)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="commentaires">Commentaires</Label>
                <Textarea
                  id="commentaires"
                  value={formData.commentaires || ""}
                  onChange={(e) => handleChange("commentaires", e.target.value)}
                  rows={3}
                  placeholder="Commentaires additionnels pour ce rendez-vous"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Formation */}
        <TabsContent value="formation">
          <Card>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showFormation"
                    checked={isFormationAffichee}
                    onCheckedChange={(checked) => setIsFormationAffichee(!!checked)}
                  />
                  <Label htmlFor="showFormation">Formation déjà sélectionnée</Label>
                </div>
              </div>

              {isFormationAffichee && (
                <div className="space-y-2">
                  <Label htmlFor="formationSelectionnee">Formation souhaitée</Label>
                  <Input
                    id="formationSelectionnee"
                    value={formData.formationSelectionnee || ""}
                    onChange={(e) => handleChange("formationSelectionnee", e.target.value)}
                    placeholder="Titre ou référence de la formation"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="niveauBeneficiaire">Niveau actuel</Label>
                <Select
                  value={formData.niveauBeneficiaire || ""}
                  onValueChange={(value) => handleChange("niveauBeneficiaire", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Niveau du bénéficiaire" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debutant">Débutant</SelectItem>
                    <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                    <SelectItem value="avance">Avancé</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="modaliteFormation">Modalité de formation</Label>
                <Select
                  value={formData.modaliteFormation || ""}
                  onValueChange={(value) => handleChange("modaliteFormation", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Modalité de formation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="presentiel">Présentiel</SelectItem>
                    <SelectItem value="distanciel">Distanciel</SelectItem>
                    <SelectItem value="mixte">Mixte (présentiel et distanciel)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="objectifs">Objectifs de formation</Label>
                <div className="flex space-x-2">
                  <Input
                    id="objectifs"
                    value={objectifTemp}
                    onChange={(e) => setObjectifTemp(e.target.value)}
                    placeholder="Nouvel objectif"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addObjectif();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addObjectif}
                  >
                    Ajouter
                  </Button>
                </div>

                <div className="mt-2 space-y-2">
                  {formData.objectifs && formData.objectifs.map((objectif, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded bg-gray-50"
                    >
                      <span>{objectif}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removeObjectif(index)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="attentes">Attentes spécifiques</Label>
                <Textarea
                  id="attentes"
                  value={formData.attentes || ""}
                  onChange={(e) => handleChange("attentes", e.target.value)}
                  rows={3}
                  placeholder="Attentes spécifiques concernant la formation"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pratiqueActuelle">Pratique actuelle</Label>
                <Textarea
                  id="pratiqueActuelle"
                  value={formData.pratiqueActuelle || ""}
                  onChange={(e) => handleChange("pratiqueActuelle", e.target.value)}
                  rows={3}
                  placeholder="Description de la pratique actuelle"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Entreprise (conditionnel) */}
        {isEntrepriseAffichee && (
          <TabsContent value="entreprise">
            <Card>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="entreprise">Nom de l'entreprise</Label>
                  <Input
                    id="entreprise"
                    value={formData.entreprise || ""}
                    onChange={(e) => handleChange("entreprise", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siret">SIRET</Label>
                  <Input
                    id="siret"
                    value={formData.siret || ""}
                    onChange={(e) => handleChange("siret", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adresseEntreprise">Adresse</Label>
                  <Input
                    id="adresseEntreprise"
                    value={formData.adresseEntreprise || ""}
                    onChange={(e) => handleChange("adresseEntreprise", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="interlocuteurNom">Nom de l'interlocuteur</Label>
                    <Input
                      id="interlocuteurNom"
                      value={formData.interlocuteurNom || ""}
                      onChange={(e) => handleChange("interlocuteurNom", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interlocuteurFonction">Fonction</Label>
                    <Input
                      id="interlocuteurFonction"
                      value={formData.interlocuteurFonction || ""}
                      onChange={(e) => handleChange("interlocuteurFonction", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="interlocuteurEmail">Email</Label>
                    <Input
                      id="interlocuteurEmail"
                      type="email"
                      value={formData.interlocuteurEmail || ""}
                      onChange={(e) => handleChange("interlocuteurEmail", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interlocuteurTelephone">Téléphone</Label>
                    <Input
                      id="interlocuteurTelephone"
                      value={formData.interlocuteurTelephone || ""}
                      onChange={(e) => handleChange("interlocuteurTelephone", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Handicap (conditionnel) */}
        {isHandicapAffiche && (
          <TabsContent value="handicap">
            <Card>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="detailsHandicap">Description de la situation</Label>
                  <Textarea
                    id="detailsHandicap"
                    value={formData.detailsHandicap || ""}
                    onChange={(e) => handleChange("detailsHandicap", e.target.value)}
                    rows={3}
                    placeholder="Description de la situation de handicap"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="besoinHandicap">Besoins spécifiques</Label>
                  <Textarea
                    id="besoinHandicap"
                    value={formData.besoinHandicap || ""}
                    onChange={(e) => handleChange("besoinHandicap", e.target.value)}
                    rows={3}
                    placeholder="Adaptations ou aménagements nécessaires"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Financement (conditionnel) */}
        {isFinancementAffiche && (
          <TabsContent value="financement">
            <Card>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="typeFinancement">Type de financement</Label>
                  <Select
                    value={formData.typeFinancement || ""}
                    onValueChange={(value) => handleChange("typeFinancement", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type de financement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cpf">Compte Personnel de Formation (CPF)</SelectItem>
                      <SelectItem value="opco">OPCO</SelectItem>
                      <SelectItem value="pole_emploi">Pôle Emploi</SelectItem>
                      <SelectItem value="region">Conseil Régional</SelectItem>
                      <SelectItem value="employeur">Employeur</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organismeFinanceur">Organisme financeur</Label>
                  <Input
                    id="organismeFinanceur"
                    value={formData.organismeFinanceur || ""}
                    onChange={(e) => handleChange("organismeFinanceur", e.target.value)}
                    placeholder="Nom de l'organisme financeur"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit">
          {initialData ? "Mettre à jour" : "Créer"}
        </Button>
      </div>
    </form>
  );
};

export default RendezvousFormUnified;
