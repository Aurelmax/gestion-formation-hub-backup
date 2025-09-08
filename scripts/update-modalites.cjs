const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateModalites() {
  console.log('🔄 Mise à jour des modalités des programmes...');
  
  try {
    // Mettre à jour tous les programmes qui n'ont pas déjà la nouvelle valeur
    const result = await prisma.programmeFormation.updateMany({
      where: {
        NOT: {
          modalites: 'En présentiel individuel'
        }
      },
      data: {
        modalites: 'En présentiel individuel'
      }
    });
    
    console.log(`✅ ${result.count} programmes mis à jour avec les nouvelles modalités`);
    
    // Vérifier le résultat
    const programmes = await prisma.programmeFormation.findMany({
      select: {
        code: true,
        modalites: true
      },
      take: 5
    });
    
    console.log('📋 Échantillon des programmes mis à jour:');
    programmes.forEach(p => {
      console.log(`  - ${p.code}: ${p.modalites}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateModalites();