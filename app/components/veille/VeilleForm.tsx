
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { TypeVeille, StatutVeille, Veille } from "@/types/veille";

interface VeilleFormProps {
  onSubmit: (veille: Omit<Veille, "id" | "dateCreation" | "commentaires" | "documents" | "historique">) => void;
  onCancel: () => void;
}

const VeilleForm = ({ onSubmit, onCancel }: VeilleFormProps) => {
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    type: "" as TypeVeille,
    statut: "nouvelle" as StatutVeille,
    avancement: 0,
    dateEcheance: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titre || !formData.description || !formData.type) {
      return;
    }

    onSubmit({
      titre: formData.titre,
      description: formData.description,
      type: formData.type,
      statut: formData.statut,
      avancement: formData.avancement,
      dateEcheance: formData.dateEcheance ? new Date(formData.dateEcheance) : undefined
    });
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Nouvelle Veille</h2>
          <p className="text-gray-600">Créer une nouvelle veille pour suivre les évolutions</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations de la veille</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Titre *</label>
              <Input
                value={formData.titre}
                onChange={(e) => handleChange("titre", e.target.value)}
                placeholder="Titre de la veille"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description *</label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Description détaillée de la veille"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Type de veille *</label>
                <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reglementaire">Réglementaire</SelectItem>
                    <SelectItem value="metier">Métier</SelectItem>
                    <SelectItem value="innovation">Innovation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Statut initial</label>
                <Select value={formData.statut} onValueChange={(value) => handleChange("statut", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nouvelle">Nouvelle</SelectItem>
                    <SelectItem value="en-cours">En cours</SelectItem>
                    <SelectItem value="terminee">Terminée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Avancement initial ({formData.avancement}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.avancement}
                  onChange={(e) => handleChange("avancement", Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Date d'échéance (optionnel)</label>
                <Input
                  type="date"
                  value={formData.dateEcheance}
                  onChange={(e) => handleChange("dateEcheance", e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Créer la veille
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

export default VeilleForm;
