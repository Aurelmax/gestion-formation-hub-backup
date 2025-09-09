import { Competence } from "@/types/competence";
import { Reclamation } from "@/hooks/useReclamations";
import { ActionCorrective } from "@/hooks/useActionsCorrectives";

export const exportCompetencesToCSV = (competences: Competence[]) => {
  const headers = [
    'Nom',
    'Description',
    'Catégorie',
    'Domaine de Développement',
    'Niveau Actuel',
    'Objectif Niveau',
    'Progression (%)',
    'Statut',
    'Action Prévue',
    'Plateforme Formation',
    'Lien Formation',
    'Type Preuve',
    'Contenu Preuve',
    'Date Création',
    'Date Modification'
  ];

  const csvContent = [
    headers.join(','),
    ...competences.map(competence => [
      `"${competence.nom}"`,
      `"${competence.description}"`,
      `"${competence.categorie}"`,
      `"${competence.domaineDeveloppement}"`,
      competence.niveauActuel,
      competence.objectifNiveau,
      Math.round((competence.niveauActuel / competence.objectifNiveau) * 100),
      `"${competence.statut}"`,
      `"${competence.actionPrevue}"`,
      `"${competence.plateformeFomation || ''}"`,
      `"${competence.lienFormation || ''}"`,
      `"${competence.typePreuve}"`,
      `"${competence.contenuPreuve}"`,
      `"${competence.dateCreation ? new Date(competence.dateCreation).toLocaleDateString('fr-FR') : ''}"`,
      `"${competence.dateModification ? new Date(competence.dateModification).toLocaleDateString('fr-FR') : ''}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `competences_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportReclamationsToCSV = (reclamations: Reclamation[]) => {
  const headers = [
    'ID',
    'Date Création',
    'Nom',
    'Email',
    'Téléphone',
    'Sujet',
    'Message',
    'Statut',
    'Priorité',
    'Date Résolution',
    'Notes Internes',
    'Durée Résolution (jours)',
    'Dernière Modification'
  ];

  const csvContent = [
    headers.join(','),
    ...reclamations.map(reclamation => {
      const dateCreation = new Date(reclamation.created_at);
      const dureeResolution = reclamation.date_resolution 
        ? Math.round((new Date(reclamation.date_resolution).getTime() - dateCreation.getTime()) / (1000 * 60 * 60 * 24))
        : '';

      return [
        `"${reclamation.id.substring(0, 8)}"`,
        `"${dateCreation.toLocaleDateString('fr-FR')}"`,
        `"${reclamation.nom}"`,
        `"${reclamation.email}"`,
        `"${reclamation.telephone || ''}"`,
        `"${reclamation.sujet}"`,
        `"${reclamation.message.replace(/"/g, '""')}"`,
        `"${reclamation.statut}"`,
        `"${reclamation.priorite}"`,
        `"${reclamation.date_resolution ? new Date(reclamation.date_resolution).toLocaleDateString('fr-FR') : ''}"`,
        `"${(reclamation.notes_internes || '').replace(/"/g, '""')}"`,
        `"${dureeResolution}"`,
        `"${new Date(reclamation.updated_at).toLocaleDateString('fr-FR')}"`
      ].join(',');
    })
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reclamations_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportActionsCorrectivesToCSV = (actionsCorrectives: ActionCorrective[]) => {
  const headers = [
    'ID',
    'Titre',
    'Description',
    'Statut',
    'Priorité',
    'Origine Type',
    'Origine Référence',
    'Origine Date',
    'Origine Résumé',
    'Avancement (%)',
    'Responsable Nom',
    'Responsable Email',
    'Date Échéance',
    'Indicateur Efficacité',
    'Date Création',
    'Date Modification'
  ];

  const csvContent = [
    headers.join(','),
    ...actionsCorrectives.map(action => [
      `"${action.id.substring(0, 8)}"`,
      `"${action.titre}"`,
      `"${action.description.replace(/"/g, '""')}"`,
      `"${action.statut}"`,
      `"${action.priorite}"`,
      `"${action.origine_type}"`,
      `"${action.origine_ref || ''}"`,
      `"${action.origine_date ? new Date(action.origine_date).toLocaleDateString('fr-FR') : ''}"`,
      `"${(action.origine_resume || '').replace(/"/g, '""')}"`,
      action.avancement,
      `"${action.responsable_nom || ''}"`,
      `"${action.responsable_email || ''}"`,
      `"${action.date_echeance ? new Date(action.date_echeance).toLocaleDateString('fr-FR') : ''}"`,
      `"${(action.indicateur_efficacite || '').replace(/"/g, '""')}"`,
      `"${new Date(action.created_at).toLocaleDateString('fr-FR')}"`,
      `"${new Date(action.updated_at).toLocaleDateString('fr-FR')}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `actions_correctives_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
