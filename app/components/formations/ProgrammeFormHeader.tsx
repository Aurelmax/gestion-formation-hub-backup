import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ProgrammeFormHeaderProps {
  isEdit: boolean;
  onCancel: () => void;
}

export const ProgrammeFormHeader = ({ isEdit, onCancel }: ProgrammeFormHeaderProps) => {
  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" onClick={onCancel}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h2 className="text-2xl font-bold">
        {isEdit ? "Modifier le programme" : "Nouveau programme"}
      </h2>
    </div>
  );
};