
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, MessageCircle, FileText, History } from "lucide-react";
import { Veille, StatutVeille } from "@/types/veille";
import { useToast } from "@/hooks/use-toast";

interface VeilleDetailProps {
  veille: Veille;
  onBack: () => void;
  onUpdateStatut: (id: string, statut: StatutVeille) => void;
  onUpdateAvancement: (id: string, avancement: number) => void;
  onAddCommentaire: (id: string, commentaire: string) => void;
}

const VeilleDetail = ({
  veille,
  onBack,
  onUpdateStatut,
  onUpdateAvancement,
  onAddCommentaire
}: VeilleDetailProps) => {
  const [nouveauCommentaire, setNouveauCommentaire] = useState("");
  const [avancementLocal, setAvancementLocal] = useState(veille.avancement);
  const { toast } = useToast();

  const getStatutLabel = (statut: StatutVeille) => {
    switch (statut) {
      case "nouvelle": return "Nouvelle";
      case "en-cours": return "En cours";
      case "terminee": return "Terminée";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "reglementaire": return "Réglementaire";
      case "metier": return "Métier";
      case "innovation": return "Innovation";
      default: return type;
    }
  };

  const handleStatusChange = (statut: StatutVeille) => {
    onUpdateStatut(veille.id, statut);
    toast({
      title: "Statut mis à jour",
      description: `Le statut a été changé vers "${getStatutLabel(statut)}"`,
    });
  };

  const saveAvancement = () => {
    onUpdateAvancement(veille.id, avancementLocal);
    toast({
      title: "Avancement sauvegardé",
      description: `Avancement mis à jour: ${avancementLocal}%`,
    });
  };

  const saveCommentaire = () => {
    if (nouveauCommentaire.trim()) {
      onAddCommentaire(veille.id, nouveauCommentaire.trim());
      setNouveauCommentaire("");
      toast({
        title: "Commentaire ajouté",
        description: "Le commentaire a été enregistré avec succès",
      });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{veille.titre}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{getTypeLabel(veille.type)}</Badge>
            <Badge variant={veille.statut === "terminee" ? "outline" : "default"}>
              {getStatutLabel(veille.statut)}
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="commentaires">
            <MessageCircle className="h-4 w-4 mr-2" />
            Commentaires ({veille.commentaires.length})
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            Documents ({veille.documents.length})
          </TabsTrigger>
          <TabsTrigger value="historique">
            <History className="h-4 w-4 mr-2" />
            Historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <p className="text-sm text-gray-600 mt-1">{veille.description}</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Date de création</label>
                  <p className="text-sm text-gray-600 mt-1">{formatDate(veille.dateCreation)}</p>
                </div>

                {veille.dateEcheance && (
                  <div>
                    <label className="text-sm font-medium">Date d'échéance</label>
                    <p className="text-sm text-gray-600 mt-1">{formatDate(veille.dateEcheance)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gestion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Statut</label>
                  <Select value={veille.statut} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nouvelle">Nouvelle</SelectItem>
                      <SelectItem value="en-cours">En cours</SelectItem>
                      <SelectItem value="terminee">Terminée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Avancement ({avancementLocal}%)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={avancementLocal}
                      onChange={(e) => setAvancementLocal(Number(e.target.value))}
                      className="w-full"
                    />
                    <Progress value={avancementLocal} className="h-2" />
                    <Button onClick={saveAvancement} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="commentaires">
          <Card>
            <CardHeader>
              <CardTitle>Commentaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {veille.commentaires.map((commentaire, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm">{commentaire}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Ajouté le {formatDateTime(new Date())}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Textarea
                  placeholder="Ajouter un commentaire..."
                  value={nouveauCommentaire}
                  onChange={(e) => setNouveauCommentaire(e.target.value)}
                />
                <Button onClick={saveCommentaire} disabled={!nouveauCommentaire.trim()}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Ajouter commentaire
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Aucun document ajouté</p>
                <Button variant="outline" className="mt-2">
                  Ajouter un document
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historique">
          <Card>
            <CardHeader>
              <CardTitle>Historique des actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Aucun historique disponible</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VeilleDetail;
