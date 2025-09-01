import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Rendezvous, ImpactEvaluationData } from "@/hooks/useRendezvous";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StarRating } from "@/components/ui/star-rating";

interface ImpactEvaluationFormProps {
  onSubmit: (data: ImpactEvaluationData) => void;
  initialData?: Rendezvous;
  onClose: () => void;
}

/**
 * Formulaire d'évaluation d'impact (6 mois après la formation)
 * Permet de recueillir les retours sur l'application des compétences acquises
 */
const ImpactEvaluationForm = ({
  onSubmit,
  initialData,
  onClose,
}: ImpactEvaluationFormProps) => {
  // État du formulaire avec valeurs par défaut ou valeurs initiales
  const [formData, setFormData] = useState<ImpactEvaluationData>({
    satisfactionImpact: initialData?.satisfactionImpact || 3,
    competencesAppliquees: initialData?.competencesAppliquees || "",
    ameliorationsSuggeres: initialData?.ameliorationsSuggeres || "",
    commentairesImpact: initialData?.commentairesImpact || "",
  });

  // Mise à jour du formulaire lorsque les données initiales changent
  useEffect(() => {
    if (initialData) {
      setFormData({
        satisfactionImpact: initialData.satisfactionImpact || 3,
        competencesAppliquees: initialData.competencesAppliquees || "",
        ameliorationsSuggeres: initialData.ameliorationsSuggeres || "",
        commentairesImpact: initialData.commentairesImpact || "",
      });
    }
  }, [initialData]);

  // Gestion des changements de champs
  const handleChange = (
    field: keyof ImpactEvaluationData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Information sur le rendez-vous parent (formation initiale)
  const formationInfo = initialData ? (
    <div className="bg-muted p-4 rounded-md mb-6">
      <h3 className="text-lg font-medium mb-2">
        Évaluation d'impact - {initialData.formationSelectionnee}
      </h3>
      <div className="text-sm text-muted-foreground">
        <p>
          <strong>Participant(e) :</strong>{" "}
          {initialData.prenomBeneficiaire} {initialData.nomBeneficiaire}
        </p>
        <p>
          <strong>Formation suivie le :</strong>{" "}
          {initialData.dateRdv
            ? new Date(initialData.dateRdv).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : "Date non spécifiée"}
        </p>
      </div>
    </div>
  ) : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formationInfo}

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-3">
            <Label htmlFor="satisfactionImpact">
              Niveau de satisfaction global après application des compétences
            </Label>
            <div className="flex items-center gap-2">
              <StarRating
                rating={formData.satisfactionImpact}
                maxRating={5}
                onChange={(value) => handleChange("satisfactionImpact", value)}
              />
              <span className="text-sm text-muted-foreground ml-2">
                {formData.satisfactionImpact}/5
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="competencesAppliquees">
              Compétences appliquées en situation professionnelle
            </Label>
            <Textarea
              id="competencesAppliquees"
              value={formData.competencesAppliquees || ""}
              onChange={(e) =>
                handleChange("competencesAppliquees", e.target.value)
              }
              rows={4}
              placeholder="Décrivez comment vous avez pu mettre en pratique les compétences acquises lors de la formation..."
              className="resize-none"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="ameliorationsSuggeres">
              Améliorations suggérées pour la formation
            </Label>
            <Textarea
              id="ameliorationsSuggeres"
              value={formData.ameliorationsSuggeres || ""}
              onChange={(e) =>
                handleChange("ameliorationsSuggeres", e.target.value)
              }
              rows={4}
              placeholder="Suggestions d'amélioration pour la formation..."
              className="resize-none"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="commentairesImpact">Commentaires additionnels</Label>
            <Textarea
              id="commentairesImpact"
              value={formData.commentairesImpact || ""}
              onChange={(e) => handleChange("commentairesImpact", e.target.value)}
              rows={3}
              placeholder="Autres commentaires sur l'impact de la formation..."
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit">
          {initialData?.statut === "impact" ? "Enregistrer l'évaluation" : "Soumettre"}
        </Button>
      </div>
    </form>
  );
};

export default ImpactEvaluationForm;
