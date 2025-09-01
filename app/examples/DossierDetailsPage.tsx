import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import api from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DocumentGenerator from "@/components/documents/DocumentGenerator";
import { Loader2 } from "lucide-react";

interface DossierData {
  id: string;
  refDevis: string;
  apprenant: {
    nom: string;
    prenom: string;
  };
  formation: {
    titre: string;
  };
  dateDebut: string;
  dateFin: string;
  // Autres champs du dossier
}

export default function DossierDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const [dossier, setDossier] = useState<DossierData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDossier = async () => {
      try {
        const response = await api.get(`/dossiers/${id}`);
        setDossier(response.data);
      } catch (err) {
        setError("Impossible de charger les détails du dossier");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDossier();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error || !dossier) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-md">
        {error || "Dossier non trouvé"}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">
          Dossier {dossier.refDevis}
        </h1>
        <p className="text-gray-500">
          {dossier.apprenant.prenom} {dossier.apprenant.nom} - {dossier.formation.titre}
        </p>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations du dossier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-gray-500">Référence</h3>
                  <p>{dossier.refDevis}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-gray-500">Formation</h3>
                  <p>{dossier.formation.titre}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-gray-500">Apprenant</h3>
                  <p>{dossier.apprenant.prenom} {dossier.apprenant.nom}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-gray-500">Période</h3>
                  <p>Du {new Date(dossier.dateDebut).toLocaleDateString('fr-FR')} au {new Date(dossier.dateFin).toLocaleDateString('fr-FR')}</p>
                </div>
                {/* Autres informations du dossier */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="mt-4">
          {/* Intégration de notre composant DocumentGenerator */}
          <DocumentGenerator 
            dossierId={dossier.id} 
            refDevis={dossier.refDevis}
          />
        </TabsContent>
        
        <TabsContent value="planning" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Planning des sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Planning à venir...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
