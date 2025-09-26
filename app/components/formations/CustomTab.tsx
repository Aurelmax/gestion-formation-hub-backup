import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProgrammeFormation } from "@/types/programmes";

interface CustomTabProps {
  formData: Partial<ProgrammeFormation>;
  onChange: (field: string, value: any) => void;
}

export const CustomTab = ({ formData, onChange }: CustomTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="beneficiaireId">ID du bénéficiaire</Label>
        <Input
          id="beneficiaireId"
          value={formData.beneficiaireId || ""}
          onChange={(e) => onChange("beneficiaireId", e.target.value || null)}
          placeholder="ID du bénéficiaire"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="positionnementRequestId">ID de la demande de positionnement</Label>
        <Input
          id="positionnementRequestId"
          value={formData.positionnementRequestId || ""}
          onChange={(e) => onChange("positionnementRequestId", e.target.value || null)}
          placeholder="ID de la demande de positionnement"
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="objectifsSpecifiques">Objectifs spécifiques</Label>
        <Textarea
          id="objectifsSpecifiques"
          value={formData.objectifsSpecifiques || ""}
          onChange={(e) => onChange("objectifsSpecifiques", e.target.value || null)}
          placeholder="Objectifs spécifiques pour ce bénéficiaire"
          rows={3}
        />
      </div>
    </div>
  );
};