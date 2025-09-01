-- Migration personnalisée pour ajouter les nouveaux champs tout en préservant les données existantes

-- Étape 1 : Ajout des nouveaux champs avec des valeurs par défaut temporaires

-- Ajouter les nouveaux champs
ALTER TABLE "formations" 
ADD COLUMN IF NOT EXISTS "code" TEXT DEFAULT 'TEMP_CODE',
ADD COLUMN IF NOT EXISTS "libelle" TEXT DEFAULT 'Titre temporaire',
ADD COLUMN IF NOT EXISTS "contenu_detaille_jours" TEXT;

-- Étape 2 : Renommer les colonnes existantes qui changent de nom mais gardent leur contenu

-- Mise à jour du schéma: conversion de titre à libelle si nécessaire
UPDATE "formations" SET "libelle" = "titre" WHERE "titre" IS NOT NULL;

-- Étape 3 : Définir des valeurs par défaut pour les colonnes requises qui n'existent pas encore
ALTER TABLE "formations"
ADD COLUMN IF NOT EXISTS "cessation_abandon" TEXT DEFAULT 'En cas de cessation anticipée ou d''abandon de la formation par le stagiaire, l''organisme remboursera au prorata temporis la partie non effectuée.',
ADD COLUMN IF NOT EXISTS "contact_organisme" TEXT DEFAULT 'GestionMax - aurelien@gestionmax.fr - 01.23.45.67.89',
ADD COLUMN IF NOT EXISTS "modalites_evaluation" TEXT DEFAULT 'Quiz, exercices pratiques, projets d''application',
ADD COLUMN IF NOT EXISTS "modalites_reglement" TEXT DEFAULT 'Paiement à réception de facture, 30% à la commande',
ADD COLUMN IF NOT EXISTS "public_concerne" TEXT DEFAULT 'Tout public',
ADD COLUMN IF NOT EXISTS "sanction_formation" TEXT DEFAULT 'Attestation de fin de formation';

-- Étape 4 : Supprimer les valeurs par défaut après insertion des données
ALTER TABLE "formations" 
ALTER COLUMN "code" DROP DEFAULT,
ALTER COLUMN "libelle" DROP DEFAULT,
ALTER COLUMN "cessation_abandon" DROP DEFAULT,
ALTER COLUMN "modalites_evaluation" DROP DEFAULT,
ALTER COLUMN "modalites_reglement" DROP DEFAULT,
ALTER COLUMN "public_concerne" DROP DEFAULT,
ALTER COLUMN "sanction_formation" DROP DEFAULT;

ALTER TABLE "formations"
ALTER COLUMN "objectifs_pedagogiques" DROP DEFAULT,
ALTER COLUMN "referent_pedagogique" SET DEFAULT 'Aurélien Lien - aurelien@gestionmax.fr',
ALTER COLUMN "referent_qualite" SET DEFAULT 'Aurélien Lien - aurelien@gestionmax.fr';

-- AlterTable
ALTER TABLE "positionnement_requests" ADD COLUMN     "adresse_entreprise" TEXT,
ADD COLUMN     "besoins_specifiques" TEXT,
ADD COLUMN     "canal" TEXT,
ADD COLUMN     "contraintes" TEXT,
ADD COLUMN     "date_rendez_vous" TIMESTAMP(3),
ADD COLUMN     "delais_demarrage" TEXT,
ADD COLUMN     "entreprise" TEXT,
ADD COLUMN     "interlocuteur_email" TEXT,
ADD COLUMN     "interlocuteur_fonction" TEXT,
ADD COLUMN     "interlocuteur_nom" TEXT,
ADD COLUMN     "interlocuteur_telephone" TEXT,
ADD COLUMN     "note_qualification" TEXT,
ADD COLUMN     "numero_convention" TEXT,
ADD COLUMN     "objectif_rendez_vous" TEXT,
ADD COLUMN     "organisme_financeur" TEXT,
ADD COLUMN     "prerequis_formation" TEXT,
ADD COLUMN     "prise_en_charge_opco" BOOLEAN DEFAULT false,
ADD COLUMN     "reste_pour_entreprise" TEXT,
ADD COLUMN     "siret" TEXT,
ADD COLUMN     "synthese" TEXT,
ADD COLUMN     "taux_prise_en_charge" TEXT,
ADD COLUMN     "type_financement" TEXT;
