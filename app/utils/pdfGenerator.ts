
import jsPDF from 'jspdf';

export interface Formation {
  id: string;
  code: string;
  libelle: string;
  duree: string;
  // Informations légales et pédagogiques
  objectifsPedagogiques: string;
  contenuDetailleJours?: string;
  prerequis: string;
  publicConcerne: string;
  horaires: string;
  modalitesAcces: string;
  tarif: string;
  modalitesReglement: string;
  contactOrganisme: string;
  referentPedagogique: string;
  referentQualite: string;
  modalitesTechniques: string;
  formateur: string;
  ressourcesDisposition: string;
  modalitesEvaluation: string;
  sanctionFormation: string;
  niveauCertification: string;
}

export const generateFormationPDF = (formation: Formation) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Helper function to add text with word wrapping
  const addWrappedText = (text: string | null | undefined, x: number, y: number, maxWidth: number, fontSize: number = 12) => {
    if (!text) return y;
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * fontSize * 0.35);
  };

  // Helper function to check if we need a new page
  const checkNewPage = () => {
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Programme de Formation', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Title (use libelle instead of titre)
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  yPosition = addWrappedText(formation.libelle, margin, yPosition, pageWidth - 2 * margin, 16);
  yPosition += 10;

  // Code and duration
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Code: ${formation.code}`, margin, yPosition);
  doc.text(`Durée: ${formation.duree}`, pageWidth - margin - 60, yPosition);
  yPosition += 15;

  // Description (using objectifsPedagogiques instead)
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Description', margin, yPosition);
  yPosition += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  yPosition = addWrappedText(formation.objectifsPedagogiques, margin, yPosition, pageWidth - 2 * margin, 11);
  yPosition += 10;

  checkNewPage();

  // Public cible
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Public cible', margin, yPosition);
  yPosition += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  yPosition = addWrappedText(formation.publicConcerne, margin, yPosition, pageWidth - 2 * margin, 11);
  yPosition += 10;

  checkNewPage();

  // Objectifs
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Objectifs pédagogiques', margin, yPosition);
  yPosition += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  yPosition = addWrappedText(formation.objectifsPedagogiques, margin, yPosition, pageWidth - 2 * margin, 11);
  yPosition += 10;

  checkNewPage();

  // Programme (contenu détaillé par jours)
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Programme', margin, yPosition);
  yPosition += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  yPosition = addWrappedText(formation.contenuDetailleJours, margin, yPosition, pageWidth - 2 * margin, 11);
  yPosition += 10;

  checkNewPage();

  // Informations légales et réglementaires
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Informations légales et réglementaires', margin, yPosition);
  yPosition += 12;

  // Prérequis
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Prérequis', margin, yPosition);
  yPosition += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  yPosition = addWrappedText(formation.prerequis, margin + 5, yPosition, pageWidth - 2 * margin - 5, 10);
  yPosition += 8;

  checkNewPage();

  // Public concerné
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Public concerné', margin, yPosition);
  yPosition += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  yPosition = addWrappedText(formation.publicConcerne, margin + 5, yPosition, pageWidth - 2 * margin - 5, 10);
  yPosition += 8;

  checkNewPage();

  // Durée et horaires
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Durée et horaires', margin, yPosition);
  yPosition += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  yPosition = addWrappedText(`${formation.duree} - ${formation.horaires}`, margin + 5, yPosition, pageWidth - 2 * margin - 5, 10);
  yPosition += 8;

  checkNewPage();

  // Modalités d'accès
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Modalités, délais moyens d\'accès', margin, yPosition);
  yPosition += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  yPosition = addWrappedText(formation.modalitesAcces, margin, yPosition, pageWidth - 2 * margin, 10);
  yPosition += 8;

  // Tarif
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Tarif de la formation', margin, yPosition);
  yPosition += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  yPosition = addWrappedText(formation.tarif, margin, yPosition, pageWidth - 2 * margin, 10);
  yPosition += 8;

  checkNewPage();

  // Modalités de règlement
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Modalités de règlement', margin, yPosition);
  yPosition += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  yPosition = addWrappedText(formation.modalitesReglement, margin, yPosition, pageWidth - 2 * margin, 10);
  yPosition += 8;

  // Accessibilité handicapée
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Accessibilité handicapée', margin, yPosition);
  yPosition += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  // Changement de nom de champ : contactOrganisme contient souvent cette information
  yPosition = addWrappedText(formation.contactOrganisme, margin, yPosition, pageWidth - 2 * margin, 10);
  yPosition += 8;

  checkNewPage();

  // Modalités d'évaluation
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Modalités d\'évaluation', margin, yPosition);
  yPosition += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  yPosition = addWrappedText(formation.modalitesEvaluation, margin, yPosition, pageWidth - 2 * margin, 10);
  yPosition += 8;

  // Sanction de la formation
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Sanction de la formation', margin, yPosition);
  yPosition += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  yPosition = addWrappedText(formation.sanctionFormation, margin, yPosition, pageWidth - 2 * margin, 10);
  yPosition += 8;

  checkNewPage();

  // Cessation anticipée ou abandon
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Cessation anticipée ou abandon', margin, yPosition);
  yPosition += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  yPosition = addWrappedText(formation.niveauCertification, margin, yPosition, pageWidth - 2 * margin, 10);

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Certifié Qualiopi - Page ${i}/${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  // Generate filename
  const fileName = `formation-${formation.code}-${formation.libelle.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  
  // Download the PDF
  doc.save(fileName);
};
