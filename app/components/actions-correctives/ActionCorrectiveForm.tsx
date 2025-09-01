
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useActionsCorrectives, type CreateActionCorrectiveData, type ActionCorrective } from "@/hooks/useActionsCorrectives";

interface ActionCorrectiveFormProps {
  actionId?: string | null;
  onClose: () => void;
}

const ActionCorrectiveForm = ({ actionId, onClose }: ActionCorrectiveFormProps) => {
  const { actionsCorrectives, createActionCorrective, updateActionCorrective } = useActionsCorrectives();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<CreateActionCorrectiveData & { avancement?: number }>({
    titre: "",
    description: "",
    origine_type: "reclamation",
    origine_ref: "",
    origine_date: "",
    origine_resume: "",
    priorite: "moyenne",
    responsable_nom: "",
    responsable_email: "",
    date_echeance: "",
    indicateur_efficacite: "",
    avancement: 0,
  });

  const existingAction = actionId ? actionsCorrectives.find(a => a.id === actionId) : null;

  useEffect(() => {
    if (existingAction) {
      setFormData({
        titre: existingAction.titre,
        description: existingAction.description,
        origine_type: existingAction.origine_type,
        origine_ref: existingAction.origine_ref || "",
        origine_date: existingAction.origine_date ? existingAction.origine_date.split('T')[0] : "",
        origine_resume: existingAction.origine_resume || "",
        priorite: existingAction.priorite,
        responsable_nom: existingAction.responsable_nom || "",
        responsable_email: existingAction.responsable_email || "",
        date_echeance: existingAction.date_echeance ? existingAction.date_echeance.split('T')[0] : "",
        indicateur_efficacite: existingAction.indicateur_efficacite || "",
        avancement: existingAction.avancement,
      });
    }
  }, [existingAction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        origine_date: formData.origine_date ? new Date(formData.origine_date).toISOString() : undefined,
        date_echeance: formData.date_echeance ? new Date(formData.date_echeance).toISOString() : undefined,
      };

      if (actionId && existingAction) {
        await updateActionCorrective(actionId, submitData);
      } else {
        await createActionCorrective(submitData);
      }
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {actionId ? "Modifier l'action corrective" : "Nouvelle action corrective"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations générales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informations générales</h3>
              
              <div>
                <Label htmlFor="titre">Titre *</Label>
                <Input
                  id="titre"
                  value={formData.titre}
                  onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="priorite">Priorité</Label>
                <Select value={formData.priorite} onValueChange={(value: any) => setFormData({ ...formData, priorite: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="faible">Faible</SelectItem>
                    <SelectItem value="moyenne">Moyenne</SelectItem>
                    <SelectItem value="haute">Haute</SelectItem>
                    <SelectItem value="critique">Critique</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {actionId && (
                <div>
                  <Label>Avancement: {formData.avancement}%</Label>
                  <Slider
                    value={[formData.avancement || 0]}
                    onValueChange={(value) => setFormData({ ...formData, avancement: value[0] })}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                </div>
              )}
            </div>

            {/* Origine */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Origine</h3>
              
              <div>
                <Label htmlFor="origine_type">Type d'origine</Label>
                <Select value={formData.origine_type} onValueChange={(value: any) => setFormData({ ...formData, origine_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reclamation">Réclamation</SelectItem>
                    <SelectItem value="incident">Incident</SelectItem>
                    <SelectItem value="audit">Audit</SelectItem>
                    <SelectItem value="veille">Veille</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="origine_ref">Référence</Label>
                <Input
                  id="origine_ref"
                  value={formData.origine_ref}
                  onChange={(e) => setFormData({ ...formData, origine_ref: e.target.value })}
                  placeholder="Ex: REC-2024-001"
                />
              </div>

              <div>
                <Label htmlFor="origine_date">Date de l'événement</Label>
                <Input
                  id="origine_date"
                  type="date"
                  value={formData.origine_date}
                  onChange={(e) => setFormData({ ...formData, origine_date: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="origine_resume">Résumé de l'événement</Label>
                <Textarea
                  id="origine_resume"
                  value={formData.origine_resume}
                  onChange={(e) => setFormData({ ...formData, origine_resume: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            {/* Responsabilité */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Responsabilité</h3>
              
              <div>
                <Label htmlFor="responsable_nom">Nom du responsable</Label>
                <Input
                  id="responsable_nom"
                  value={formData.responsable_nom}
                  onChange={(e) => setFormData({ ...formData, responsable_nom: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="responsable_email">Email du responsable</Label>
                <Input
                  id="responsable_email"
                  type="email"
                  value={formData.responsable_email}
                  onChange={(e) => setFormData({ ...formData, responsable_email: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="date_echeance">Date d'échéance</Label>
                <Input
                  id="date_echeance"
                  type="date"
                  value={formData.date_echeance}
                  onChange={(e) => setFormData({ ...formData, date_echeance: e.target.value })}
                />
              </div>
            </div>

            {/* Efficacité */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Évaluation</h3>
              
              <div>
                <Label htmlFor="indicateur_efficacite">Indicateur d'efficacité</Label>
                <Textarea
                  id="indicateur_efficacite"
                  value={formData.indicateur_efficacite}
                  onChange={(e) => setFormData({ ...formData, indicateur_efficacite: e.target.value })}
                  placeholder="Comment mesurer l'efficacité de cette action ?"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : (actionId ? "Mettre à jour" : "Créer")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ActionCorrectiveForm;
