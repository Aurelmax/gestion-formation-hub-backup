import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔍 Vérification des programmes importés...');
    console.log('==========================================');
    
    // Vérifier les catégories et leurs programmes
    const categories = await prisma.categorieProgramme.findMany({
      include: {
        programmes: {
          orderBy: { code: 'asc' }
        }
      },
      orderBy: { ordre: 'asc' }
    });
    
    console.log(`📊 ${categories.length} catégories trouvées:\n`);
    
    let totalProgrammes = 0;
    
    categories.forEach(cat => {
      console.log(`📁 ${cat.titre} (${cat.code})`);
      console.log(`   ${cat.programmes.length} programmes:`);
      
      if (cat.programmes.length === 0) {
        console.log('   ❌ Aucun programme dans cette catégorie');
      } else {
        cat.programmes.forEach(prog => {
          console.log(`   ✅ ${prog.code} - ${prog.titre}`);
        });
      }
      
      totalProgrammes += cat.programmes.length;
      console.log('');
    });
    
    console.log(`🎉 Total: ${totalProgrammes} programmes répartis dans ${categories.length} catégories`);
    
    // Vérifier les programmes sans catégorie
    const programmesSansCategorie = await prisma.programmeFormation.findMany({
      where: { categorieId: null },
      select: { code: true, titre: true }
    });
    
    if (programmesSansCategorie.length > 0) {
      console.log(`\n⚠️  ${programmesSansCategorie.length} programmes sans catégorie:`);
      programmesSansCategorie.forEach(prog => {
        console.log(`   • ${prog.code} - ${prog.titre}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();