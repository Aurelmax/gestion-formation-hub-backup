import { prisma } from '../app/lib/prisma';

async function main() {
  try {
    console.log('🔍 Vérification des catégories dans Prisma Cloud...');
    
    const categories = await prisma.categorieProgramme.findMany({
      orderBy: { ordre: 'asc' }
    });
    
    console.log(`📊 ${categories.length} catégories trouvées:`);
    
    if (categories.length === 0) {
      console.log('❌ Aucune catégorie trouvée dans la base Prisma Cloud');
      console.log('💡 Il faut migrer les données depuis votre base locale');
    } else {
      categories.forEach(cat => {
        console.log(`  ✅ ${cat.titre} (${cat.code}) - Ordre: ${cat.ordre}`);
      });
    }

    // Vérifier aussi les programmes
    const programmes = await prisma.programmeFormation.count();
    console.log(`📚 ${programmes} programmes de formation trouvés`);
    
    if (programmes === 0) {
      console.log('❌ Aucun programme trouvé dans la base Prisma Cloud');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();