
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit, FileText, Users } from "lucide-react";
import { useAccessibilite } from "@/hooks/useAccessibilite";
import PlanAccessibiliteForm from "./PlanAccessibiliteForm";
import DemandeAccessibiliteDetail from "./DemandeAccessibiliteDetail";

const AccessibiliteManager = () => {
  const { plansAccessibilite, demandesAccessibilite, loading, traiterDemande } = useAccessibilite();
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState<string | null>(null);

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "Validé":
      case "Validée":
        return "bg-green-100 text-green-800";
      case "En cours":
      case "En cours d'analyse":
        return "bg-blue-100 text-blue-800";
      case "À réviser":
      case "En attente":
        return "bg-yellow-100 text-yellow-800";
      case "Refusée":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Accessibilité & Handicap</h2>
          <p className="text-gray-600">Gestion des adaptations et de l'accessibilité</p>
        </div>
        <Button onClick={() => setShowPlanForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouveau plan d'accessibilité
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{plansAccessibilite.length}</p>
                <p className="text-gray-600">Plans d'accessibilité</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{demandesAccessibilite.length}</p>
                <p className="text-gray-600">Demandes d'adaptation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">
                  {demandesAccessibilite.filter(d => d.statut === "En cours d'analyse").length}
                </p>
                <p className="text-gray-600">En cours d'analyse</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList>
          <TabsTrigger value="plans">Plans d'accessibilité</TabsTrigger>
          <TabsTrigger value="demandes">Demandes d'adaptation</TabsTrigger>
        </TabsList>

        <TabsContent value="plans">
          <div className="grid gap-4">
            {plansAccessibilite.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{plan.titre}</CardTitle>
                      <p className="text-gray-600 mt-1">{plan.description}</p>
                    </div>
                    <Badge className={getStatutColor(plan.statut)}>
                      {plan.statut}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-sm text-gray-700">Type de handicap</p>
                      <p className="text-sm">{plan.typeHandicap}</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-700">Responsable</p>
                      <p className="text-sm">{plan.responsable}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="font-medium text-sm text-gray-700">Adaptations pédagogiques</p>
                    <p className="text-sm mt-1">{plan.adaptationsPedagogiques}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Détails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="demandes">
          <div className="grid gap-4">
            {demandesAccessibilite.map((demande) => (
              <Card key={demande.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{demande.apprenantNom}</CardTitle>
                      <p className="text-gray-600">{demande.apprenantEmail}</p>
                    </div>
                    <Badge className={getStatutColor(demande.statut)}>
                      {demande.statut}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-sm text-gray-700">Type de handicap</p>
                      <p className="text-sm">{demande.typeHandicap}</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-700">Documents médicaux</p>
                      <p className="text-sm">{demande.documentsMedicaux ? "Fournis" : "Non fournis"}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="font-medium text-sm text-gray-700">Besoins spécifiques</p>
                    <p className="text-sm mt-1">{demande.besoinsSpecifiques}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedDemande(demande.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Traiter
                    </Button>
                    {demande.statut === "En attente" && (
                      <Button 
                        size="sm"
                        onClick={() => traiterDemande(demande.id, "Validée")}
                      >
                        Valider
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {showPlanForm && (
        <PlanAccessibiliteForm onClose={() => setShowPlanForm(false)} />
      )}

      {selectedDemande && (
        <DemandeAccessibiliteDetail 
          demandeId={selectedDemande}
          onClose={() => setSelectedDemande(null)}
          onTraiter={traiterDemande}
        />
      )}
    </div>
  );
};

export default AccessibiliteManager;
