
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CoordoneesSectionProps {
  formData: {
    email: string;
    telephone: string;
    adresse: string;
    codePostal: string;
    ville: string;
    statut: string;
  };
  handleChange: (field: string, value: string | boolean) => void;
}

const CoordonneesSection = ({ formData, handleChange }: CoordoneesSectionProps) => {
  return (
    <>
      {/* Coordonnées */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Coordonnées</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telephone">Téléphone *</Label>
            <Input
              id="telephone"
              type="tel"
              value={formData.telephone}
              onChange={(e) => handleChange("telephone", e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="adresse">Adresse complète</Label>
          <Input
            id="adresse"
            value={formData.adresse}
            onChange={(e) => handleChange("adresse", e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="codePostal">Code postal</Label>
            <Input
              id="codePostal"
              value={formData.codePostal}
              onChange={(e) => handleChange("codePostal", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ville">Ville</Label>
            <Input
              id="ville"
              value={formData.ville}
              onChange={(e) => handleChange("ville", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Statut */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="statut">Statut actuel</Label>
          <Select value={formData.statut} onValueChange={(value) => handleChange("statut", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner votre statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="salarie">Salarié(e)</SelectItem>
              <SelectItem value="independant">Travailleur indépendant</SelectItem>
              <SelectItem value="demandeur-emploi">Demandeur d'emploi</SelectItem>
              <SelectItem value="etudiant">Étudiant(e)</SelectItem>
              <SelectItem value="autre">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};

export default CoordonneesSection;
