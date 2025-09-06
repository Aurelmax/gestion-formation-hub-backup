import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
}).$extends(withAccelerate());

async function testPrismaCloud() {
  try {
    console.log('🔍 Test de connexion Prisma Cloud...');
    console.log('========================================');
    
    // Test de connexion basique
    const connectionTest = await prisma.$queryRaw`SELECT NOW() as current_time`;
    console.log('✅ Connexion OK:', connectionTest);
    
    // Compter les programmes
    const programmeCount = await prisma.programmeFormation.count();
    console.log(`📊 Nombre total de programmes: ${programmeCount}`);
    
    // Lister tous les programmes
    const programmes = await prisma.programmeFormation.findMany({
      select: {
        id: true,
        code: true,
        titre: true,
        dateCreation: true,
        dateModification: true
      },
      orderBy: { id: 'desc' }
    });
    
    console.log('\n📚 Programmes dans la base:');
    programmes.forEach((p, index) => {
      console.log(`${index + 1}. ${p.code} - ${p.titre}`);
      if (p.dateCreation) console.log(`   Créé: ${p.dateCreation.toISOString()}`);
      if (p.dateModification) console.log(`   Modifié: ${p.dateModification.toISOString()}`);
      console.log('');
    });
    
    // Compter les catégories
    const categorieCount = await prisma.categorieProgramme.count();
    console.log(`🏷️  Nombre total de catégories: ${categorieCount}`);
    
    // Lister toutes les catégories
    const categories = await prisma.categorieProgramme.findMany({
      select: {
        id: true,
        code: true,
        titre: true,
        _count: {
          select: {
            programmes: true
          }
        }
      }
    });
    
    console.log('\n🏷️  Catégories dans la base:');
    categories.forEach((c, index) => {
      console.log(`${index + 1}. ${c.code} - ${c.titre} (${c._count.programmes} programmes)`);
    });
    
    // Test spécifique pour les dernières insertions
    const recentProgrammes = await prisma.programmeFormation.findMany({
      where: {
        dateCreation: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Dernières 24h
        }
      },
      select: {
        code: true,
        titre: true,
        dateCreation: true
      },
      orderBy: { id: 'desc' }
    });
    
    console.log(`\n🕒 Programmes créés dans les dernières 24h: ${recentProgrammes.length}`);
    recentProgrammes.forEach(p => {
      console.log(`   • ${p.code} - ${p.titre} (${p.dateCreation ? p.dateCreation.toISOString() : 'Date inconnue'})`);
    });
    
  } catch (error) {
    console.error('❌ Erreur de connexion Prisma Cloud:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrismaCloud();