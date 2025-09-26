#!/bin/bash

echo "🔧 Configuration des variables d'environnement Clerk"
echo "=================================================="

# Vérifier si .env.local existe
if [ -f ".env.local" ]; then
    echo "⚠️  Le fichier .env.local existe déjà"
    read -p "Voulez-vous le remplacer ? (y/N): " replace
    if [[ ! $replace =~ ^[Yy]$ ]]; then
        echo "❌ Configuration annulée"
        exit 1
    fi
fi

echo ""
echo "📝 Veuillez fournir vos clés Clerk :"
echo ""

# Demander les clés
read -p "🔑 Publishable Key (pk_test_...): " publishable_key
read -p "🔐 Secret Key (sk_test_...): " secret_key
read -p "🌐 URL de base de données (optionnel): " database_url

# Valeurs par défaut
database_url=${database_url:-"postgresql://username:password@localhost:5432/gestionmax_local"}

echo ""
echo "📄 Création du fichier .env.local..."

# Créer le fichier .env.local
cat > .env.local << EOF
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${publishable_key}
CLERK_SECRET_KEY=${secret_key}

# Clerk URLs (optionnel - pour les domaines personnalisés)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Webhook Secret (à configurer après)
CLERK_WEBHOOK_SECRET=whsec_votre_secret_webhook_ici

# Database
DATABASE_URL="${database_url}"

# NextAuth (à supprimer après migration complète)
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
EOF

echo "✅ Fichier .env.local créé avec succès !"
echo ""
echo "🚀 Prochaines étapes :"
echo "1. Configurez les webhooks dans votre dashboard Clerk"
echo "2. Exécutez : npm run test:clerk"
echo "3. Démarrez l'application : npm run dev"
echo ""
echo "📖 Consultez CLERK_MIGRATION_GUIDE.md pour plus de détails"
