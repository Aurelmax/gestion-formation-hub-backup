
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { CompetenceFormData } from "@/types/competence";

interface ActionPlanSectionProps {
  form: UseFormReturn<CompetenceFormData>;
}

const ActionPlanSection = ({ form }: ActionPlanSectionProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="actionPrevue"
        rules={{ required: "L'action prévue est obligatoire" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Action prévue *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Décrivez les actions concrètes que vous prévoyez pour développer cette compétence"
                rows={4}
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Quelles sont les étapes concrètes pour atteindre votre objectif ?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="plateformeFomation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plateforme de formation (optionnel)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Udemy, Coursera, formation interne..."
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Où comptez-vous suivre la formation ?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lienFormation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lien vers la formation (optionnel)</FormLabel>
              <FormControl>
                <Input 
                  type="url"
                  placeholder="https://..."
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                URL directe vers la formation ou ressource
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-medium text-green-900 mb-2">Conseils pour un plan d'action efficace</h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Définissez des objectifs SMART (Spécifiques, Mesurables, Atteignables, Réalistes, Temporels)</li>
          <li>• Identifiez les ressources nécessaires (temps, budget, outils)</li>
          <li>• Planifiez des étapes intermédiaires pour mesurer vos progrès</li>
          <li>• Prévoyez un système de validation ou certification si possible</li>
        </ul>
      </div>
    </div>
  );
};

export default ActionPlanSection;
