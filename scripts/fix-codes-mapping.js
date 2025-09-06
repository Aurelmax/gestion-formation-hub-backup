import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
}).$extends(withAccelerate());

async function fixCodesMapping() {
  try {
    console.log('🔧 Correction du mapping des codes...');
    console.log('===================================');
    
    // Obtenir tous les codes stockés dans la base
    const programmesDB = await prisma.programmeFormation.findMany({
      select: {
        id: true,
        code: true,
        titre: true
      },
      orderBy: { code: 'asc' }
    });
    
    console.log('📋 Codes actuels dans la base:');
    programmesDB.forEach(p => {
      console.log(`   ${p.code} → "${p.titre}"`);
    });
    
    // Mapping des corrections de codes (codes fichiers → codes base)
    const corrections = {
      'A001-WP-DD-': 'A001-WP-DD',
      'A008-BD-WC-': 'A008-BD-WC', 
      'A009-SW-MA-': 'A009-SW-MA',
      'A010-WP-IM-': 'A010-WP-IM',
      'A011-SW-SEOPRESS-': 'A011-SW-SEOPRESS',
      'A011-SW-WC-': 'A011-SW-WC'
    };
    
    // Mapping des titres (codes fichiers → titres extraits)
    const nouveauxTitres = {
      'A001-WP-DD-': 'Création de son site internet (WordPress) + Stratégie de développement digital',
      'A008-BD-WC-': 'Marketing Digital Brevo + Techniques de Vente en Ligne (WooCommerce)',
      'A009-SW-MA-': 'Gestion de la sécurité (WordPress) + Techniques d\'analyse statistique Web avec Matomo',
      'A010-WP-IM-': 'Créer et gérer un site WordPress & Stratégie de contenu Inbound Marketing',
      'A011-SW-SEOPRESS-': 'SEO les fondamentaux (SEOPress)',
      'A011-SW-WC-': 'SEO + WooCommerce (SEOPress & WooCommerce)'
    };
    
    console.log('\n🔄 Application des corrections...');
    
    let updated = 0;
    
    for (const [codeFichier, codeDB] of Object.entries(corrections)) {
      const programme = await prisma.programmeFormation.findFirst({
        where: { code: codeDB }
      });
      
      if (programme && nouveauxTitres[codeFichier]) {
        const nouveauTitre = nouveauxTitres[codeFichier];
        
        await prisma.programmeFormation.update({
          where: { id: programme.id },
          data: {
            titre: nouveauTitre,
            description: nouveauTitre
          }
        });
        
        console.log(`✅ ${codeDB}: "${nouveauTitre}"`);
        updated++;
      } else {
        console.log(`⚠️  Programme ${codeDB} non trouvé`);
      }
    }
    
    console.log(`\n📊 ${updated} programmes mis à jour`);
    
    // Vérifier les résultats finaux
    const resultatsFinaux = await prisma.programmeFormation.findMany({
      select: {
        code: true,
        titre: true
      },
      where: {
        titre: {
          not: 'Programme de formation'
        }
      },
      orderBy: { code: 'asc' }
    });
    
    console.log(`\n🎯 ${resultatsFinaux.length} programmes avec titres personnalisés:`);
    resultatsFinaux.forEach(p => {
      console.log(`   • ${p.code}: "${p.titre}"`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixCodesMapping();