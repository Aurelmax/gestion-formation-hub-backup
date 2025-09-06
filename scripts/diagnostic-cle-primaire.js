import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
}).$extends(withAccelerate());

async function diagnosticClePrimaire() {
  try {
    console.log('🔍 Diagnostic des clés primaires et contraintes...');
    console.log('===================================================');
    
    // 1. Vérifier la structure des IDs des programmes
    console.log('\n📊 Structure des IDs dans ProgrammeFormation:');
    const programmes = await prisma.programmeFormation.findMany({
      select: {
        id: true,
        code: true,
        titre: true
      },
      take: 5
    });
    
    programmes.forEach(p => {
      console.log(`ID: ${p.id} (type: ${typeof p.id}) - Code: ${p.code} - Titre: ${p.titre}`);
    });
    
    // 2. Vérifier les contraintes de clé étrangère
    console.log('\n🔗 Vérification des relations catégories:');
    const programmesAvecCategories = await prisma.programmeFormation.findMany({
      select: {
        code: true,
        categorieId: true,
        categorie: {
          select: {
            code: true,
            titre: true
          }
        }
      },
      take: 5
    });
    
    programmesAvecCategories.forEach(p => {
      console.log(`Programme: ${p.code} - CategorieId: ${p.categorieId} - Catégorie: ${p.categorie?.code || 'NULL'}`);
    });
    
    // 3. Vérifier si il y a des doublons de code (contrainte unique)
    console.log('\n🔄 Vérification des doublons de code:');
    const doublons = await prisma.$queryRaw`
      SELECT code, COUNT(*) as count 
      FROM "ProgrammeFormation" 
      GROUP BY code 
      HAVING COUNT(*) > 1
    `;
    
    if (doublons.length > 0) {
      console.log('⚠️  Doublons détectés:');
      doublons.forEach(d => console.log(`   Code: ${d.code} - Occurrences: ${d.count}`));
    } else {
      console.log('✅ Aucun doublon de code détecté');
    }
    
    // 4. Vérifier les IDs de catégories orphelines
    console.log('\n👻 Vérification des catégories orphelines:');
    const categoriesOrphelines = await prisma.programmeFormation.findMany({
      where: {
        categorieId: {
          not: null
        },
        categorie: null
      },
      select: {
        code: true,
        categorieId: true
      }
    });
    
    if (categoriesOrphelines.length > 0) {
      console.log('⚠️  Programmes avec catégories orphelines:');
      categoriesOrphelines.forEach(p => console.log(`   Programme: ${p.code} - CategorieId: ${p.categorieId}`));
    } else {
      console.log('✅ Aucune catégorie orpheline détectée');
    }
    
    // 5. Vérifier la séquence des IDs
    console.log('\n🔢 Vérification de la séquence des IDs:');
    const minMaxIds = await prisma.$queryRaw`
      SELECT 
        MIN(id) as min_id, 
        MAX(id) as max_id, 
        COUNT(*) as total_count
      FROM "ProgrammeFormation"
    `;
    
    console.log(`ID Min: ${minMaxIds[0].min_id} - ID Max: ${minMaxIds[0].max_id} - Total: ${minMaxIds[0].total_count}`);
    
    // 6. Tester une insertion simple pour voir si il y a des problèmes de contraintes
    console.log('\n🧪 Test d\'insertion simple:');
    try {
      const testProgramme = await prisma.programmeFormation.create({
        data: {
          code: 'TEST-DIAGNOSTIC-' + Date.now(),
          type: 'formation',
          titre: 'Test Diagnostic',
          description: 'Programme de test pour diagnostic',
          duree: '1 heure',
          prix: 'Test',
          niveau: 'Test',
          participants: 'Test',
          objectifs: ['Test diagnostic'],
          prerequis: 'Aucun',
          publicConcerne: 'Test',
          contenuDetailleJours: 'Test',
          horaires: 'Test',
          modalites: 'Test',
          modalitesAcces: 'Test',
          modalitesTechniques: 'Test',
          modalitesReglement: 'Test',
          formateur: 'Test',
          ressourcesDisposition: 'Test',
          modalitesEvaluation: 'Test',
          sanctionFormation: 'Test',
          niveauCertification: 'Test',
          delaiAcceptation: 'Test',
          accessibiliteHandicap: 'Test',
          cessationAbandon: 'Test'
        }
      });
      
      console.log(`✅ Insertion test réussie - ID: ${testProgramme.id}`);
      
      // Supprimer le programme test
      await prisma.programmeFormation.delete({
        where: { id: testProgramme.id }
      });
      console.log('✅ Suppression du test réussie');
      
    } catch (insertError) {
      console.error('❌ Erreur lors du test d\'insertion:', insertError.message);
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  } finally {
    await prisma.$disconnect();
  }
}

diagnosticClePrimaire();