import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgrammeFormHeader } from "./ProgrammeFormHeader";
import { GeneralInfoTab } from "./GeneralInfoTab";
import { ContentTab } from "./ContentTab";
import { RegulatoryTab } from "./RegulatoryTab";
import { CustomTab } from "./CustomTab";
import { ProgrammeFormProps } from "./types";
import { useFormationForm } from "@/hooks/useFormationForm";

const ProgrammeForm = ({ programme, onSubmit, onCancel, categories }: ProgrammeFormProps) => {
  const {
    formData,
    objectifsArray,
    handleSubmit,
    handleChange,
    addObjectif,
    removeObjectif,
    updateObjectif
  } = useFormationForm({ programme, onSubmit });

  return (
    <div className="space-y-6">
      <ProgrammeFormHeader isEdit={!!programme} onCancel={onCancel} />

      <Card>
        <CardHeader>
          <CardTitle>Programme de formation {formData.type === "catalogue" ? "catalogue" : "personnalise"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="infos" className="space-y-6">
              <TabsList>
                <TabsTrigger value="infos">Informations générales</TabsTrigger>
                <TabsTrigger value="contenu">Contenu pédagogique</TabsTrigger>
                <TabsTrigger value="reglementaire">Informations réglementaires</TabsTrigger>
                {formData.type === "personnalise" && (
                  <TabsTrigger value="surmesure">Spécificités personnalise</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="infos" className="space-y-6">
                <GeneralInfoTab
                  formData={formData}
                  categories={categories}
                  onChange={handleChange}
                />
              </TabsContent>

              <TabsContent value="contenu" className="space-y-6">
                <ContentTab
                  formData={formData}
                  objectives={objectifsArray}
                  onObjectiveUpdate={updateObjectif}
                  onAddObjective={addObjectif}
                  onRemoveObjective={removeObjectif}
                  onChange={handleChange}
                />
              </TabsContent>

              <TabsContent value="reglementaire" className="space-y-6">
                <RegulatoryTab
                  formData={formData}
                  onChange={handleChange}
                />
              </TabsContent>

              {formData.type === "personnalise" && (
                <TabsContent value="surmesure" className="space-y-6">
                  <CustomTab
                    formData={formData}
                    onChange={handleChange}
                  />
                </TabsContent>
              )}
            </Tabs>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                {programme ? "Modifier" : "Créer"} le programme
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgrammeForm;
