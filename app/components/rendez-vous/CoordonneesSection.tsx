import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CoordonneesSectionProps {
  formData: {
    email: string;
    telephone: string;
    adresse: string;
    codePostal: string;
    ville: string;
    statut: string;
  };
  handleChange: (field: string, value: string | boolean) => void;
  errors?: Record<string, string>;
}

const CoordonneesSection = ({ formData, handleChange, errors = {} }: CoordonneesSectionProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Coordonnées de contact</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Adresse email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="votre@email.com"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="telephone">Téléphone *</Label>
          <Input
            id="telephone"
            type="tel"
            value={formData.telephone}
            onChange={(e) => handleChange("telephone", e.target.value)}
            placeholder="06 12 34 56 78"
            className={errors.telephone ? "border-red-500" : ""}
          />
          {errors.telephone && (
            <p className="text-sm text-red-600">{errors.telephone}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Adresse postale</h4>
        <div className="space-y-2">
          <Label htmlFor="adresse">Adresse</Label>
          <Input
            id="adresse"
            value={formData.adresse}
            onChange={(e) => handleChange("adresse", e.target.value)}
            placeholder="N° et nom de la rue"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="codePostal">Code postal</Label>
            <Input
              id="codePostal"
              value={formData.codePostal}
              onChange={(e) => handleChange("codePostal", e.target.value)}
              placeholder="75000"
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="ville">Ville</Label>
            <Input
              id="ville"
              value={formData.ville}
              onChange={(e) => handleChange("ville", e.target.value)}
              placeholder="Ville"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="statut">Votre situation actuelle *</Label>
        <Select
          value={formData.statut}
          onValueChange={(value) => handleChange("statut", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionnez votre situation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="demandeur-emploi">Demandeur d'emploi</SelectItem>
            <SelectItem value="salarie">Salarié(e)</SelectItem>
            <SelectItem value="independant">Indépendant / Auto-entrepreneur</SelectItem>
            <SelectItem value="fonction-publique">Fonction publique</SelectItem>
            <SelectItem value="etudiant">Étudiant(e)</SelectItem>
            <SelectItem value="retraite">Retraité(e)</SelectItem>
            <SelectItem value="autre">Autre situation</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">
          Ces informations nous aident à vous proposer les meilleures solutions de financement.
        </p>
      </div>
    </div>
  );
};

export default CoordonneesSection;
