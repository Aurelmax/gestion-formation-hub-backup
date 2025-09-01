
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ExperienceObjectifsSectionProps {
  formData: {
    experienceWordPress: string;
    objectifsPrincipaux: string;
    niveauMaitrise: string;
  };
  handleChange: (field: string, value: string | boolean) => void;
}

const ExperienceObjectifsSection = ({ formData, handleChange }: ExperienceObjectifsSectionProps) => {
  return (
    <>
      {/* Expérience */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="experienceWordPress">Expérience avec WordPress</Label>
          <Textarea
            id="experienceWordPress"
            value={formData.experienceWordPress}
            onChange={(e) => handleChange("experienceWordPress", e.target.value)}
            placeholder="Décrivez votre expérience avec WordPress ou les outils web..."
            rows={3}
          />
        </div>
      </div>

      {/* Objectifs */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="objectifsPrincipaux">Objectifs principaux</Label>
          <Textarea
            id="objectifsPrincipaux"
            value={formData.objectifsPrincipaux}
            onChange={(e) => handleChange("objectifsPrincipaux", e.target.value)}
            placeholder="Quels sont vos objectifs avec cette formation ?"
            rows={3}
          />
        </div>
      </div>

      {/* Niveau de maîtrise */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Niveau de maîtrise</Label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="niveauMaitrise"
                value="oui"
                checked={formData.niveauMaitrise === "oui"}
                onChange={(e) => handleChange("niveauMaitrise", e.target.value)}
              />
              <span>Oui</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="niveauMaitrise"
                value="non"
                checked={formData.niveauMaitrise === "non"}
                onChange={(e) => handleChange("niveauMaitrise", e.target.value)}
              />
              <span>Non</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExperienceObjectifsSection;
