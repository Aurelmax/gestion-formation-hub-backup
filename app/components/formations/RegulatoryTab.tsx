import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProgrammeFormation } from "@/types/programmes";

interface RegulatoryTabProps {
  formData: Partial<ProgrammeFormation>;
  onChange: (field: string, value: any) => void;
}

export const RegulatoryTab = ({ formData, onChange }: RegulatoryTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="publicConcerne">Public concerné</Label>
        <Textarea
          id="publicConcerne"
          value={formData.publicConcerne}
          onChange={(e) => onChange("publicConcerne", e.target.value)}
          placeholder="Public cible de la formation"
          rows={2}
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="modalitesAcces">Modalités d'accès</Label>
        <Textarea
          id="modalitesAcces"
          value={formData.modalitesAcces}
          onChange={(e) => onChange("modalitesAcces", e.target.value)}
          placeholder="Modalités d'accès à la formation"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="modalitesTechniques">Modalités techniques</Label>
        <Textarea
          id="modalitesTechniques"
          value={formData.modalitesTechniques}
          onChange={(e) => onChange("modalitesTechniques", e.target.value)}
          placeholder="Modalités techniques de la formation"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="modalitesReglement">Modalités de règlement</Label>
        <Textarea
          id="modalitesReglement"
          value={formData.modalitesReglement}
          onChange={(e) => onChange("modalitesReglement", e.target.value)}
          placeholder="Modalités de règlement"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="formateur">Formateur</Label>
        <Textarea
          id="formateur"
          value={formData.formateur}
          onChange={(e) => onChange("formateur", e.target.value)}
          placeholder="Informations sur le formateur"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ressourcesDisposition">Ressources à disposition</Label>
        <Textarea
          id="ressourcesDisposition"
          value={formData.ressourcesDisposition}
          onChange={(e) => onChange("ressourcesDisposition", e.target.value)}
          placeholder="Ressources mises à disposition des apprenants"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="modalitesEvaluation">Modalités d'évaluation</Label>
        <Textarea
          id="modalitesEvaluation"
          value={formData.modalitesEvaluation}
          onChange={(e) => onChange("modalitesEvaluation", e.target.value)}
          placeholder="Modalités d'évaluation des apprenants"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sanctionFormation">Sanction de la formation</Label>
        <Textarea
          id="sanctionFormation"
          value={formData.sanctionFormation}
          onChange={(e) => onChange("sanctionFormation", e.target.value)}
          placeholder="Sanction de la formation (certificat, attestation...)"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="niveauCertification">Niveau/certification obtenue</Label>
        <Input
          id="niveauCertification"
          value={formData.niveauCertification}
          onChange={(e) => onChange("niveauCertification", e.target.value)}
          placeholder="Niveau ou certification obtenue"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="delaiAcceptation">Délai d'acceptation</Label>
        <Input
          id="delaiAcceptation"
          value={formData.delaiAcceptation}
          onChange={(e) => onChange("delaiAcceptation", e.target.value)}
          placeholder="Délai d'acceptation de la formation"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="accessibiliteHandicap">Accessibilité handicap</Label>
        <Textarea
          id="accessibiliteHandicap"
          value={formData.accessibiliteHandicap}
          onChange={(e) => onChange("accessibiliteHandicap", e.target.value)}
          placeholder="Informations sur l'accessibilité aux personnes en situation de handicap"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cessationAbandon">Cessation anticipée/abandon</Label>
        <Textarea
          id="cessationAbandon"
          value={formData.cessationAbandon}
          onChange={(e) => onChange("cessationAbandon", e.target.value)}
          placeholder="Conditions en cas de cessation anticipée ou d'abandon"
          rows={2}
        />
      </div>
    </div>
  );
};