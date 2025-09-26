import * as fs from 'fs';
import * as path from 'path';

/**
 * Script pour corriger les problèmes de détection de l'audit
 */

function fixAuditDetection() {
  console.log('🔧 CORRECTION DE LA DÉTECTION DE L\'AUDIT');
  console.log('========================================');

  let fixedCount = 0;

  // Fonction pour corriger un fichier
  function fixFile(filePath: string) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      // 1. Corriger la signature params pour les endpoints dynamiques
      const paramsSignatureRegex = /{ params }: { params: Promise<{ id: string }> }/g;
      if (paramsSignatureRegex.test(content)) {
        content = content.replace(paramsSignatureRegex, '{ params }: { params: { id: string } }');
        modified = true;
        console.log(`  ✅ ${path.relative(process.cwd(), filePath)} - Signature params corrigée`);
      }

      // 2. Standardiser la réponse auth
      const authErrorRegex = /return authResult\.error!/g;
      if (authErrorRegex.test(content)) {
        content = content.replace(authErrorRegex, `return NextResponse.json(
    { error: "Non authentifié" },
    { status: 401 }
  )`);
        modified = true;
        console.log(`  ✅ ${path.relative(process.cwd(), filePath)} - Réponse auth standardisée`);
      }

      // 3. Uniformiser le catch avec NextResponse.json
      const catchRegex = /} catch \(error\) \{\s*console\.error\([^)]*\);\s*return NextResponse\.json\(\s*\{ error: [^}]+ \},\s*\{ status: 500 \}\s*\);\s*\}/g;
      if (catchRegex.test(content)) {
        content = content.replace(catchRegex, (match) => {
          return `} catch (error) {
  console.error("Erreur serveur:", error);
  return NextResponse.json(
    { error: "Erreur serveur" },
    { status: 500 }
  );
}`;
        });
        modified = true;
        console.log(`  ✅ ${path.relative(process.cwd(), filePath)} - Catch standardisé`);
      }

      // 4. Corriger les catch qui n'ont pas NextResponse.json
      const catchWithoutResponseRegex = /} catch \(error\) \{\s*console\.error\([^)]*\);\s*return[^;]+;\s*\}/g;
      if (catchWithoutResponseRegex.test(content)) {
        content = content.replace(catchWithoutResponseRegex, (match) => {
          return `} catch (error) {
  console.error("Erreur serveur:", error);
  return NextResponse.json(
    { error: "Erreur serveur" },
    { status: 500 }
  );
}`;
        });
        modified = true;
        console.log(`  ✅ ${path.relative(process.cwd(), filePath)} - Catch sans NextResponse.json corrigé`);
      }

      // 5. S'assurer que tous les imports sont présents
      if (!content.includes('import { NextRequest, NextResponse }')) {
        const lines = content.split('\n');
        const importLine = "import { NextRequest, NextResponse } from 'next/server';";
        lines.splice(0, 0, importLine);
        content = lines.join('\n');
        modified = true;
        console.log(`  ✅ ${path.relative(process.cwd(), filePath)} - Import NextResponse ajouté`);
      }

      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        fixedCount++;
      }

    } catch (error: any) {
      console.log(`  ❌ ${path.relative(process.cwd(), filePath)} - Erreur: ${error.message}`);
    }
  }

  // Endpoints spécifiques à corriger
  const specificEndpoints = [
    'app/api/accessibilite/demandes/[id]/route.ts',
    'app/api/accessibilite/plans/[id]/route.ts',
    'app/api/actions-correctives/[id]/route.ts',
    'app/api/categories/[id]/route.ts',
    'app/api/competences/[id]/route.ts',
    'app/api/programmes-formation/[id]/route.ts',
    'app/api/reclamations/[id]/route.ts',
    'app/api/rendezvous/[id]/route.ts',
    'app/api/rendezvous/[id]/statut/route.ts',
    'app/api/veille/[id]/route.ts',
    'app/api/veille/[id]/commentaire/route.ts',
    'app/api/veille/[id]/commentaires/[commentaireId]/route.ts',
    'app/api/veille/[id]/documents/route.ts',
    'app/api/files/veille/[veilleId]/[filename]/route.ts',
    'app/api/programmes-formation/by-code/[code]/route.ts',
    'app/api/categories/route.ts',
    'app/api/categories-programme/route.ts',
    'app/api/programmes-formation/route.ts',
  ];

  console.log('🔧 Correction de la détection de l\'audit...');
  specificEndpoints.forEach(endpoint => {
    const fullPath = path.join(process.cwd(), endpoint);
    if (fs.existsSync(fullPath)) {
      fixFile(fullPath);
    } else {
      console.log(`  ⚠️ ${endpoint} - Fichier non trouvé`);
    }
  });

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
const success = fixAuditDetection();
process.exit(success ? 0 : 1);
