
import jsPDF from 'jspdf';

export interface DossierFormation {
  id: string;
  numero_dossier: string;
  apprenant_nom: string;
  apprenant_prenom: string;
  apprenant_email: string;
  formation_titre: string;
  date_debut?: string;
  date_fin?: string;
  programme?: any;
}

export const generateConventionFormation = (dossier: DossierFormation): Blob => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;

  // En-tête
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('CONVENTION DE FORMATION PROFESSIONNELLE', pageWidth / 2, 30, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Dossier N° ${dossier.numero_dossier}`, pageWidth / 2, 40, { align: 'center' });

  let yPos = 60;

  // Informations organisme
  doc.setFont('helvetica', 'bold');
  doc.text('ORGANISME DE FORMATION', margin, yPos);
  yPos += 10;
  doc.setFont('helvetica', 'normal');
  doc.text('GestionMax Formation', margin, yPos);
  yPos += 6;
  doc.text('Organisme certifié Qualiopi', margin, yPos);
  yPos += 6;
  doc.text('Numéro de déclaration : 11756123456', margin, yPos);
  yPos += 20;

  // Informations stagiaire
  doc.setFont('helvetica', 'bold');
  doc.text('STAGIAIRE', margin, yPos);
  yPos += 10;
  doc.setFont('helvetica', 'normal');
  doc.text(`Nom : ${dossier.apprenant_nom}`, margin, yPos);
  yPos += 6;
  doc.text(`Prénom : ${dossier.apprenant_prenom}`, margin, yPos);
  yPos += 6;
  doc.text(`Email : ${dossier.apprenant_email}`, margin, yPos);
  yPos += 20;

  // Formation
  doc.setFont('helvetica', 'bold');
  doc.text('FORMATION', margin, yPos);
  yPos += 10;
  doc.setFont('helvetica', 'normal');
  doc.text(`Intitulé : ${dossier.formation_titre}`, margin, yPos);
  yPos += 6;
  if (dossier.programme?.duree_estimee) {
    doc.text(`Durée : ${dossier.programme.duree_estimee} heures`, margin, yPos);
    yPos += 6;
  }
  if (dossier.date_debut && dossier.date_fin) {
    doc.text(`Période : du ${new Date(dossier.date_debut).toLocaleDateString('fr-FR')} au ${new Date(dossier.date_fin).toLocaleDateString('fr-FR')}`, margin, yPos);
    yPos += 6;
  }
  if (dossier.programme?.modalites_pedagogiques) {
    doc.text('Modalités :', margin, yPos);
    yPos += 6;
    const modalites = doc.splitTextToSize(dossier.programme.modalites_pedagogiques, pageWidth - 2 * margin);
    doc.text(modalites, margin, yPos);
    yPos += modalites.length * 6 + 10;
  }

  // Signature
  yPos = Math.max(yPos, 200);
  doc.text('Fait le : ________________', margin, yPos);
  doc.text('Signature du stagiaire :', margin, yPos + 20);
  doc.text('Signature de l\'organisme :', pageWidth - margin - 60, yPos + 20);

  return doc.output('blob');
};

export const generateProgrammeDetaille = (dossier: DossierFormation): Blob => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;

  // En-tête
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PROGRAMME DE FORMATION DÉTAILLÉ', pageWidth / 2, 30, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`${dossier.formation_titre}`, pageWidth / 2, 40, { align: 'center' });
  doc.text(`Dossier N° ${dossier.numero_dossier}`, pageWidth / 2, 50, { align: 'center' });

  let yPos = 70;

  if (dossier.programme) {
    // Objectifs
    if (dossier.programme.objectifs_specifiques) {
      doc.setFont('helvetica', 'bold');
      doc.text('OBJECTIFS PÉDAGOGIQUES', margin, yPos);
      yPos += 10;
      doc.setFont('helvetica', 'normal');
      const objectifs = doc.splitTextToSize(dossier.programme.objectifs_specifiques, pageWidth - 2 * margin);
      doc.text(objectifs, margin, yPos);
      yPos += objectifs.length * 6 + 15;
    }

    // Compétences visées
    if (dossier.programme.competences_visees && dossier.programme.competences_visees.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('COMPÉTENCES VISÉES', margin, yPos);
      yPos += 10;
      doc.setFont('helvetica', 'normal');
      dossier.programme.competences_visees.forEach((competence: string, index: number) => {
        doc.text(`${index + 1}. ${competence}`, margin, yPos);
        yPos += 6;
      });
      yPos += 10;
    }

    // Modalités pédagogiques
    if (dossier.programme.modalites_pedagogiques) {
      doc.setFont('helvetica', 'bold');
      doc.text('MODALITÉS PÉDAGOGIQUES', margin, yPos);
      yPos += 10;
      doc.setFont('helvetica', 'normal');
      const modalites = doc.splitTextToSize(dossier.programme.modalites_pedagogiques, pageWidth - 2 * margin);
      doc.text(modalites, margin, yPos);
      yPos += modalites.length * 6 + 15;
    }

    // Prérequis
    if (dossier.programme.prerequis_adaptes) {
      doc.setFont('helvetica', 'bold');
      doc.text('PRÉREQUIS', margin, yPos);
      yPos += 10;
      doc.setFont('helvetica', 'normal');
      const prerequis = doc.splitTextToSize(dossier.programme.prerequis_adaptes, pageWidth - 2 * margin);
      doc.text(prerequis, margin, yPos);
      yPos += prerequis.length * 6 + 15;
    }

    // Évaluation
    if (dossier.programme.evaluation_prevue) {
      doc.setFont('helvetica', 'bold');
      doc.text('MODALITÉS D\'ÉVALUATION', margin, yPos);
      yPos += 10;
      doc.setFont('helvetica', 'normal');
      const evaluation = doc.splitTextToSize(dossier.programme.evaluation_prevue, pageWidth - 2 * margin);
      doc.text(evaluation, margin, yPos);
      yPos += evaluation.length * 6 + 15;
    }

    // Ressources nécessaires
    if (dossier.programme.ressources_necessaires && dossier.programme.ressources_necessaires.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('RESSOURCES NÉCESSAIRES', margin, yPos);
      yPos += 10;
      doc.setFont('helvetica', 'normal');
      dossier.programme.ressources_necessaires.forEach((ressource: string, index: number) => {
        doc.text(`• ${ressource}`, margin, yPos);
        yPos += 6;
      });
    }
  }

  return doc.output('blob');
};

export const generateFeuilleEmargement = (dossier: DossierFormation): Blob => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;

  // En-tête
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('FEUILLE D\'ÉMARGEMENT', pageWidth / 2, 30, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`${dossier.formation_titre}`, pageWidth / 2, 40, { align: 'center' });
  doc.text(`Dossier N° ${dossier.numero_dossier}`, pageWidth / 2, 50, { align: 'center' });

  let yPos = 70;

  // Informations formation
  doc.setFont('helvetica', 'bold');
  doc.text('FORMATION', margin, yPos);
  yPos += 10;
  doc.setFont('helvetica', 'normal');
  doc.text(`Stagiaire : ${dossier.apprenant_prenom} ${dossier.apprenant_nom}`, margin, yPos);
  yPos += 6;
  if (dossier.date_debut && dossier.date_fin) {
    doc.text(`Période : du ${new Date(dossier.date_debut).toLocaleDateString('fr-FR')} au ${new Date(dossier.date_fin).toLocaleDateString('fr-FR')}`, margin, yPos);
    yPos += 6;
  }
  if (dossier.programme?.duree_estimee) {
    doc.text(`Durée totale : ${dossier.programme.duree_estimee} heures`, margin, yPos);
    yPos += 20;
  }

  // Tableau d'émargement
  doc.setFont('helvetica', 'bold');
  doc.text('ÉMARGEMENT PAR SÉANCE', margin, yPos);
  yPos += 15;

  // En-têtes du tableau
  doc.setFont('helvetica', 'bold');
  doc.text('Date', margin, yPos);
  doc.text('Horaires', margin + 40, yPos);
  doc.text('Contenu', margin + 80, yPos);
  doc.text('Signature stagiaire', margin + 130, yPos);
  yPos += 10;

  // Lignes du tableau
  doc.setFont('helvetica', 'normal');
  for (let i = 0; i < 15; i++) {
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 15;
    if (yPos > 250) break;
  }

  return doc.output('blob');
};

export const generateAllDocuments = async (dossier: DossierFormation) => {
  const documents = [
    {
      type: 'convention',
      nom_fichier: `convention-${dossier.numero_dossier}.pdf`,
      blob: generateConventionFormation(dossier)
    },
    {
      type: 'programme',
      nom_fichier: `programme-${dossier.numero_dossier}.pdf`,
      blob: generateProgrammeDetaille(dossier)
    },
    {
      type: 'feuille_emargement',
      nom_fichier: `emargement-${dossier.numero_dossier}.pdf`,
      blob: generateFeuilleEmargement(dossier)
    }
  ];

  // Télécharger tous les documents
  documents.forEach(doc => {
    const url = URL.createObjectURL(doc.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.nom_fichier;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  return documents;
};
