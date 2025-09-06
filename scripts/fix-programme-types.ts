import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixProgrammeTypes() {
  try {
    console.log('=== CORRECTION DES TYPES DE PROGRAMMES ===\n');

    // Récupérer tous les programmes
    const programmes = await prisma.programmeFormation.findMany({
      select: {
        id: true,
        code: true,
        titre: true,
        type: true
      }
    });

    console.log(`Programmes trouvés: ${programmes.length}`);
    
    // Afficher l'état actuel
    console.log('\nÉtat actuel des types:');
    programmes.forEach(prog => {
      console.log(`- ${prog.code}: type="${prog.type}" (${prog.type ? 'OK' : 'VIDE'})`);
    });

    // Mettre à jour tous les programmes vers type "catalogue" par défaut
    const updateResult = await prisma.programmeFormation.updateMany({
      where: {
        type: {
          in: ['', 'formation', null] // Types vides ou incorrects
        }
      },
      data: {
        type: 'catalogue' // Type standard pour le catalogue public
      }
    });

    console.log(`\n✅ ${updateResult.count} programmes mis à jour vers type "catalogue"`);

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