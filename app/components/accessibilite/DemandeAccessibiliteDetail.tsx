
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAccessibilite } from "@/hooks/useAccessibilite";
import { useToast } from "@/hooks/use-toast";

interface DemandeAccessibiliteDetailProps {
  demandeId: string;
  onClose: () => void;
  onTraiter: (id: string, statut: any, commentaires?: string) => void;
}

const DemandeAccessibiliteDetail = ({ demandeId, onClose, onTraiter }: DemandeAccessibiliteDetailProps) => {
  const { demandesAccessibilite } = useAccessibilite();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const demande = demandesAccessibilite.find(d => d.id === demandeId);
  const [nouveauStatut, setNouveauStatut] = useState(demande?.statut || "");
  const [commentaires, setCommentaires] = useState(demande?.commentaires || "");

  if (!demande) {
    return null;
  }

  const handleTraitement = async () => {
    setLoading(true);
    try {
      await onTraiter(demandeId, nouveauStatut, commentaires);
      toast({
        title: "Demande traitée",
        description: "La demande d'accessibilité a été mise à jour.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "Validée":
        return "bg-green-100 text-green-800";
      case "En cours d'analyse":
        return "bg-blue-100 text-blue-800";
      case "En attente":
        return "bg-yellow-100 text-yellow-800";
      case "Refusée":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Demande d'accessibilité - {demande.apprenantNom}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Apprenant</Label>
              <p className="text-sm mt-1">{demande.apprenantNom}</p>
              <p className="text-sm text-gray-600">{demande.apprenantEmail}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Statut actuel</Label>
              <div className="mt-1">
                <Badge className={getStatutColor(demande.statut)}>
                  {demande.statut}
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">Type de handicap</Label>
            <p className="text-sm mt-1">{demande.typeHandicap}</p>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">Besoins spécifiques</Label>
            <p className="text-sm mt-1">{demande.besoinsSpecifiques}</p>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">Documents médicaux</Label>
            <p className="text-sm mt-1">
              {demande.documentsMedicaux ? "✅ Fournis" : "❌ Non fournis"}
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">Date de création</Label>
            <p className="text-sm mt-1">
              {new Date(demande.dateCreation).toLocaleDateString('fr-FR')}
            </p>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Traitement de la demande</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="statut">Nouveau statut</Label>
                <Select
                  value={nouveauStatut}
                  onValueChange={setNouveauStatut}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="En attente">En attente</SelectItem>
                    <SelectItem value="En cours d'analyse">En cours d'analyse</SelectItem>
                    <SelectItem value="Validée">Validée</SelectItem>
                    <SelectItem value="Refusée">Refusée</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="commentaires">Commentaires</Label>
                <Textarea
                  id="commentaires"
                  value={commentaires}
                  onChange={(e) => setCommentaires(e.target.value)}
                  placeholder="Ajouter des commentaires sur le traitement..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleTraitement} disabled={loading}>
              {loading ? "Traitement..." : "Traiter la demande"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemandeAccessibiliteDetail;
