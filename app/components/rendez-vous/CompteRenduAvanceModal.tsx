import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { FileText } from "lucide-react";
import { Rendezvous } from "@/hooks/useRendezvous";
import CompteRenduAvanceForm from "./CompteRenduAvanceForm";
import api from "@/services/api";

interface CompteRenduAvanceModalProps {
  rendezvous: Rendezvous | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CompteRenduAvanceModal({
  rendezvous,
  isOpen,
  onClose,
  onSuccess,
}: CompteRenduAvanceModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [generationLoading, setGenerationLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    if (!rendezvous?.id) {
      toast({
        title: "Erreur",
        description: "Impossible d'identifier le rendez-vous",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await api.put(`/rendezvous/${rendezvous.id}/compte-rendu`, {
        ...data,
        rendezvousId: rendezvous.id,
      });
      
      toast({
        title: "Compte rendu enregistré",
        description: "Le compte rendu a été enregistré avec succès",
      });
      
      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du compte rendu:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le compte rendu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateProgramme = async () => {
    if (!rendezvous?.id) {
      toast({
        title: "Erreur",
        description: "Impossible d'identifier le rendez-vous",
        variant: "destructive",
      });
      return { programmeId: "", dossierId: "" };
    }

    try {
      setGenerationLoading(true);
      const response = await api.post(`/rendezvous/${rendezvous.id}/generer-programme-dossier`);
      
      toast({
        title: "Programme et dossier générés",
        description: "Le programme personnalisé et le dossier ont été générés avec succès",
      });
      
      if (onSuccess) {
        onSuccess();
      }

      onClose();
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la génération du programme et du dossier:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le programme et le dossier",
        variant: "destructive",
      });
      return { programmeId: "", dossierId: "" };
    } finally {
      setGenerationLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <span>Compte rendu - {rendezvous?.prenomBeneficiaire} {rendezvous?.nomBeneficiaire}</span>
          </DialogTitle>
          <DialogDescription>
            Complétez le compte rendu du rendez-vous et générez un programme personnalisé
          </DialogDescription>
        </DialogHeader>

        {rendezvous && (
          <CompteRenduAvanceForm
            onSubmit={handleSubmit}
            onClose={onClose}
            onGenerateProgramme={handleGenerateProgramme}
            initialData={rendezvous}
            loading={loading}
            generationLoading={generationLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
