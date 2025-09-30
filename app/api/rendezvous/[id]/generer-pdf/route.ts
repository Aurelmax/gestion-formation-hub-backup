import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import puppeteer from 'puppeteer';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Récupérer le rendez-vous
    const rendezvous = await prisma.rendezvous.findUnique({
      where: { id },
    });

    if (!rendezvous) {
      return NextResponse.json(
        { success: false, error: 'Rendez-vous non trouvé' },
        { status: 404 }
      );
    }

    // Template HTML du compte-rendu
    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: A4;
      margin: 2cm;
    }
    body {
      font-family: 'Arial', sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #333;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #2563eb;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #2563eb;
      font-size: 24pt;
      margin: 0;
    }
    .header p {
      color: #666;
      margin: 5px 0;
    }
    .section {
      margin-bottom: 25px;
    }
    .section-title {
      background-color: #2563eb;
      color: white;
      padding: 8px 12px;
      font-size: 14pt;
      font-weight: bold;
      margin-bottom: 15px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 15px;
    }
    .info-item {
      padding: 10px;
      background-color: #f8f9fa;
      border-left: 3px solid #2563eb;
    }
    .info-label {
      font-weight: bold;
      color: #2563eb;
      font-size: 10pt;
      display: block;
      margin-bottom: 3px;
    }
    .info-value {
      color: #333;
      font-size: 11pt;
    }
    .text-content {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      white-space: pre-wrap;
      min-height: 80px;
    }
    .signature-section {
      margin-top: 40px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
    }
    .signature-box {
      border: 2px solid #ddd;
      padding: 15px;
      min-height: 100px;
      text-align: center;
    }
    .signature-label {
      font-weight: bold;
      margin-bottom: 10px;
      color: #2563eb;
    }
    .date-line {
      margin-top: 60px;
      border-bottom: 1px solid #333;
      width: 80%;
      margin-left: auto;
      margin-right: auto;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #ddd;
      font-size: 9pt;
      color: #666;
      text-align: center;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 10pt;
      font-weight: bold;
    }
    .badge-positionnement {
      background-color: #dbeafe;
      color: #1e40af;
    }
    .badge-impact {
      background-color: #e9d5ff;
      color: #7c3aed;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>COMPTE-RENDU D'ENTRETIEN</h1>
    <p>Type: <span class="badge badge-${rendezvous.type}">${rendezvous.type.toUpperCase()}</span></p>
    <p>Document généré le ${new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })}</p>
  </div>

  <div class="section">
    <div class="section-title">INFORMATIONS DU PARTICIPANT</div>
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">Nom et Prénom</span>
        <span class="info-value">${rendezvous.prenom} ${rendezvous.nom}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Email</span>
        <span class="info-value">${rendezvous.email}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Téléphone</span>
        <span class="info-value">${rendezvous.telephone || 'Non renseigné'}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Date de l'entretien</span>
        <span class="info-value">${rendezvous.dateRdv ? new Date(rendezvous.dateRdv).toLocaleDateString('fr-FR') : 'Non planifiée'}</span>
      </div>
      ${rendezvous.entreprise ? `
      <div class="info-item">
        <span class="info-label">Entreprise</span>
        <span class="info-value">${rendezvous.entreprise}</span>
      </div>` : ''}
    </div>
  </div>

  ${rendezvous.formationTitre || rendezvous.formationSelectionnee ? `
  <div class="section">
    <div class="section-title">FORMATION CONCERNÉE</div>
    <div class="text-content">
      ${rendezvous.formationTitre || rendezvous.formationSelectionnee}
    </div>
  </div>` : ''}

  ${rendezvous.objectifs ? `
  <div class="section">
    <div class="section-title">OBJECTIFS DE LA FORMATION</div>
    <div class="text-content">${rendezvous.objectifs}</div>
  </div>` : ''}

  ${rendezvous.competencesActuelles ? `
  <div class="section">
    <div class="section-title">COMPÉTENCES ACTUELLES</div>
    <div class="text-content">${rendezvous.competencesActuelles}</div>
  </div>` : ''}

  ${rendezvous.competencesRecherchees ? `
  <div class="section">
    <div class="section-title">COMPÉTENCES RECHERCHÉES</div>
    <div class="text-content">${rendezvous.competencesRecherchees}</div>
  </div>` : ''}

  ${rendezvous.situationActuelle ? `
  <div class="section">
    <div class="section-title">SITUATION ACTUELLE</div>
    <div class="text-content">${rendezvous.situationActuelle}</div>
  </div>` : ''}

  ${rendezvous.attentes ? `
  <div class="section">
    <div class="section-title">ATTENTES ET BESOINS</div>
    <div class="text-content">${rendezvous.attentes}</div>
  </div>` : ''}

  ${rendezvous.type === 'impact' && rendezvous.satisfactionImpact ? `
  <div class="section">
    <div class="section-title">ÉVALUATION D'IMPACT (6 mois après)</div>
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">Satisfaction globale</span>
        <span class="info-value">${'★'.repeat(rendezvous.satisfactionImpact)}${'☆'.repeat(5 - rendezvous.satisfactionImpact)} (${rendezvous.satisfactionImpact}/5)</span>
      </div>
    </div>
    ${rendezvous.competencesAppliquees ? `
    <div class="section">
      <div class="section-title">COMPÉTENCES APPLIQUÉES</div>
      <div class="text-content">${rendezvous.competencesAppliquees}</div>
    </div>` : ''}
    ${rendezvous.ameliorationsSuggeres ? `
    <div class="section">
      <div class="section-title">AMÉLIORATIONS SUGGÉRÉES</div>
      <div class="text-content">${rendezvous.ameliorationsSuggeres}</div>
    </div>` : ''}
  </div>` : ''}

  ${rendezvous.notes || rendezvous.synthese ? `
  <div class="section">
    <div class="section-title">NOTES ET SYNTHÈSE</div>
    <div class="text-content">${rendezvous.notes || rendezvous.synthese || ''}</div>
  </div>` : ''}

  <div class="signature-section">
    <div class="signature-box">
      <div class="signature-label">Signature du participant</div>
      <div class="date-line"></div>
      <p style="margin-top: 5px; font-size: 9pt;">Date et signature</p>
    </div>
    <div class="signature-box">
      <div class="signature-label">Signature du formateur/conseiller</div>
      <div class="date-line"></div>
      <p style="margin-top: 5px; font-size: 9pt;">Date et signature</p>
    </div>
  </div>

  <div class="footer">
    <p><strong>GestionMax Formation</strong></p>
    <p>Ce document constitue une preuve d'entretien dans le cadre de la certification Qualiopi</p>
    <p>Document confidentiel - Ne pas diffuser sans autorisation</p>
    <p style="margin-top: 10px; font-size: 8pt;">
      Référence: RDV-${rendezvous.id.substring(0, 8).toUpperCase()} |
      Généré le ${new Date().toLocaleString('fr-FR')}
    </p>
  </div>
</body>
</html>
    `;

    // Générer le PDF avec Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0cm',
        right: '0cm',
        bottom: '0cm',
        left: '0cm',
      },
    });

    await browser.close();

    // Retourner le PDF
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Compte-Rendu-${rendezvous.prenom}-${rendezvous.nom}-${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la génération du PDF',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}