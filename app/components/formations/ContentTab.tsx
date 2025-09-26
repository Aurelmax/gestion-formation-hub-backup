import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ObjectivesList } from "./ObjectivesList";
import { ProgrammeFormation } from "@/types/programmes";

interface ContentTabProps {
  formData: Partial<ProgrammeFormation>;
  objectives: string[];
  onObjectiveUpdate: (index: number, value: string) => void;
  onAddObjective: () => void;
  onRemoveObjective: (index: number) => void;
  onChange: (field: string, value: any) => void;
}

export const ContentTab = ({
  formData,
  objectives,
  onObjectiveUpdate,
  onAddObjective,
  onRemoveObjective,
  onChange
}: ContentTabProps) => {
  return (
    <div className="space-y-4">
      <ObjectivesList
        objectives={objectives}
        onUpdateObjective={onObjectiveUpdate}
        onAddObjective={onAddObjective}
        onRemoveObjective={onRemoveObjective}
      />

      <div className="space-y-2">
        <Label htmlFor="prerequis">Prérequis</Label>
        <Textarea
          id="prerequis"
          value={formData.prerequis}
          onChange={(e) => onChange("prerequis", e.target.value)}
          placeholder="Prérequis de la formation"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contenuDetailleJours">Contenu détaillé par jour</Label>
        <Textarea
          id="contenuDetailleJours"
          value={formData.contenuDetailleJours}
          onChange={(e) => onChange("contenuDetailleJours", e.target.value)}
          placeholder="Programme détaillé jour par jour"
          rows={10}
        />
      </div>
    </div>
  );
};