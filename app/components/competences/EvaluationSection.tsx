
import { UseFormReturn } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { CompetenceFormData } from "@/types/competence";

interface EvaluationSectionProps {
  form: UseFormReturn<CompetenceFormData>;
}

const EvaluationSection = ({ form }: EvaluationSectionProps) => {
  const niveaux = [
    { value: 1, label: "1 - Débutant" },
    { value: 2, label: "2 - Élémentaire" },
    { value: 3, label: "3 - Intermédiaire" },
    { value: 4, label: "4 - Avancé" },
    { value: 5, label: "5 - Expert" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="niveauActuel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Niveau actuel *</FormLabel>
              <FormControl>
                <Select 
                  value={field.value.toString()} 
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le niveau actuel" />
                  </SelectTrigger>
                  <SelectContent>
                    {niveaux.map((niveau) => (
                      <SelectItem key={niveau.value} value={niveau.value.toString()}>
                        {niveau.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Évaluez votre niveau actuel sur cette compétence
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="objectifNiveau"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Objectif niveau *</FormLabel>
              <FormControl>
                <Select 
                  value={field.value.toString()} 
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner l'objectif" />
                  </SelectTrigger>
                  <SelectContent>
                    {niveaux.map((niveau) => (
                      <SelectItem key={niveau.value} value={niveau.value.toString()}>
                        {niveau.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Quel niveau souhaitez-vous atteindre ?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="statut"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Statut du développement *</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planifie">Planifié</SelectItem>
                  <SelectItem value="en-cours">En cours</SelectItem>
                  <SelectItem value="realise">Réalisé</SelectItem>
                  <SelectItem value="reporte">Reporté</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>
              Où en êtes-vous dans le développement de cette compétence ?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Échelle d'évaluation</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <div><strong>1 - Débutant :</strong> Connaissances de base, besoin d'accompagnement</div>
          <div><strong>2 - Élémentaire :</strong> Peut réaliser des tâches simples avec supervision</div>
          <div><strong>3 - Intermédiaire :</strong> Autonome sur la plupart des tâches</div>
          <div><strong>4 - Avancé :</strong> Maîtrise complète, peut former d'autres</div>
          <div><strong>5 - Expert :</strong> Référent reconnu, innovation et leadership</div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationSection;
