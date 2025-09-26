-- Migration pour ajouter le champ clerkId à la table users
-- Exécuter ce script directement sur votre base de données

-- Ajouter la colonne clerkId si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'clerkId'
    ) THEN
        ALTER TABLE users ADD COLUMN "clerkId" TEXT UNIQUE;
        RAISE NOTICE 'Colonne clerkId ajoutée avec succès';
    ELSE
        RAISE NOTICE 'La colonne clerkId existe déjà';
    END IF;
END $$;

-- Créer un index sur clerkId pour les performances
CREATE INDEX IF NOT EXISTS "users_clerkId_idx" ON users("clerkId");

-- Afficher un message de confirmation
SELECT 'Migration Clerk terminée avec succès' as message;
