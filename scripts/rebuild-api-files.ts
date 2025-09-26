import * as fs from 'fs';
import * as path from 'path';

/**
 * Script pour reconstruire les fichiers API avec une structure propre
 * Problème: fichiers complètement cassés par les scripts automatiques
 */

function rebuildApiFiles() {
  console.log('🔧 RECONSTRUCTION DES FICHIERS API');
  console.log('===================================');

  let rebuiltCount = 0;

  // Templates pour les différents types d'endpoints
  const templates = {
    // Template pour GET simple
    getSimple: (modelName: string, modelPlural: string, authRequired: boolean = true) => `
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    ${authRequired ? `
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }` : ''}

    const { id } = params;

    const ${modelName} = await prisma.${modelPlural}.findUnique({
      where: { id }
    });

    if (!${modelName}) {
      return NextResponse.json(
        { error: '${modelName} non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(${modelName});
  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération' },
      { status: 500 }
    );
  }
}`,

    // Template pour PUT
    putTemplate: (modelName: string, modelPlural: string, fields: string[]) => `
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification et les permissions admin
    const authResult = await requireAuthWithRole('admin');
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { id } = params;
    const { ${fields.join(', ')} } = await request.json();

    const ${modelName} = await prisma.${modelPlural}.findUnique({
      where: { id }
    });

    if (!${modelName}) {
      return NextResponse.json(
        { error: '${modelName} non trouvé' },
        { status: 404 }
      );
    }

    const updated${modelName} = await prisma.${modelPlural}.update({
      where: { id },
      data: {
        ${fields.map(field => `${field}`).join(',\n        ')}
      }
    });

    return NextResponse.json(updated${modelName});
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour' },
      { status: 500 }
    );
  }
}`,

    // Template pour DELETE
    deleteTemplate: (modelName: string, modelPlural: string) => `
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification et les permissions admin
    const authResult = await requireAuthWithRole('admin');
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { id } = params;

    const ${modelName} = await prisma.${modelPlural}.findUnique({
      where: { id }
    });

    if (!${modelName}) {
      return NextResponse.json(
        { error: '${modelName} non trouvé' },
        { status: 404 }
      );
    }

    await prisma.${modelPlural}.delete({
      where: { id },
    });

    return NextResponse.json({ message: '${modelName} supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression' },
      { status: 500 }
    );
  }
}`
  };

  // Configuration des fichiers à reconstruire
  const filesToRebuild = [
    {
      path: 'app/api/accessibilite/plans/[id]/route.ts',
      imports: ['NextRequest', 'NextResponse', 'prisma', 'requireAuth', 'requireAuthWithRole'],
      modelName: 'plan',
      modelPlural: 'plans_accessibilite',
      methods: ['GET', 'PUT', 'DELETE'],
      putFields: ['nom', 'description', 'statut', 'date_creation']
    },
    {
      path: 'app/api/accessibilite/plans/route.ts',
      imports: ['NextRequest', 'NextResponse', 'prisma', 'requireAuth', 'requireAuthWithRole'],
      modelName: 'plan',
      modelPlural: 'plans_accessibilite',
      methods: ['GET', 'POST'],
      postFields: ['nom', 'description', 'statut']
    },
    {
      path: 'app/api/accessibilite/demandes/route.ts',
      imports: ['NextRequest', 'NextResponse', 'prisma', 'requireAuth', 'requireAuthWithRole'],
      modelName: 'demande',
      modelPlural: 'demandes_accessibilite',
      methods: ['GET', 'POST'],
      postFields: ['nom', 'email', 'telephone', 'description']
    }
  ];

  // Fonction pour reconstruire un fichier
  function rebuildFile(config: any) {
    try {
      const fullPath = path.join(process.cwd(), config.path);
      console.log(`\n🔧 Reconstruction de ${config.path}:`);

      // Générer les imports
      const imports = `import { ${config.imports.join(', ')} } from 'next/server';
import { prisma } from "@/lib/prisma";
import { requireAuth, requireAuthWithRole } from '@/lib/api-auth';`;

      // Générer les méthodes
      let methods = '';
      
      if (config.methods.includes('GET')) {
        methods += templates.getSimple(config.modelName, config.modelPlural);
      }
      
      if (config.methods.includes('PUT')) {
        methods += templates.putTemplate(config.modelName, config.modelPlural, config.putFields || []);
      }
      
      if (config.methods.includes('DELETE')) {
        methods += templates.deleteTemplate(config.modelName, config.modelPlural);
      }
      
      if (config.methods.includes('POST')) {
        methods += `
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { ${config.postFields.join(', ')} } = await request.json();

    const nouveau${config.modelName} = await prisma.${config.modelPlural}.create({
      data: {
        ${config.postFields.map(field => `${field}`).join(',\n        ')}
      }
    });

    return NextResponse.json(nouveau${config.modelName}, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création' },
      { status: 500 }
    );
  }
}`;
      }

      // Assembler le fichier complet
      const content = imports + '\n\n' + methods;

      // Écrire le fichier
      fs.writeFileSync(fullPath, content, 'utf8');
      rebuiltCount++;
      console.log(`  ✅ Fichier reconstruit !`);

    } catch (error: any) {
      console.log(`  ❌ Erreur: ${error.message}`);
    }
  }

  console.log('🔧 Reconstruction des fichiers API...');
  
  filesToRebuild.forEach(rebuildFile);

  console.log(`\n📊 RÉSUMÉ DE LA RECONSTRUCTION`);
  console.log('==============================');
  console.log(`✅ Fichiers reconstruits: ${rebuiltCount}`);

  if (rebuiltCount > 0) {
    console.log('\n🎉 Fichiers API reconstruits !');
    console.log('📝 Prochaines étapes:');
    console.log('  1. Vérifier avec: npx tsc --noEmit');
    console.log('  2. Tester avec: npm run audit:standardized');
  }

  return rebuiltCount > 0;
}

// Exécution de la reconstruction
const success = rebuildApiFiles();
process.exit(success ? 0 : 1);
