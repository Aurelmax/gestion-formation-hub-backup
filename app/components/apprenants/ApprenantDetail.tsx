
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Award, Calendar } from "lucide-react";

interface ApprenantDetailProps {
  apprenant: any;
  onBack: () => void;
}

const ApprenantDetail = ({ apprenant, onBack }: ApprenantDetailProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{apprenant.nom}</h2>
          <p className="text-gray-600">{apprenant.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border rounded">
                <span>Convention de formation</span>
                <Badge variant="secondary">PDF</Badge>
              </div>
              <div className="flex justify-between items-center p-3 border rounded">
                <span>Attestation de présence</span>
                <Badge variant="secondary">PDF</Badge>
              </div>
              <Button variant="outline" className="w-full">
                Ajouter un document
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Évaluations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Évaluation de positionnement</span>
                  <Badge variant="outline">15/20</Badge>
                </div>
                <p className="text-sm text-gray-600">Bon niveau de base</p>
              </div>
              <div className="p-3 border rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Évaluation à chaud</span>
                  <Badge variant="outline">18/20</Badge>
                </div>
                <p className="text-sm text-gray-600">Très satisfait de la formation</p>
              </div>
              <Button variant="outline" className="w-full">
                Ajouter une évaluation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Rendez-vous
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Entretien de positionnement</span>
                <Badge>Terminé</Badge>
              </div>
              <p className="text-sm text-gray-600">15/03/2024 - Téléphone</p>
              <p className="text-sm mt-2">Synthèse: Bonnes bases, motivé pour apprendre WordPress</p>
            </div>
            <Button variant="outline" className="w-full">
              Planifier un rendez-vous
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprenantDetail;
