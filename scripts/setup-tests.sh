#!/bin/bash

# Script de configuration des tests unitaires
# Installe et configure tous les outils nécessaires

echo "🧪 Configuration des Tests Unitaires - Gestion Formation Hub"
echo "==========================================================="

# Vérification que npm est disponible
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez installer Node.js et npm."
    exit 1
fi

echo "📦 Installation des dépendances de test..."

# Installation des dépendances de test si pas déjà présentes
npm install --save-dev \
  jest \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  @types/jest \
  babel-jest \
  identity-obj-proxy

echo "✅ Dépendances installées avec succès"

# Vérification de la configuration Jest
if [ -f "jest.config.js" ]; then
    echo "✅ Configuration Jest trouvée"
else
    echo "❌ Configuration Jest manquante"
    exit 1
fi

# Vérification des fichiers de setup
if [ -f "jest.setup.js" ]; then
    echo "✅ Fichier setup Jest trouvé"
else
    echo "❌ Fichier setup Jest manquant"
    exit 1
fi

# Création du dossier de tests s'il n'existe pas
mkdir -p __tests__/{hooks,components,utils,__mocks__}
echo "✅ Structure des dossiers de test créée"

# Test de la configuration
echo "🔧 Test de la configuration..."
npm test -- --passWithNoTests --verbose

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Configuration des tests réussie !"
    echo ""
    echo "📋 Commandes disponibles :"
    echo "  npm test                    # Exécuter tous les tests"
    echo "  npm run test:watch          # Mode watch"
    echo "  npm test -- --coverage      # Avec couverture"
    echo ""
    echo "📁 Structure créée :"
    echo "  __tests__/hooks/           # Tests des hooks React"
    echo "  __tests__/components/      # Tests des composants"
    echo "  __tests__/utils/           # Tests des utilitaires"
    echo ""
    echo "📖 Consultez GUIDE_TESTS_RECOMMANDATIONS.md pour plus d'infos"
else
    echo "❌ Erreur lors de la configuration des tests"
    exit 1
fi