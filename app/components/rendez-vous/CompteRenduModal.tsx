import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CompteRenduForm from './CompteRenduForm';
import { Rendezvous, useRendezvous } from '@/hooks/useRendezvous';
import { useToast } from '@/components/ui/use-toast';

interface CompteRenduModalProps {
  rendezvous: Rendezvous | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CompteRenduModal({
  rendezvous,
  isOpen,
  onClose,
  onSuccess
}: CompteRenduModalProps) {
  const [loading, setLoading] = useState(false);
  const [generationLoading, setGenerationLoading] = useState(false);
  const { editerCompteRendu, genererProgrammeEtDossier } = useRendezvous();
  const { toast } = useToast();

  const handleSubmit = async (synthese: string, notes?: string) => {
    if (!rendezvous) return;
    
    try {
      setLoading(true);
      await editerCompteRendu(rendezvous.id, synthese, notes);
      toast({
        title: 'Compte rendu enregistré',
        description: 'Le compte rendu du rendez-vous a été enregistré avec succès.',
        variant: 'default',
      });
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du compte rendu:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'enregistrement du compte rendu.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGeneration = async () => {
    if (!rendezvous) return;
    
    try {
      setGenerationLoading(true);
      const result = await genererProgrammeEtDossier(rendezvous.id);
      toast({
        title: 'Génération réussie',
        description: `Le programme personnalisé et le dossier ont été générés avec succès. (Programme ID: ${result.programmeId}, Dossier ID: ${result.dossierId})`,
        variant: 'default',
      });
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Erreur lors de la génération du programme et du dossier:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la génération du programme et du dossier.',
        variant: 'destructive',
      });
    } finally {
      setGenerationLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {rendezvous ? 'Éditer le compte rendu du rendez-vous' : 'Nouveau compte rendu'}
          </DialogTitle>
        </DialogHeader>
        {rendezvous && (
          <CompteRenduForm
            initialData={rendezvous}
            onSubmit={handleSubmit}
            onClose={onClose}
            loading={loading}
            onGenerate={handleGeneration}
            generationLoading={generationLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
