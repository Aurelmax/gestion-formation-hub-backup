import * as fs from 'fs';
import * as path from 'path';

/**
 * Script simple pour corriger les endpoints dynamiques
 */

function fixSimple() {
  console.log('🔧 CORRECTION SIMPLE DES ENDPOINTS DYNAMIQUES');
  console.log('============================================');

  let fixedCount = 0;

  // Fonction pour corriger un fichier spécifique
  function fixSpecificFile(filePath: string, template: string) {
    try {
      if (fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, template, 'utf8');
        console.log(`  ✅ ${path.relative(process.cwd(), filePath)} - Corrigé`);
        fixedCount++;
      } else {
        console.log(`  ⚠️ ${filePath} - Fichier non trouvé`);
      }
    } catch (error: any) {
      console.log(`  ❌ ${filePath} - Erreur: ${error.message}`);
    }
  }

  // Template pour accessibilite/demandes/[id]
  const accessibiliteDemandesIdTemplate = `import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { requireAuth, requireAuthWithRole } from '@/lib/api-auth';

// GET - Récupérer une demande d'accessibilité spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return authResult.error!;
    }

    const { id } = await params;

    const demande = await prisma.demandeAccessibilite.findUnique({
      where: { id }
    });

    if (!demande) {
      return NextResponse.json(
        { error: 'Demande d\\'accessibilité non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(demande);
  } catch (error) {
    console.error('Erreur lors de la récupération de la demande d\\'accessibilité:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération de la demande d\\'accessibilité' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une demande d'accessibilité
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'authentification et les permissions admin
    const authResult = await requireAuthWithRole('admin');
    if (!authResult.isAuthenticated) {
      return authResult.error!;
    }

    const { id } = await params;
    const {
      nom,
      email,
      telephone,
      description,
      statut,
      reponse
    } = await request.json();

    const demande = await prisma.demandeAccessibilite.findUnique({
      where: { id }
    });

    if (!demande) {
      return NextResponse.json(
        { error: 'Demande d\\'accessibilité non trouvée' },
        { status: 404 }
      );
    }

    const updatedDemande = await prisma.demandeAccessibilite.update({
      where: { id },
      data: {
        nom,
        email,
        telephone,
        description,
        statut,
        reponse,
        updated_at: new Date()
      }
    });

    return NextResponse.json(updatedDemande);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la demande d\\'accessibilité:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour de la demande d\\'accessibilité' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une demande d'accessibilité
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'authentification et les permissions admin
    const authResult = await requireAuthWithRole('admin');
    if (!authResult.isAuthenticated) {
      return authResult.error!;
    }

    const { id } = await params;

    const demande = await prisma.demandeAccessibilite.findUnique({
      where: { id }
    });

    if (!demande) {
      return NextResponse.json(
        { error: 'Demande d\\'accessibilité non trouvée' },
        { status: 404 }
      );
    }

    await prisma.demandeAccessibilite.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Demande d\\'accessibilité supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la demande d\\'accessibilité:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression de la demande d\\'accessibilité' },
      { status: 500 }
    );
  }
}`;

  // Template pour accessibilite/plans/[id]
  const accessibilitePlansIdTemplate = `import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { requireAuth, requireAuthWithRole } from '@/lib/api-auth';

// GET - Récupérer un plan d'accessibilité spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return authResult.error!;
    }

    const { id } = await params;

    const plan = await prisma.planAccessibilite.findUnique({
      where: { id }
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan d\\'accessibilité non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error('Erreur lors de la récupération du plan d\\'accessibilité:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération du plan d\\'accessibilité' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un plan d'accessibilité
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'authentification et les permissions admin
    const authResult = await requireAuthWithRole('admin');
    if (!authResult.isAuthenticated) {
      return authResult.error!;
    }

    const { id } = await params;
    const data = await request.json();

    const plan = await prisma.planAccessibilite.findUnique({
      where: { id }
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan d\\'accessibilité non trouvé' },
        { status: 404 }
      );
    }

    const updatedPlan = await prisma.planAccessibilite.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date()
      }
    });

    return NextResponse.json(updatedPlan);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du plan d\\'accessibilité:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour du plan d\\'accessibilité' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un plan d'accessibilité
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'authentification et les permissions admin
    const authResult = await requireAuthWithRole('admin');
    if (!authResult.isAuthenticated) {
      return authResult.error!;
    }

    const { id } = await params;

    const plan = await prisma.planAccessibilite.findUnique({
      where: { id }
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan d\\'accessibilité non trouvé' },
        { status: 404 }
      );
    }

    await prisma.planAccessibilite.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Plan d\\'accessibilité supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du plan d\\'accessibilité:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression du plan d\\'accessibilité' },
      { status: 500 }
    );
  }
}`;

  console.log('🔧 Correction des endpoints dynamiques...');
  
  // Corriger les fichiers spécifiques
  fixSpecificFile('app/api/accessibilite/demandes/[id]/route.ts', accessibiliteDemandesIdTemplate);
  fixSpecificFile('app/api/accessibilite/plans/[id]/route.ts', accessibilitePlansIdTemplate);

  console.log(`\n📊 RÉSUMÉ DES CORRECTIONS`);
  console.log('========================');
  console.log(`✅ Fichiers corrigés: ${fixedCount}`);

  if (fixedCount > 0) {
    console.log('\n🎉 Corrections appliquées !');
    console.log('📝 Prochaines étapes:');
    console.log('  1. Vérifier avec: npm run audit:improved');
    console.log('  2. Tester avec: npm run verify:protections');
  }

  return fixedCount > 0;
}

// Exécution des corrections
const success = fixSimple();
process.exit(success ? 0 : 1);
