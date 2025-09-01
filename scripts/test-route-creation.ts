import fs from 'fs';
import path from 'path';

function testRouteCreation() {
  const routeDir = path.join(process.cwd(), 'app', 'api', 'test-route');
  const routeFile = path.join(routeDir, 'route.ts');
  
  // Créer le dossier
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
    console.log('✅ Dossier de route créé:', routeDir);
  }
  
  // Créer le fichier de test
  const testContent = `// Route de test
export async function GET() {
  return new Response('Test réussi!');
}
`;
  
  fs.writeFileSync(routeFile, testContent);
  console.log('✅ Fichier de route créé:', routeFile);
  
  // Vérifier que le fichier existe
  if (fs.existsSync(routeFile)) {
    console.log('✅ Vérification fichier: OK');
    return true;
  } else {
    console.log('❌ Erreur création fichier');
    return false;
  }
}

testRouteCreation();
