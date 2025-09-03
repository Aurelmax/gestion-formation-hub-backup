import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BeneficiaireInfoSectionProps {
  formData: {
    nomBeneficiaire: string;
    prenomBeneficiaire: string;
    dateNaissance: string;
    sexe: string;
    situationHandicap: string;
  };
  handleChange: (field: string, value: string | boolean) => void;
  errors?: Record<string, string>;
}

const BeneficiaireInfoSection = ({ formData, handleChange }: BeneficiaireInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Informations du bénéficiaire</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nomBeneficiaire">Nom du bénéficiaire *</Label>
          <Input
            id="nomBeneficiaire"
            value={formData.nomBeneficiaire}
            onChange={(e) => handleChange("nomBeneficiaire", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prenomBeneficiaire">Prénom du bénéficiaire *</Label>
          <Input
            id="prenomBeneficiaire"
            value={formData.prenomBeneficiaire}
            onChange={(e) => handleChange("prenomBeneficiaire", e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateNaissance">Date de naissance</Label>
          <Input
            id="dateNaissance"
            type="date"
            value={formData.dateNaissance}
            onChange={(e) => handleChange("dateNaissance", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sexe">Sexe du bénéficiaire *</Label>
          <Select value={formData.sexe} onValueChange={(value) => handleChange("sexe", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="femme">Femme</SelectItem>
              <SelectItem value="homme">Homme</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="situationHandicap">Situation handicap</Label>
          <Select value={formData.situationHandicap} onValueChange={(value) => handleChange("situationHandicap", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="oui">Oui</SelectItem>
              <SelectItem value="non">Non</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaireInfoSection;
