
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAccessibilite } from "@/hooks/useAccessibilite";
import { useToast } from "@/hooks/use-toast";

interface PlanAccessibiliteFormProps {
  onClose: () => void;
}

const PlanAccessibiliteForm = ({ onClose }: PlanAccessibiliteFormProps) => {
  const { creerPlanAccessibilite } = useAccessibilite();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    typeHandicap: "",
    adaptationsPedagogiques: "",
    adaptationsMaterielles: "",
    adaptationsEvaluation: "",
    responsable: "",
    statut: "En cours" as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await creerPlanAccessibilite(formData);
      toast({
        title: "Plan d'accessibilité créé",
        description: "Le plan d'accessibilité a été créé avec succès.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du plan.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const typesHandicap = [
    "Déficience visuelle",
    "Déficience auditive",
    "Déficience motrice",
    "Troubles DYS",
    "Troubles cognitifs",
    "Handicap psychique",
    "Maladie chronique",
    "Autre"
  ];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouveau plan d'accessibilité</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titre">Titre du plan</Label>
              <Input
                id="titre"
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                placeholder="Ex: Plan d'accessibilité - Déficience visuelle"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="typeHandicap">Type de handicap</Label>
              <Select
                value={formData.typeHandicap}
                onValueChange={(value) => setFormData({ ...formData, typeHandicap: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {typesHandicap.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description générale du plan d'accessibilité"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adaptationsPedagogiques">Adaptations pédagogiques</Label>
            <Textarea
              id="adaptationsPedagogiques"
              value={formData.adaptationsPedagogiques}
              onChange={(e) => setFormData({ ...formData, adaptationsPedagogiques: e.target.value })}
              placeholder="Décrire les adaptations pédagogiques nécessaires"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adaptationsMaterielles">Adaptations matérielles</Label>
            <Textarea
              id="adaptationsMaterielles"
              value={formData.adaptationsMaterielles}
              onChange={(e) => setFormData({ ...formData, adaptationsMaterielles: e.target.value })}
              placeholder="Décrire les adaptations matérielles nécessaires"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adaptationsEvaluation">Adaptations d'évaluation</Label>
            <Textarea
              id="adaptationsEvaluation"
              value={formData.adaptationsEvaluation}
              onChange={(e) => setFormData({ ...formData, adaptationsEvaluation: e.target.value })}
              placeholder="Décrire les adaptations pour les évaluations"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsable">Responsable</Label>
            <Input
              id="responsable"
              value={formData.responsable}
              onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
              placeholder="Nom du responsable du plan"
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Création..." : "Créer le plan"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlanAccessibiliteForm;
