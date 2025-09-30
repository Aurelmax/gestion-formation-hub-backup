import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import puppeteer from 'puppeteer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const prisma = new PrismaClient();

interface ProgrammeData {
  id: string;
  titre: string;
  description: string;
  contenu: string;
  duree: string;
  objectifsSpecifiques: string;
  evaluationSur: string;
  accessibiliteHandicap?: string;
  cessationAnticipee?: string;
  delaiAcceptation?: string;
  delaiAcces?: string;
  formateur?: string;
  horaires?: string;
  modalitesAcces?: string;
  modalitesEvaluation?: string;
  modalitesReglement?: string;
  modalitesTechniques?: string;
  niveauCertification?: string;
  prerequis?: string;
  publicConcerne?: string;
  referentPedagogique?: string;
  referentQualite?: string;
  ressourcesDisposition?: string;
  sanctionFormation?: string;
  tarif?: string;
  formation?: {
    libelle: string;
    code: string;
  };
  positionnementRequest?: {
    nomBeneficiaire: string;
    prenomBeneficiaire: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

function generateProgrammeHTML(programme: ProgrammeData): string {
  const dateCreation = format(programme.createdAt, 'dd MMMM yyyy', { locale: fr });
  const beneficiaire = programme.positionnementRequest
    ? `${programme.positionnementRequest.prenomBeneficiaire} ${programme.positionnementRequest.nomBeneficiaire}`
    : 'Non spécifié';

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Programme de Formation - ${programme.titre}</title>
    <style>
        @page {
            size: A4;
            margin: 20mm;
        }

        body {
            font-family: 'Arial', sans-serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 0;
        }

        .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }

        .header h1 {
            color: #1e40af;
            font-size: 18pt;
            margin: 0 0 10px 0;
            font-weight: bold;
        }

        .header .subtitle {
            color: #64748b;
            font-size: 10pt;
            margin: 5px 0;
        }

        .section {
            margin-bottom: 20px;
            page-break-inside: avoid;
        }

        .section-title {
            background-color: #f1f5f9;
            color: #1e40af;
            font-weight: bold;
            font-size: 12pt;
            padding: 8px 12px;
            margin: 0 0 10px 0;
            border-left: 4px solid #2563eb;
        }

        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
        }

        .info-item {
            margin-bottom: 8px;
        }

        .label {
            font-weight: bold;
            color: #475569;
            display: inline-block;
            min-width: 120px;
        }

        .value {
            color: #334155;
        }

        .full-width {
            grid-column: 1 / -1;
        }

        .content-block {
            background-color: #fafafa;
            padding: 12px;
            border-radius: 4px;
            margin: 8px 0;
            border-left: 3px solid #e2e8f0;
        }

        .footer {
            position: fixed;
            bottom: 15mm;
            left: 20mm;
            right: 20mm;
            text-align: center;
            font-size: 9pt;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
            padding-top: 10px;
        }

        .page-break {
            page-break-before: always;
        }

        ul {
            margin: 8px 0;
            padding-left: 20px;
        }

        li {
            margin-bottom: 4px;
        }

        .regulatory-section {
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 12px;
            margin: 10px 0;
            background-color: #fefefe;
        }

        .regulatory-title {
            font-weight: bold;
            color: #dc2626;
            font-size: 11pt;
            margin-bottom: 8px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Programme de Formation Personnalisé</h1>
        <div class="subtitle">Document généré le ${dateCreation}</div>
        <div class="subtitle">Référence: ${programme.formation?.code || programme.id}</div>
    </div>

    <div class="section">
        <h2 class="section-title">📋 Informations générales</h2>
        <div class="info-grid">
            <div class="info-item">
                <span class="label">Titre :</span>
                <span class="value">${programme.titre}</span>
            </div>
            <div class="info-item">
                <span class="label">Bénéficiaire :</span>
                <span class="value">${beneficiaire}</span>
            </div>
            <div class="info-item">
                <span class="label">Durée :</span>
                <span class="value">${programme.duree}</span>
            </div>
            <div class="info-item">
                <span class="label">Prix :</span>
                <span class="value">${programme.tarif || 'Non spécifié'}</span>
            </div>
            <div class="info-item full-width">
                <span class="label">Description :</span>
                <div class="content-block">${programme.description}</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2 class="section-title">🎯 Objectifs pédagogiques</h2>
        <div class="content-block">
            ${programme.objectifsSpecifiques || 'Objectifs à définir'}
        </div>
    </div>

    <div class="section">
        <h2 class="section-title">📚 Contenu de la formation</h2>
        <div class="content-block">
            ${programme.contenu}
        </div>
    </div>

    <div class="section">
        <h2 class="section-title">📊 Modalités d'évaluation</h2>
        <div class="content-block">
            ${programme.evaluationSur || 'Modalités d\'évaluation à définir'}
        </div>
    </div>

    <div class="page-break"></div>

    <div class="section">
        <h2 class="section-title">⚖️ Informations réglementaires</h2>

        <div class="regulatory-section">
            <div class="regulatory-title">Public concerné et prérequis</div>
            <div class="info-item">
                <span class="label">Public concerné :</span>
                <span class="value">${programme.publicConcerne || 'Tout public'}</span>
            </div>
            <div class="info-item">
                <span class="label">Prérequis :</span>
                <span class="value">${programme.prerequis || 'Aucun prérequis spécifique'}</span>
            </div>
        </div>

        <div class="regulatory-section">
            <div class="regulatory-title">Organisation pratique</div>
            <div class="info-item">
                <span class="label">Horaires :</span>
                <span class="value">${programme.horaires || '9h-12h30 et 14h-17h30'}</span>
            </div>
            <div class="info-item">
                <span class="label">Modalités d'accès :</span>
                <span class="value">${programme.modalitesAcces || 'Sur inscription'}</span>
            </div>
            <div class="info-item">
                <span class="label">Délai d'accès :</span>
                <span class="value">${programme.delaiAcces || '15 jours ouvrés'}</span>
            </div>
        </div>

        <div class="regulatory-section">
            <div class="regulatory-title">Modalités techniques et pédagogiques</div>
            <div class="info-item">
                <span class="label">Modalités techniques :</span>
                <span class="value">${programme.modalitesTechniques || 'Présentiel en centre de formation'}</span>
            </div>
            <div class="info-item">
                <span class="label">Modalités d'évaluation :</span>
                <span class="value">${programme.modalitesEvaluation || 'Évaluation continue et finale'}</span>
            </div>
            <div class="info-item">
                <span class="label">Ressources à disposition :</span>
                <span class="value">${programme.ressourcesDisposition || 'Support de cours, plateforme e-learning'}</span>
            </div>
        </div>

        <div class="regulatory-section">
            <div class="regulatory-title">Équipe pédagogique</div>
            <div class="info-item">
                <span class="label">Formateur :</span>
                <span class="value">${programme.formateur || 'À définir'}</span>
            </div>
            <div class="info-item">
                <span class="label">Référent pédagogique :</span>
                <span class="value">${programme.referentPedagogique || 'À définir'}</span>
            </div>
            <div class="info-item">
                <span class="label">Référent qualité :</span>
                <span class="value">${programme.referentQualite || 'À définir'}</span>
            </div>
        </div>

        <div class="regulatory-section">
            <div class="regulatory-title">Certification et sanctions</div>
            <div class="info-item">
                <span class="label">Sanction de la formation :</span>
                <span class="value">${programme.sanctionFormation || 'Attestation de fin de formation'}</span>
            </div>
            <div class="info-item">
                <span class="label">Niveau de certification :</span>
                <span class="value">${programme.niveauCertification || 'Non certifiante'}</span>
            </div>
        </div>

        <div class="regulatory-section">
            <div class="regulatory-title">Modalités administratives</div>
            <div class="info-item">
                <span class="label">Modalités de règlement :</span>
                <span class="value">${programme.modalitesReglement || 'Paiement à réception de facture'}</span>
            </div>
            <div class="info-item">
                <span class="label">Délai d'acceptation :</span>
                <span class="value">${programme.delaiAcceptation || '48 heures'}</span>
            </div>
            <div class="info-item">
                <span class="label">Cessation/Abandon :</span>
                <span class="value">${programme.cessationAnticipee || 'Possibilité d\'arrêt à tout moment avec préavis'}</span>
            </div>
        </div>

        <div class="regulatory-section">
            <div class="regulatory-title">Accessibilité</div>
            <div class="info-item">
                <span class="label">Accessibilité handicap :</span>
                <span class="value">${programme.accessibiliteHandicap || 'Nous contacter pour étudier les adaptations possibles'}</span>
            </div>
        </div>
    </div>

    <div class="footer">
        <div>GestionMax - Centre de Formation</div>
        <div>Document généré automatiquement - ${dateCreation}</div>
    </div>
</body>
</html>
  `;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const programmeId = params.id;

    // Récupérer le programme avec toutes les relations
    const programme = await prisma.programmePersonnalise.findUnique({
      where: { id: programmeId },
      include: {
        formation: {
          select: {
            libelle: true,
            code: true,
          }
        },
        positionnementRequest: {
          select: {
            nomBeneficiaire: true,
            prenomBeneficiaire: true,
          }
        }
      }
    });

    if (!programme) {
      return NextResponse.json(
        { success: false, error: 'Programme non trouvé' },
        { status: 404 }
      );
    }

    // Générer le HTML
    const html = generateProgrammeHTML(programme);

    // Générer le PDF avec Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });

    await browser.close();

    // Nom du fichier
    const fileName = `programme-${programme.formation?.code || programme.id}-${format(new Date(), 'yyyyMMdd')}.pdf`;

    // Retourner le PDF
    return new NextResponse(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur lors de la génération du PDF'
      },
      { status: 500 }
    );
  }
}