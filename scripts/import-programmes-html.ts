import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { prisma } from '../app/lib/prisma';

// Types pour les données extraites
interface ProgrammeData {
  code: string;
  titre: string;
  description: string;
  duree: string;
  prix: string;
  niveau: string;
  participants: string;
  objectifs: string[];
  prerequis: string;
  publicConcerne: string;
  contenuDetailleJours: string;
  horaires: string;
  categorieId?: string;
}

// Mapping des codes vers les catégories
const categorieMappings: { [key: string]: string } = {
  'WP': 'WEB-DEV', // WordPress → Conception et gestion de site web
  'WC': 'WEB-DEV', // WooCommerce → Conception et gestion de site web  
  'FB': 'DIGITAL-COM', // Facebook → Relation client et communication digitale
  'LI': 'DIGITAL-COM', // LinkedIn → Relation client et communication digitale
  'IA': 'WEB-OPS', // IA → Exploitation, maintenance et sécurité
  'SEO': 'DIGITAL-COM', // SEO → Relation client et communication digitale
  'BD': 'WEB-DEV', // Base de données → Conception et gestion de site web
  'SW': 'WEB-OPS', // Software → Exploitation, maintenance et sécurité
  'CV': 'WEB-DEV', // CV → Conception et gestion de site web
  'MA': 'DIGITAL-COM' // Marketing → Relation client et communication digitale
};

function determinerCategorie(code: string): string {
  // Extraire les mots-clés du code
  for (const [keyword, categorieCode] of Object.entries(categorieMappings)) {
    if (code.includes(keyword)) {
      return categorieCode;
    }
  }
  // Par défaut, conception web
  return 'WEB-DEV';
}

function extractTextContent($: cheerio.CheerioAPI, selector: string): string {
  const element = $(selector);
  return element.text().trim();
}

function extractObjectifs($: cheerio.CheerioAPI): string[] {
  const objectifs: string[] = [];
  
  // Chercher dans les sections d'objectifs
  $('section').each((_, section) => {
    const $section = $(section);
    const sectionTitle = $section.find('h2').text().toLowerCase();
    
    if (sectionTitle.includes('objectif')) {
      $section.find('p, li').each((_, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 10) {
          objectifs.push(text);
        }
      });
    }
  });
  
  return objectifs;
}

function extractContenuDetaille($: cheerio.CheerioAPI): string {
  const contenu: string[] = [];
  
  // Chercher le programme détaillé
  $('section').each((_, section) => {
    const $section = $(section);
    const sectionTitle = $section.find('h2').text().toLowerCase();
    
    if (sectionTitle.includes('programme') || sectionTitle.includes('contenu')) {
      // Extraire tout le contenu de cette section
      const sectionContent = $section.html() || '';
      contenu.push(sectionContent);
    }
  });
  
  return contenu.join('\n\n');
}

function parseHtmlFile(filePath: string): ProgrammeData | null {
  try {
    console.log(`📄 Parsing ${path.basename(filePath)}...`);
    
    const html = fs.readFileSync(filePath, 'utf-8');
    const $ = cheerio.load(html);
    
    // Extraire les données du programme
    let titre = '';
    let code = '';
    let duree = '';
    let prerequis = '';
    let publicConcerne = '';
    let horaires = '';
    
    // Extraire le titre depuis h1 ou title
    titre = $('h1').first().text().trim() || 
            $('h2').first().text().trim() || 
            $('title').text().replace('Programme de formation - ', '').trim();
    
    // Extraire les informations depuis les info-row
    $('.info-row').each((_, row) => {
      const $row = $(row);
      const label = $row.find('.info-label').text().toLowerCase().trim();
      const value = $row.find('div:last-child').text().trim();
      
      if (label.includes('code')) code = value;
      else if (label.includes('durée')) duree = value;
      else if (label.includes('prérequis')) prerequis = value;
      else if (label.includes('public')) publicConcerne = value;
      else if (label.includes('horaire')) horaires = value;
    });
    
    // Si pas trouvé dans info-row, chercher dans le nom du fichier
    if (!code) {
      const fileName = path.basename(filePath, '.html');
      const match = fileName.match(/^([A-Z0-9\-]+)/);
      code = match ? match[1] : fileName;
    }
    
    if (!titre) {
      titre = code; // Fallback si pas de titre trouvé
    }
    
    // Extraire objectifs
    const objectifs = extractObjectifs($);
    
    // Extraire contenu détaillé
    const contenuDetailleJours = extractContenuDetaille($);
    
    // Déterminer la catégorie
    const categorieCode = determinerCategorie(code);
    
    const programmeData: ProgrammeData = {
      code,
      titre,
      description: objectifs.length > 0 ? objectifs[0] : titre,
      duree: duree || '14 heures',
      prix: 'Sur devis', // Prix par défaut
      niveau: 'Débutant', // Niveau par défaut  
      participants: '8 participants maximum',
      objectifs,
      prerequis: prerequis || 'Maîtriser son environnement et les fonctions de base pour utiliser un ordinateur.',
      publicConcerne: publicConcerne || 'Professionnels souhaitant développer leurs compétences digitales.',
      contenuDetailleJours,
      horaires: horaires || '9h-12h30 et 14h-17h30',
    };
    
    console.log(`✅ Programme parsé: ${titre} (${code}) → Catégorie: ${categorieCode}`);
    return programmeData;
    
  } catch (error) {
    console.error(`❌ Erreur parsing ${filePath}:`, error.message);
    return null;
  }
}

async function findOrCreateCategorie(categorieCode: string): Promise<string> {
  const categorie = await prisma.categorieProgramme.findUnique({
    where: { code: categorieCode }
  });
  
  if (!categorie) {
    console.warn(`⚠️  Catégorie ${categorieCode} non trouvée, création d'une catégorie par défaut`);
    const newCategorie = await prisma.categorieProgramme.create({
      data: {
        code: categorieCode,
        titre: categorieCode,
        description: `Catégorie ${categorieCode}`,
        ordre: 10
      }
    });
    return newCategorie.id;
  }
  
  return categorie.id;
}

async function importProgramme(programmeData: ProgrammeData): Promise<void> {
  try {
    // Vérifier si le programme existe déjà
    const existingProgramme = await prisma.programmeFormation.findFirst({
      where: { code: programmeData.code }
    });
    
    if (existingProgramme) {
      console.log(`⏭️  Programme ${programmeData.code} existe déjà, ignoré`);
      return;
    }
    
    // Trouver la catégorie
    const categorieCode = determinerCategorie(programmeData.code);
    const categorieId = await findOrCreateCategorie(categorieCode);
    
    // Créer le programme
    await prisma.programmeFormation.create({
      data: {
        code: programmeData.code,
        type: 'formation',
        titre: programmeData.titre,
        description: programmeData.description,
        duree: programmeData.duree,
        prix: programmeData.prix,
        niveau: programmeData.niveau,
        participants: programmeData.participants,
        objectifs: programmeData.objectifs,
        prerequis: programmeData.prerequis,
        publicConcerne: programmeData.publicConcerne,
        contenuDetailleJours: programmeData.contenuDetailleJours,
        horaires: programmeData.horaires,
        categorieId,
        // Champs requis avec valeurs par défaut
        modalites: 'Présentiel',
        modalitesAcces: 'Sur inscription',
        modalitesTechniques: 'Ordinateur et connexion internet fournis',
        modalitesReglement: 'Paiement à réception de facture',
        formateur: 'Aurélien Lien - Formateur certifié',
        ressourcesDisposition: 'Support de cours, exercices pratiques, accès plateforme en ligne',
        modalitesEvaluation: 'Évaluation continue et exercices pratiques',
        sanctionFormation: 'Attestation de formation',
        niveauCertification: 'Aucun',
        delaiAcceptation: '72 heures',
        accessibiliteHandicap: 'Locaux accessibles aux personnes à mobilité réduite. Nous consulter pour les autres handicaps.',
        cessationAbandon: 'Possible à tout moment sur demande écrite'
      }
    });
    
    console.log(`✅ Programme ${programmeData.code} importé avec succès`);
    
  } catch (error) {
    console.error(`❌ Erreur import ${programmeData.code}:`, error.message);
  }
}

async function main() {
  try {
    console.log('🚀 Import automatique des programmes HTML vers Prisma Cloud');
    console.log('===========================================================');
    
    const programmesDir = '/home/gestionmax-aur-lien/CascadeProjects/lovable/gestion-formation-hub-backup/public/programmes/ml';
    const files = fs.readdirSync(programmesDir);
    
    // Filtrer les fichiers HTML (exclure templates)
    const htmlFiles = files.filter(file => 
      file.endsWith('.html') && 
      !file.includes('template') && 
      !file.includes('exemple')
    );
    
    console.log(`📁 ${htmlFiles.length} fichiers HTML trouvés`);
    
    let imported = 0;
    let errors = 0;
    
    for (const file of htmlFiles) {
      const filePath = path.join(programmesDir, file);
      const programmeData = parseHtmlFile(filePath);
      
      if (programmeData) {
        await importProgramme(programmeData);
        imported++;
      } else {
        errors++;
      }
    }
    
    console.log('\n📊 Résumé de l\'import:');
    console.log(`✅ ${imported} programmes importés avec succès`);
    console.log(`❌ ${errors} erreurs`);
    
    // Vérifier le total
    const totalProgrammes = await prisma.programmeFormation.count();
    console.log(`📚 Total programmes dans la base: ${totalProgrammes}`);
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();