
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ArrowLeft, Save } from "lucide-react";
import { Competence, CompetenceFormData } from "@/types/competence";
import GeneralInfoSection from "./GeneralInfoSection";
import EvaluationSection from "./EvaluationSection";
import ActionPlanSection from "./ActionPlanSection";
import EvidenceSection from "./EvidenceSection";

interface CompetenceFormProps {
  competence?: Competence | null;
  onSubmit: (data: Omit<Competence, "id" | "dateCreation" | "dateModification">) => void;
  onCancel: () => void;
}

const CompetenceForm = ({ competence, onSubmit, onCancel }: CompetenceFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const form = useForm<CompetenceFormData>({
    defaultValues: competence ? {
      nom: competence.nom,
      description: competence.description,
      categorie: competence.categorie,
      domaineDeveloppement: competence.domaineDeveloppement,
      niveauActuel: competence.niveauActuel,
      objectifNiveau: competence.objectifNiveau,
      statut: competence.statut,
      actionPrevue: competence.actionPrevue,
      plateformeFomation: competence.plateformeFomation,
      lienFormation: competence.lienFormation,
      typePreuve: competence.typePreuve,
      contenuPreuve: competence.contenuPreuve
    } : {
      nom: "",
      description: "",
      categorie: "technique",
      domaineDeveloppement: "",
      niveauActuel: 1,
      objectifNiveau: 1,
      statut: "planifie",
      actionPrevue: "",
      plateformeFomation: "",
      lienFormation: "",
      typePreuve: "fichier",
      contenuPreuve: ""
    }
  });

  const steps = [
    { title: "Informations générales", component: GeneralInfoSection },
    { title: "Évaluation", component: EvaluationSection },
    { title: "Plan d'action", component: ActionPlanSection },
    { title: "Preuves", component: EvidenceSection }
  ];

  const handleSubmit = (data: CompetenceFormData) => {
    onSubmit({
      ...data,
      formateurId: "current-user-id" // À remplacer par l'ID réel du formateur connecté
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h2 className="text-2xl font-bold">
            {competence ? 'Modifier la Compétence' : 'Nouvelle Compétence'}
          </h2>
          <p className="text-gray-600">
            Étape {currentStep + 1} sur {steps.length}: {steps[currentStep].title}
          </p>
        </div>
      </div>

      <div className="flex justify-between mb-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex-1 h-2 mx-1 rounded ${
              index <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CurrentStepComponent form={form} />
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Précédent
                </Button>
              )}
              {currentStep < steps.length - 1 && (
                <Button type="button" onClick={nextStep}>
                  Suivant
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
              {currentStep === steps.length - 1 && (
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {competence ? 'Mettre à jour' : 'Créer'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CompetenceForm;
