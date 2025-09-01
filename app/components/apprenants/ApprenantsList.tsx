
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Eye, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ApprenantForm from "./ApprenantForm";
import ApprenantDetail from "./ApprenantDetail";
import { useApprenants } from "@/hooks/useApprenants";

const ApprenantsList = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedApprenant, setSelectedApprenant] = useState(null);
  const [editingApprenant, setEditingApprenant] = useState(null);
  const { toast } = useToast();
  const { apprenants, loading, createApprenant, updateApprenant } = useApprenants();

  const handleCreate = async (apprenantData: any) => {
    try {
      await createApprenant(apprenantData);
      setShowForm(false);
      toast({
        title: "Apprenant créé",
        description: "L'apprenant a été créé avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création.",
        variant: "destructive",
      });
    }
  };

  if (selectedApprenant) {
    return (
      <ApprenantDetail
        apprenant={selectedApprenant}
        onBack={() => setSelectedApprenant(null)}
      />
    );
  }

  if (showForm || editingApprenant) {
    return (
      <ApprenantForm
        apprenant={editingApprenant}
        onSubmit={handleCreate}
        onCancel={() => {
          setShowForm(false);
          setEditingApprenant(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Apprenants</h2>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvel apprenant
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apprenants.map((apprenant) => (
            <Card key={apprenant.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{apprenant.nom}</CardTitle>
                <p className="text-sm text-gray-600">{apprenant.email}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4">
                  {apprenant.telephone || "Téléphone non renseigné"}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedApprenant(apprenant)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingApprenant(apprenant)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprenantsList;
