
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileCheck, Download, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ConformiteQualiopi = () => {
  const { toast } = useToast();

  const formations = [
    {
      id: "1",
      titre: "WordPress pour débutants",
      apprenants: 5,
      documents: {
        convention: 5,
        convocation: 5,
        feuille_emargement: 3,
        attestation: 2,
        evaluation_chaud: 1,
        evaluation_froid: 0
      }
    },
    {
      id: "2", 
      titre: "WordPress avancé",
      apprenants: 3,
      documents: {
        convention: 3,
        convocation: 3,
        feuille_emargement: 3,
        attestation: 3,
        evaluation_chaud: 3,
        evaluation_froid: 2
      }
    }
  ];

  const documentsRequis = [
    { key: "convention", label: "Conventions de formation", requis: true },
    { key: "convocation", label: "Convocations", requis: true },
    { key: "feuille_emargement", label: "Feuilles d'émargement", requis: true },
    { key: "attestation", label: "Attestations", requis: true },
    { key: "evaluation_chaud", label: "Évaluations à chaud", requis: true },
    { key: "evaluation_froid", label: "Évaluations à froid", requis: false }
  ];

  const getCompletionStatus = (formation: any, docKey: string) => {
    const count = formation.documents[docKey] || 0;
    const total = formation.apprenants;
    return { count, total, isComplete: count >= total };
  };

  const generateConformityDocs = (formationId: string) => {
    toast({
      title: "Génération en cours",
      description: "Les documents de conformité sont en cours de génération...",
    });
    
    // Simulation de génération PDF
    setTimeout(() => {
      toast({
        title: "Documents générés",
        description: "Les documents de conformité ont été générés avec succès.",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Conformité Qualiopi</h2>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exporter le rapport
        </Button>
      </div>

      <div className="grid gap-6">
        {formations.map((formation) => (
          <Card key={formation.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5" />
                    {formation.titre}
                  </CardTitle>
                  <p className="text-gray-600">
                    {formation.apprenants} apprenants inscrits
                  </p>
                </div>
                <Button 
                  onClick={() => generateConformityDocs(formation.id)}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Générer les documents
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documentsRequis.map((doc) => {
                  const status = getCompletionStatus(formation, doc.key);
                  const isComplete = status.isComplete;
                  const isRequired = doc.requis;
                  
                  return (
                    <div key={doc.key} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{doc.label}</span>
                        {isComplete ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : isRequired ? (
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                        ) : (
                          <div className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {status.count}/{status.total}
                        </span>
                        <Badge 
                          variant={isComplete ? "default" : isRequired ? "destructive" : "secondary"}
                        >
                          {isComplete 
                            ? "Complet" 
                            : isRequired 
                            ? "Manquant" 
                            : "Optionnel"
                          }
                        </Badge>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            isComplete ? "bg-green-500" : "bg-orange-500"
                          }`}
                          style={{ width: `${(status.count / status.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actions Qualiopi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <FileCheck className="h-6 w-6" />
              <span>Audit de conformité</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Download className="h-6 w-6" />
              <span>Export traçabilité</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <AlertTriangle className="h-6 w-6" />
              <span>Alertes manquantes</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConformiteQualiopi;
