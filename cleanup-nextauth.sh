#!/bin/bash
set -e

echo "🧹 Nettoyage des fichiers NextAuth..."

# Liste des fichiers NextAuth à supprimer
FILES=(
  "./app/auth.ts"
  "./app/lib/auth.ts"
  "./app/hooks/useAuth.tsx"
  "./app/components/providers/ClientProviders.tsx"
  "./app/components/providers/AuthProvider.tsx" # ⚠️ Seulement si c'est bien l'ancien basé sur SessionProvider
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    rm -f "$file"
    echo "❌ Supprimé : $file"
  else
    echo "⚠️ Non trouvé (déjà supprimé ?) : $file"
  fi
done

echo "✅ Nettoyage terminé !"
echo "👉 Pense à mettre à jour tes imports dans Navigation.tsx et les pages admin."
