import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProgrammesFormation } from "@/hooks/useProgrammesFormation";
import { ProgrammeFormation } from "@/types/programmes";
import { useToast } from "@/hooks/use-toast";

interface DirectEditFormProps {
  programmeId: string;
  onBack: () => void;
}

const DirectEditForm = ({ programmeId, onBack }: DirectEditFormProps) => {
  const { programmes, updateProgramme, loading } = useProgrammesFormation();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<ProgrammeFormation>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Récupérer les données du programme à éditer
  useEffect(() => {
    console.log("DirectEditForm - programmeId:", programmeId);
    console.log("DirectEditForm - programmes disponibles:", programmes);
    
    if (programmeId && programmes.length > 0) {
      const programmeToEdit = programmes.find(p => p.id === programmeId);
      console.log("DirectEditForm - programme trouvé:", programmeToEdit);
      
      if (programmeToEdit) {
        setFormData(programmeToEdit);
        setIsLoading(false);
      } else {
        console.error("Programme non trouvé avec ID:", programmeId);
        toast({
          title: "Erreur",
          description: `Programme avec ID ${programmeId} non trouvé.`,
          variant: "destructive"
        });
      }
    }
  }, [programmeId, programmes, toast]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log("DirectEditForm - Soumission du formulaire avec données:", formData);
      await updateProgramme(formData);
      
      toast({
        title: "Programme mis à jour",
        description: "Le programme a été mis à jour avec succès."
      });
      
      onBack();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le programme.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button onClick={onBack} variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
        <h1 className="text-2xl font-bold">Formulaire d'édition directe</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Édition simplifiée de {formData.titre || "programme"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titre">Titre</Label>
                <Input
                  id="titre"
                  value={formData.titre || ""}
                  onChange={(e) => handleChange("titre", e.target.value)}
                  placeholder="Titre du programme"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={formData.code || ""}
                  onChange={(e) => handleChange("code", e.target.value)}
                  placeholder="Code du programme"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type || "catalogue"}
                  onValueChange={(value) => handleChange("type", value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="catalogue">Catalogue</SelectItem>
                    <SelectItem value="personnalise">Personnalisé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="niveau">Niveau</Label>
                <Select
                  value={formData.niveau || "Débutant"}
                  onValueChange={(value) => handleChange("niveau", value)}
                >
                  <SelectTrigger id="niveau">
                    <SelectValue placeholder="Sélectionner un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Débutant">Débutant</SelectItem>
                    <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                    <SelectItem value="Avancé">Avancé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Description du programme"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duree">Durée</Label>
              <Input
                id="duree"
                value={formData.duree || ""}
                onChange={(e) => handleChange("duree", e.target.value)}
                placeholder="Durée de la formation"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="prix">Prix</Label>
              <Input
                id="prix"
                value={formData.prix || ""}
                onChange={(e) => handleChange("prix", e.target.value)}
                placeholder="Prix de la formation"
              />
            </div>
            
            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Enregistrer les modifications
              </Button>
              <Button type="button" variant="outline" onClick={onBack}>
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DirectEditForm;
