import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

function getCategorieByCode(code) {
  const prefix = code.split('-')[1];
  const prefixToCategory = {
    WP: { code: 'WEB-DEV', titre: 'Conception et gestion de site web', description: 'Formations en développement web et création de sites' },
    BD: { code: 'DIGITAL-COM', titre: 'Relation client et communication digitale', description: 'Formations en marketing digital et réseaux sociaux' },
    SW: { code: 'WEB-OPS', titre: 'Exploitation, maintenance et sécurité', description: 'Formations en exploitation, maintenance et sécurité de sites web' },
    CV: { code: 'DIGITAL-COM', titre: 'Relation client et communication digitale', description: 'Formations en marketing digital et réseaux sociaux' },
    FB: { code: 'DIGITAL-COM', titre: 'Relation client et communication digitale', description: 'Formations en marketing digital et réseaux sociaux' },
    IA: { code: 'DIGITAL-COM', titre: 'Relation client et communication digitale', description: 'Formations en marketing digital et réseaux sociaux' },
    RE: { code: 'WEB-DEV', titre: 'Conception et gestion de site web', description: 'Formations en développement web et création de sites' },
    IM: { code: 'DIGITAL-COM', titre: 'Relation client et communication digitale', description: 'Formations en marketing digital et réseaux sociaux' },
  };
  return prefixToCategory[prefix] || { code: 'WEB-DEV', titre: 'Conception et gestion de site web', description: 'Formations en développement web et création de sites' };
}

function extractTitre(html) {
  const match = html.match(/<h2[^>]*>([^<]+)<\/h2>/i);
  return match ? match[1].trim() : '';
}

function extractObjectifs(html) {
  const objectifs = [];
  const match = html.match(/<h2[^>]*>Objectifs<\/h2>([\s\S]*?)(?=<h2|$)/i);
  if (!match) return ['Développer des compétences numériques essentielles'];
  
  const section = match[1];
  const liMatches = section.match(/<li[^>]*>([^<]+)<\/li>/gi);
  if (liMatches?.length) {
    liMatches.forEach(li => {
      const text = li.replace(/<[^>]*>/g, '').trim();
      if (text) objectifs.push(text);
    });
  } else {
    section.split('\n').map(line => line.replace(/<[^>]*>/g, '').trim()).filter(line => line.length > 0).forEach(line => objectifs.push(line));
  }
  return objectifs.length ? objectifs : ['Développer des compétences numériques essentielles'];
}

async function importProgrammes() {
  try {
    console.log('Début de l\'import des programmes...');
    const categories = await prisma.categorieProgramme.findMany();
    const categoriesCache = new Map(categories.map(cat => [cat.code, cat]));

    const programmesDir = path.join(process.cwd(), 'public/programmes/ml');
    const files = fs.readdirSync(programmesDir).filter(f => f.endsWith('.html') && !f.includes('template') && !f.includes('exemple'));

    console.log(`Fichiers trouvés: ${files.length}`);

    for (const file of files) {
      const html = fs.readFileSync(path.join(programmesDir, file), 'utf8');
      const code = file.split('-programme.html')[0];
      const titre = extractTitre(html) || `Programme ${code}`;
      const objectifs = extractObjectifs(html);
      const categorieInfo = getCategorieByCode(code);

      // Vérification ou création de catégorie
      let categorie = categoriesCache.get(categorieInfo.code);
      if (!categorie) {
        categorie = await prisma.categorieProgramme.upsert({
          where: { code: categorieInfo.code },
          update: {},
          create: {
            code: categorieInfo.code,
            titre: categorieInfo.titre,
            description: categorieInfo.description,
            ordre: 0
          }
        });
        categoriesCache.set(categorie.code, categorie);
        console.log(`Catégorie créée: ${categorie.code}`);
      }

      // Upsert programme
      await prisma.programmeFormation.upsert({
        where: { code },
        update: { ...{
          type: 'catalogue',
          typeProgramme: 'catalogue',
          titre,
          description: titre,
          duree: '14 heures (2 jours)',
          prix: '980€',
          niveau: 'Débutant',
          participants: 'Artisans, commerçants ou professions libérales',
          objectifs,
          prerequis: 'Maîtriser son environnement et les fonctions de base pour utiliser un ordinateur',
          modalites: 'Présentiel',
          programmeUrl: `/programmes/ml/${file}`,
          publicConcerne: 'Artisans, commerçants ou professions libérales',
          modalitesAcces: 'Sur inscription',
          modalitesTechniques: 'Matériel fourni',
          modalitesReglement: 'À la fin de la formation',
          formateur: 'Aurélien LAVAYSSIERE - GESTIONMAX',
          ressourcesDisposition: 'Supports de formation numériques',
          modalitesEvaluation: 'Évaluation continue et questionnaire de satisfaction',
          sanctionFormation: 'Attestation de fin de formation',
          niveauCertification: 'Non certifiante',
          accessibiliteHandicap: 'Accessible aux personnes en situation de handicap',
          contenuDetailleJours: 'Détails disponibles dans le programme complet',
          delaiAcceptation: 'Sous 48h',
          cessationAbandon: 'Conformément aux conditions générales de vente',
          estActif: true,
          estVisible: true,
          categorieId: categorie.id
        } },
        create: { 
          code,
          type: 'catalogue',
          typeProgramme: 'catalogue',
          titre,
          description: titre,
          duree: '14 heures (2 jours)',
          prix: '980€',
          niveau: 'Débutant',
          participants: 'Artisans, commerçants ou professions libérales',
          objectifs,
          prerequis: 'Maîtriser son environnement et les fonctions de base pour utiliser un ordinateur',
          modalites: 'Présentiel',
          programmeUrl: `/programmes/ml/${file}`,
          publicConcerne: 'Artisans, commerçants ou professions libérales',
          modalitesAcces: 'Sur inscription',
          modalitesTechniques: 'Matériel fourni',
          modalitesReglement: 'À la fin de la formation',
          formateur: 'Aurélien LAVAYSSIERE - GESTIONMAX',
          ressourcesDisposition: 'Supports de formation numériques',
          modalitesEvaluation: 'Évaluation continue et questionnaire de satisfaction',
          sanctionFormation: 'Attestation de fin de formation',
          niveauCertification: 'Non certifiante',
          accessibiliteHandicap: 'Accessible aux personnes en situation de handicap',
          contenuDetailleJours: 'Détails disponibles dans le programme complet',
          delaiAcceptation: 'Sous 48h',
          cessationAbandon: 'Conformément aux conditions générales de vente',
          estActif: true,
          estVisible: true,
          categorieId: categorie.id
        }
      });
      console.log(`Programme importé: ${code} - ${titre}`);
    }

    console.log('Import terminé ✅');
  } catch (error) {
    console.error('Erreur lors de l\'import:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importProgrammes();
