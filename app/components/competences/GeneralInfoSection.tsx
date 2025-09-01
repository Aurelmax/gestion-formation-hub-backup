
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { CompetenceFormData } from "@/types/competence";

interface GeneralInfoSectionProps {
  form: UseFormReturn<CompetenceFormData>;
}

const GeneralInfoSection = ({ form }: GeneralInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="nom"
        rules={{ required: "Le nom de la compétence est obligatoire" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom de la compétence *</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Maîtrise de WordPress" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        rules={{ required: "La description est obligatoire" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Description détaillée de la compétence"
                rows={4}
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="categorie"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie *</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technique">Technique</SelectItem>
                    <SelectItem value="pedagogique">Pédagogique</SelectItem>
                    <SelectItem value="relationnelle">Relationnelle</SelectItem>
                    <SelectItem value="organisationnelle">Organisationnelle</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="domaineDeveloppement"
          rules={{ required: "Le domaine de développement est obligatoire" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domaine de développement *</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Développement Web" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default GeneralInfoSection;
