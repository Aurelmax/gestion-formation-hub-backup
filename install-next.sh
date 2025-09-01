#!/bin/bash
# Script pour installer et configurer Next.js

echo "🚀 Installation de Next.js et configuration du projet"
echo "==================================================="

# 1. Désinstallation de Vite si présent
echo "🧹 Suppression de la configuration Vite..."
if [ -f "vite.config.ts" ]; then
  rm vite.config.ts && echo "✅ vite.config.ts supprimé"
else
  echo "ℹ️ Aucun fichier vite.config.ts trouvé"
fi

# 2. Nettoyage des dossiers de build
echo "🧹 Nettoyage des dossiers de build..."
rm -rf node_modules .next dist && echo "✅ node_modules, .next et dist supprimés"

# 3. Installation de Next.js et dépendances
echo "📦 Installation de Next.js et des dépendances..."
npm install --save next react react-dom @types/react @types/react-dom

# 4. Création du fichier next.config.js
echo "📝 Création du fichier next.config.js..."
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async headers() {
    return [{
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
      ],
    }]
  },
}

module.exports = nextConfig
EOF
echo "✅ next.config.js créé"

# 5. Mise à jour des scripts dans package.json
echo "📝 Mise à jour des scripts dans package.json..."
# Sauvegarde du package.json original
cp package.json package.json.bak

# Utilisation de jq pour modifier le fichier JSON si disponible
if command -v jq &> /dev/null; then
  jq '.scripts = {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }' package.json.bak > package.json
  echo "✅ Scripts mis à jour avec jq"
else
  # Méthode alternative si jq n'est pas disponible
  echo "⚠️ jq n'est pas installé, modification manuelle nécessaire"
  echo "Veuillez mettre à jour manuellement vos scripts dans package.json comme suit:"
  echo '{
  "scripts": {
    "dev": "next dev",
    "build": "next build", 
    "start": "next start",
    "lint": "next lint"
  }
}'
fi

# 6. Création de la structure de base pour les routes API
echo "📁 Création de la structure de base pour les routes API..."
mkdir -p app/api
touch app/layout.tsx
touch app/page.tsx

# Créer un exemple de route API
mkdir -p app/api/health
cat > app/api/health/route.ts << 'EOF'
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
}
EOF
echo "✅ Route API d'exemple créée: /api/health"

# 7. Réinstallation des dépendances et nettoyage
echo "🧹 Réinstallation des dépendances..."
npm install

echo "
✅ Installation terminée! 
------------------------------------------------
Pour démarrer le serveur de développement:
  npm run dev

Pour construire l'application:
  npm run build

Pour démarrer l'application en production:
  npm run start
------------------------------------------------
"
