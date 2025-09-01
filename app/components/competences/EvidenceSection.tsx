
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { CompetenceFormData } from "@/types/competence";

interface EvidenceSectionProps {
  form: UseFormReturn<CompetenceFormData>;
}

const EvidenceSection = ({ form }: EvidenceSectionProps) => {
  const typePreuve = form.watch("typePreuve");

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="typePreuve"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de preuve *</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type de preuve" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fichier">Fichier (certificat, diplôme, etc.)</SelectItem>
                  <SelectItem value="url">URL (portfolio, projet en ligne, etc.)</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>
              Comment souhaitez-vous documenter cette compétence ?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contenuPreuve"
        rules={{ required: "Le contenu de la preuve est obligatoire" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {typePreuve === "fichier" ? "Description du fichier *" : "URL de la preuve *"}
            </FormLabel>
            <FormControl>
              {typePreuve === "fichier" ? (
                <Textarea 
                  placeholder="Décrivez le fichier que vous avez en votre possession (certificat de formation WordPress avancé, diplôme, etc.)"
                  rows={3}
                  {...field} 
                />
              ) : (
                <Input 
                  type="url"
                  placeholder="https://monportfolio.com/projet-wordpress"
                  {...field} 
                />
              )}
            </FormControl>
            <FormDescription>
              {typePreuve === "fichier" 
                ? "Décrivez précisément le document qui atteste de votre compétence"
                : "Fournissez le lien vers votre portfolio, projet, ou toute autre preuve en ligne"
              }
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="bg-amber-50 p-4 rounded-lg">
        <h4 className="font-medium text-amber-900 mb-2">Types de preuves recommandées</h4>
        <div className="text-sm text-amber-800 space-y-2">
          <div>
            <strong>Fichiers :</strong>
            <ul className="mt-1 ml-4 space-y-1">
              <li>• Certificats de formation</li>
              <li>• Diplômes ou qualifications</li>
              <li>• Attestations de réussite</li>
              <li>• Évaluations de performance</li>
            </ul>
          </div>
          <div>
            <strong>URLs :</strong>
            <ul className="mt-1 ml-4 space-y-1">
              <li>• Portfolio en ligne</li>
              <li>• Projets réalisés</li>
              <li>• Articles ou publications</li>
              <li>• Profils professionnels (LinkedIn, etc.)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvidenceSection;
