import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Rendezvous } from "@/hooks/useRendezvous";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText, Check } from "lucide-react";

interface CompteRenduFormProps {
  onSubmit: (synthese: string, notes?: string) => Promise<void>;
  onClose: () => void;
  initialData?: Rendezvous;
  loading?: boolean;
  onGenerate?: () => Promise<void>;
  generationLoading?: boolean;
}

export default function CompteRenduForm({
  onSubmit,
  onClose,
  initialData,
  loading = false,
  onGenerate,
  generationLoading = false,
}: CompteRenduFormProps) {
  const [synthese, setSynthese] = useState<string>(initialData?.synthese || "");
  const [notes, setNotes] = useState<string>(initialData?.commentaires || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(synthese, notes);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        {/* Section d'information sur le rendez-vous */}
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Informations du rendez-vous</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Participant</p>
                <p>{initialData?.prenomBeneficiaire} {initialData?.nomBeneficiaire}</p>
              </div>
              <div>
                <p className="font-semibold">Contact</p>
                <p>{initialData?.emailBeneficiaire}</p>
                <p>{initialData?.telephoneBeneficiaire}</p>
              </div>
            </div>
            <div className="pt-2">
              <p className="font-semibold">Objectifs de formation</p>
              <p>{Array.isArray(initialData?.objectifs) 
                ? initialData?.objectifs.join(", ") 
                : initialData?.objectifs}</p>
            </div>
            <div className="pt-2">
              <p className="font-semibold">Niveau actuel</p>
              <p>{initialData?.niveauBeneficiaire || "Non spécifié"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Champ de synthèse (compte rendu principal) */}
        <div className="space-y-2">
          <Label htmlFor="synthese" className="text-md font-semibold">
            Compte rendu du rendez-vous
          </Label>
          <Textarea
            id="synthese"
            placeholder="Synthèse du rendez-vous, évaluation du niveau, des besoins, recommandations..."
            className="min-h-[200px]"
            value={synthese}
            onChange={(e) => setSynthese(e.target.value)}
            required
          />
          <p className="text-sm text-gray-500">
            Cette synthèse sera utilisée pour générer le programme personnalisé et le dossier de formation.
          </p>
        </div>

        {/* Champ de notes internes */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-md font-semibold">
            Notes internes
          </Label>
          <Textarea
            id="notes"
            placeholder="Notes internes, non communiquées au participant"
            className="min-h-[100px]"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <p className="text-sm text-gray-500">
            Ces notes resteront confidentielles et ne seront pas incluses dans les documents générés.
          </p>
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading || !synthese}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            "Enregistrer le compte rendu"
          )}
        </Button>
        {onGenerate && (
          <Button
            type="button"
            onClick={onGenerate}
            disabled={generationLoading || loading || !synthese}
            className="ml-2"
          >
            {generationLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Générer programme et dossier
              </>
            )}
          </Button>
        )}
      </DialogFooter>
    </form>
  );
}
