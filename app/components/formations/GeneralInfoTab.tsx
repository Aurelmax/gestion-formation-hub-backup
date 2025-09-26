import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProgrammeFormation } from "@/types/programmes";

interface GeneralInfoTabProps {
  formData: Partial<ProgrammeFormation>;
  categories: Array<{
    id: string;
    code: string;
    titre: string;
    description: string;
  }>;
  onChange: (field: string, value: any) => void;
}

export const GeneralInfoTab = ({ formData, categories, onChange }: GeneralInfoTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="type">Type de programme *</Label>
        <Select
          value={formData.type || ""}
          onValueChange={(value) => onChange("type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="catalogue">Catalogue</SelectItem>
            <SelectItem value="personnalise">Personnalisé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="code">Code du programme *</Label>
        <Input
          id="code"
          value={formData.code}
          onChange={(e) => onChange("code", e.target.value)}
          placeholder="Ex: A008-BD-WC"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="titre">Titre du programme *</Label>
        <Input
          id="titre"
          value={formData.titre}
          onChange={(e) => onChange("titre", e.target.value)}
          placeholder="Ex: WordPress pour débutants"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="categorieId">Catégorie</Label>
        <Select
          value={formData.categorieId || "_null"}
          onValueChange={(value) => onChange("categorieId", value === "_null" ? null : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_null">Aucune catégorie</SelectItem>
            {categories?.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>{cat.titre}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Description du programme"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pictogramme">Pictogramme</Label>
        <Input
          id="pictogramme"
          value={formData.pictogramme}
          onChange={(e) => onChange("pictogramme", e.target.value)}
          placeholder="📚"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="duree">Durée</Label>
        <Input
          id="duree"
          value={formData.duree}
          onChange={(e) => onChange("duree", e.target.value)}
          placeholder="Ex: 21h (3 jours)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="prix">Prix</Label>
        <Input
          id="prix"
          value={formData.prix}
          onChange={(e) => onChange("prix", e.target.value)}
          placeholder="Ex: 1500€"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="modalites">Modalités</Label>
        <Input
          id="modalites"
          value={formData.modalites}
          onChange={(e) => onChange("modalites", e.target.value)}
          placeholder="A distance ou présentiel"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="niveau">Niveau</Label>
        <Select
          value={formData.niveau || ""}
          onValueChange={(value) => onChange("niveau", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un niveau" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Débutant">Débutant</SelectItem>
            <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
            <SelectItem value="Avancé">Avancé</SelectItem>
            <SelectItem value="Expert">Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="participants">Participants</Label>
        <Input
          id="participants"
          value={formData.participants}
          onChange={(e) => onChange("participants", e.target.value)}
          placeholder="Ex: 1 à 5"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="programmeUrl">URL du programme HTML</Label>
        <Input
          id="programmeUrl"
          value={formData.programmeUrl || ""}
          onChange={(e) => onChange("programmeUrl", e.target.value || null)}
          placeholder="Ex: /programmes/wordpress-debutant.html"
        />
      </div>
    </div>
  );
};