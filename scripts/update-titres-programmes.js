import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
}).$extends(withAccelerate());

function extractTitre(html) {
  const $ = cheerio.load(html);
  
  // Extraire le titre depuis title en priorité
  const titleFromTag = $('title').text().replace('Programme de formation - ', '').trim();
  const h1Title = $('h1').first().text().trim();
  const h2Title = $('h2').first().text().trim();
  
  // Prioriser le titre de la balise title si il est différent de "Programme de formation"
  if (titleFromTag && titleFromTag !== 'Programme de formation') {
    return titleFromTag;
  } else if (h1Title && h1Title !== 'Programme de formation') {
    return h1Title;
  } else if (h2Title && h2Title !== 'Programme de formation') {
    return h2Title;
  } else {
    return titleFromTag || 'Programme de formation';
  }
}

async function updateTitresProgrammes() {
  try {
    console.log('🔄 Mise à jour des titres des programmes...');
    console.log('============================================');
    
    const programmesDir = '/home/gestionmax-aur-lien/CascadeProjects/lovable/gestion-formation-hub-backup/public/programmes/ml';
    const files = fs.readdirSync(programmesDir);
    
    // Filtrer les fichiers HTML
    const htmlFiles = files.filter(file => 
      file.endsWith('.html') && 
      !file.includes('template') && 
      !file.includes('exemple')
    );
    
    console.log(`📁 ${htmlFiles.length} fichiers HTML trouvés`);
    
    let updated = 0;
    let errors = 0;
    
    for (const file of htmlFiles) {
      try {
        const filePath = path.join(programmesDir, file);
        const html = fs.readFileSync(filePath, 'utf-8');
        
        // Extraire le code du nom de fichier
        const fileName = path.basename(file, '.html');
        const match = fileName.match(/^([A-Z0-9\-]+)/);
        const code = match ? match[1] : fileName;
        
        // Extraire le vrai titre
        const nouveauTitre = extractTitre(html);
        
        if (nouveauTitre && nouveauTitre !== 'Programme de formation') {
          console.log(`📄 ${file}: Code=${code}, Nouveau titre="${nouveauTitre}"`);
          
          // Chercher le programme dans la base
          const programme = await prisma.programmeFormation.findFirst({
            where: { code: code }
          });
          
          if (programme) {
            // Mettre à jour le titre
            await prisma.programmeFormation.update({
              where: { id: programme.id },
              data: { 
                titre: nouveauTitre,
                description: nouveauTitre // Aussi mettre à jour la description
              }
            });
            
            console.log(`✅ Programme ${code} mis à jour avec le titre: "${nouveauTitre}"`);
            updated++;
          } else {
            console.log(`⚠️  Programme ${code} non trouvé dans la base`);
          }
        } else {
          console.log(`⏭️  ${file}: Titre générique, pas de mise à jour nécessaire`);
        }
        
      } catch (error) {
        console.error(`❌ Erreur pour ${file}:`, error.message);
        errors++;
      }
    }
    
    console.log('\n📊 Résumé de la mise à jour:');
    console.log(`✅ ${updated} programmes mis à jour`);
    console.log(`❌ ${errors} erreurs`);
    
    // Vérifier les résultats
    const programmesAvecNouveauxTitres = await prisma.programmeFormation.findMany({
      where: {
        titre: {
          not: 'Programme de formation'
        }
      },
      select: {
        code: true,
        titre: true
      },
      orderBy: { code: 'asc' }
    });
    
    console.log(`\n🎯 ${programmesAvecNouveauxTitres.length} programmes avec des titres personnalisés:`);
    programmesAvecNouveauxTitres.forEach(p => {
      console.log(`   • ${p.code}: "${p.titre}"`);
    });
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateTitresProgrammes();