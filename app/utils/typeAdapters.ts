// Adaptateurs pour convertir entre les différentes interfaces de l'application
import { ProgrammeFormation } from '@/hooks/useProgrammesFormation';
import { Formation as PdfFormation } from './pdfGenerator';

/**
 * Convertit un ProgrammeFormation en Formation pour la génération de PDF
 */
export const programmeFormationToPdfFormation = (programme: ProgrammeFormation): PdfFormation => {
  return {
    id: programme.id,
    code: programme.code || '',
    libelle: programme.titre,
    duree: programme.duree?.toString() || '',
    objectifsPedagogiques: programme.objectifs?.toString() || '',
    contenuDetailleJours: programme.contenuDetailleJours || programme.contenuDetailleHtml || '',
    prerequis: programme.prerequis || '',
    publicConcerne: programme.publicConcerne || '',
    horaires: programme.modalites?.split('\n')?.[0] || '',
    modalitesAcces: programme.modalitesAcces || '',
    tarif: programme.prix?.toString() || '',
    modalitesReglement: programme.modalitesReglement || '',
    contactOrganisme: programme.accessibiliteHandicap || '',
    referentPedagogique: programme.formateur || '',
    referentQualite: programme.formateur || '',
    modalitesTechniques: programme.modalitesTechniques || '',
    formateur: programme.formateur || '',
    ressourcesDisposition: programme.ressourcesDisposition || '',
    modalitesEvaluation: programme.modalitesEvaluation || '',
    sanctionFormation: programme.sanctionFormation || '',
    niveauCertification: programme.niveauCertification || programme.niveau || ''
  };
};
