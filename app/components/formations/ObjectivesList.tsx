import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Minus } from "lucide-react";

interface ObjectivesListProps {
  objectives: string[];
  onUpdateObjective: (index: number, value: string) => void;
  onAddObjective: () => void;
  onRemoveObjective: (index: number) => void;
}

export const ObjectivesList = ({
  objectives,
  onUpdateObjective,
  onAddObjective,
  onRemoveObjective
}: ObjectivesListProps) => {
  return (
    <div className="space-y-2">
      <Label>Objectifs de la formation</Label>
      {objectives.map((objectif, index) => (
        <div key={index} className="flex items-center gap-2 mt-2">
          <Input
            value={objectif}
            onChange={(e) => onUpdateObjective(index, e.target.value)}
            placeholder={`Objectif ${index + 1}`}
          />
          {objectives.length > 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onRemoveObjective(index)}
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
        onClick={onAddObjective}
      >
        <Plus className="h-4 w-4 mr-2" />
        Ajouter un objectif
      </Button>
    </div>
  );
};