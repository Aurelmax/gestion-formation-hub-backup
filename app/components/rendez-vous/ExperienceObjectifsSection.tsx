import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ExperienceObjectifsSectionProps {
  formData: {
    experienceWordPress: string;
    objectifsPrincipaux: string;
    niveauMaitrise: string;
  };
  handleChange: (field: string, value: string | boolean) => void;
  errors?: Record<string, string>;
}

const ExperienceObjectifsSection = ({ 
  formData, 
  handleChange,
  errors = {} 
}: ExperienceObjectifsSectionProps) => {
  return (
    <div className="space-y-8">
      {/* Section Expérience */}
      <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Votre expérience</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="niveauMaitrise">Niveau actuel avec WordPress</Label>
            <RadioGroup 
              value={formData.niveauMaitrise}
              onValueChange={(value) => handleChange("niveauMaitrise", value)}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
            >
              <div>
                <RadioGroupItem value="debutant" id="debutant" className="peer sr-only" />
                <Label
                  htmlFor="debutant"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <div className="text-sm font-medium">Débutant</div>
                  <div className="text-xs text-center text-muted-foreground mt-1">
                    Première approche de WordPress
                  </div>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem value="intermediaire" id="intermediaire" className="peer sr-only" />
                <Label
                  htmlFor="intermediaire"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <div className="text-sm font-medium">Intermédiaire</div>
                  <div className="text-xs text-center text-muted-foreground mt-1">
                    Déjà utilisé occasionnellement
                  </div>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem value="confirme" id="confirme" className="peer sr-only" />
                <Label
                  htmlFor="confirme"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <div className="text-sm font-medium">Confirmé</div>
                  <div className="text-xs text-center text-muted-foreground mt-1">
                    Utilisation régulière
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="experienceWordPress">
              Décrivez votre expérience avec WordPress et les outils web
            </Label>
            <Textarea
              id="experienceWordPress"
              value={formData.experienceWordPress}
              onChange={(e) => handleChange("experienceWordPress", e.target.value)}
              placeholder="Avez-vous déjà utilisé WordPress ? Quels autres outils web connaissez-vous ?"
              rows={3}
              className="min-h-[100px]"
            />
            <p className="text-xs text-gray-500">
              Cette information nous aide à adapter le contenu de la formation à votre niveau.
            </p>
          </div>
        </div>
      </div>

      {/* Section Objectifs */}
      <div className="space-y-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-900">Vos objectifs</h3>
        
        <div className="space-y-2">
          <Label htmlFor="objectifsPrincipaux">
            Quels sont vos objectifs principaux avec cette formation ? *
          </Label>
          <Textarea
            id="objectifsPrincipaux"
            value={formData.objectifsPrincipaux}
            onChange={(e) => handleChange("objectifsPrincipaux", e.target.value)}
            placeholder="Ex: Créer un site vitrine pour mon entreprise, développer mes compétences en webdesign, me reconvertir dans le web..."
            rows={4}
            className={errors.objectifsPrincipaux ? "border-red-500" : ""}
            required
          />
          {errors.objectifsPrincipaux && (
            <p className="text-sm text-red-600">{errors.objectifsPrincipaux}</p>
          )}
          <p className="text-xs text-blue-700">
            Plus vous serez précis dans vos objectifs, mieux nous pourrons vous accompagner.
          </p>
        </div>
        
        <div className="pt-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium">À noter :</span> Votre formateur prendra connaissance de ces informations avant votre entretien de positionnement pour personnaliser au mieux cet échange.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExperienceObjectifsSection;
