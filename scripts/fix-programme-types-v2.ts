import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixProgrammeTypes() {
  try {
    console.log('=== CORRECTION DES TYPES DE PROGRAMMES ===\n');

    // Mettre à jour tous les programmes avec type="formation" vers type="catalogue"
    const updateResult = await prisma.programmeFormation.updateMany({
      where: {
        type: 'formation'
      },
      data: {
        type: 'catalogue'
      }
    });

    console.log(`✅ ${updateResult.count} programmes mis à jour de "formation" vers "catalogue"`);

    // Vérification post-correction
    console.log('\n=== VÉRIFICATION POST-CORRECTION ===');
    const programmesUpdated = await prisma.programmeFormation.findMany({
      select: {
        code: true,
        type: true,
        estActif: true,
        estVisible: true
      }
    });

    const catalogueCount = programmesUpdated.filter(p => p.type === 'catalogue').length;
    const activeVisibleCatalogueCount = programmesUpdated.filter(p => 
      p.type === 'catalogue' && p.estActif && p.estVisible
    ).length;

    console.log(`Programmes type "catalogue": ${catalogueCount}`);
    console.log(`Programmes prêts pour publication: ${activeVisibleCatalogueCount}`);

    programmesUpdated.forEach(prog => {
      console.log(`- ${prog.code}: type="${prog.type}" (actif: ${prog.estActif}, visible: ${prog.estVisible})`);
    });

    if (activeVisibleCatalogueCount > 0) {
      console.log('\n🎉 SUCCÈS! Les programmes sont maintenant prêts pour l\'affichage sur le front-end');
    }

  } catch (error) {
    console.error('Erreur lors de la correction:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixProgrammeTypes();