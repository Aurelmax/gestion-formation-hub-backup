/*
  Warnings:

  - You are about to drop the column `statut_dossier` on the `dossiers_formation` table. All the data in the column will be lost.
  - You are about to drop the column `adresse` on the `positionnement_requests` table. All the data in the column will be lost.
  - You are about to drop the column `attestation_besoin` on the `positionnement_requests` table. All the data in the column will be lost.
  - You are about to drop the column `besoins_specifiques` on the `positionnement_requests` table. All the data in the column will be lost.
  - You are about to drop the column `canal` on the `positionnement_requests` table. All the data in the column will be lost.
  - You are about to drop the column `code_postal` on the `positionnement_requests` table. All the data in the column will be lost.
  - You are about to drop the column `contraintes` on the `positionnement_requests` table. All the data in the column will be lost.
  - You are about to drop the column `date_naissance` on the `positionnement_requests` table. All the data in the column will be lost.
  - You are about to drop the column `date_rendez_vous` on the `positionnement_requests` table. All the data in the column will be lost.
  - You are about to drop the column `delais_demarrage` on the `positionnement_requests` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `positionnement_requests` table. All the data in the column will be lost.
  - You are about to drop the column `experience_wordpress` on the `positionnement_requests` table. All the data in the column will be lost.
  - You are about to drop the column `niveau_maitrise` on the `positionnement_requests` table. All the data in the column will be lost.
  - You are about to drop the column `note_qualification` on the `positionnement_requests` table. All the data in the column will be lost.
  - You are about to drop the column `numero_convention` on the `positionnement_requests` table. All the data in the column will be lost.
  - You are about to drop the column `objectif_rendez_vous` on the `positionnement_requests` table. All the data in the column will be lost.
  - You are about to drop the column `objectifs_principaux` on the `positionnement_requests` table. All the data in the column will be lost.
  - You are about to drop the column `prerequis_formation` on the `positionnement_requests` table. All the data in the column will be lost.
  - You are about to drop the column `prise_en_charge_opco` on the `positionnement_requests` table. All the data in the column will be lost.
  - You are about to drop the column `programme_formation` on the `positionnement_requests` table. All the data in the column will be lost.
  - You are about to drop the column `reste_pour_entreprise` on the `positionnement_requests` table. All the data in the column will be lost.
  - You are about to drop the column `sexe` on the `positionnement_requests` table. All the data in the column will be lost.
  - You are about to drop the column `situation_handicap` on the `positionnement_requests` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `positionnement_requests` table. All the data in the column will be lost.
  - You are about to drop the column `synthese` on the `positionnement_requests` table. All the data in the column will be lost.
  - You are about to drop the column `taux_prise_en_charge` on the `positionnement_requests` table. All the data in the column will be lost.
  - You are about to drop the column `telephone` on the `positionnement_requests` table. All the data in the column will be lost.
  - You are about to drop the column `ville` on the `positionnement_requests` table. All the data in the column will be lost.
  - Added the required column `attentes` to the `positionnement_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_dispo` to the `positionnement_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email_beneficiaire` to the `positionnement_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pratique_actuelle` to the `positionnement_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `situation_actuelle` to the `positionnement_requests` table without a default value. This is not possible if the table is not empty.
  - Made the column `statut` on table `positionnement_requests` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."dossiers_formation" DROP COLUMN "statut_dossier",
ADD COLUMN     "programme_formation_id" TEXT,
ADD COLUMN     "statut" TEXT NOT NULL DEFAULT 'inscrit';

-- AlterTable
ALTER TABLE "public"."positionnement_requests" DROP COLUMN "adresse",
DROP COLUMN "attestation_besoin",
DROP COLUMN "besoins_specifiques",
DROP COLUMN "canal",
DROP COLUMN "code_postal",
DROP COLUMN "contraintes",
DROP COLUMN "date_naissance",
DROP COLUMN "date_rendez_vous",
DROP COLUMN "delais_demarrage",
DROP COLUMN "email",
DROP COLUMN "experience_wordpress",
DROP COLUMN "niveau_maitrise",
DROP COLUMN "note_qualification",
DROP COLUMN "numero_convention",
DROP COLUMN "objectif_rendez_vous",
DROP COLUMN "objectifs_principaux",
DROP COLUMN "prerequis_formation",
DROP COLUMN "prise_en_charge_opco",
DROP COLUMN "programme_formation",
DROP COLUMN "reste_pour_entreprise",
DROP COLUMN "sexe",
DROP COLUMN "situation_handicap",
DROP COLUMN "status",
DROP COLUMN "synthese",
DROP COLUMN "taux_prise_en_charge",
DROP COLUMN "telephone",
DROP COLUMN "ville",
ADD COLUMN     "attentes" TEXT NOT NULL DEFAULT 'À renseigner',
ADD COLUMN     "besoin_handicap" TEXT,
ADD COLUMN     "commentaires" TEXT,
ADD COLUMN     "date_contact" TIMESTAMP(3),
ADD COLUMN     "date_debut_souhaitee" TIMESTAMP(3),
ADD COLUMN     "date_dispo" TEXT NOT NULL DEFAULT 'À déterminer',
ADD COLUMN     "date_fin_souhaitee" TIMESTAMP(3),
ADD COLUMN     "date_rdv" TIMESTAMP(3),
ADD COLUMN     "details_handicap" TEXT,
ADD COLUMN     "email_beneficiaire" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "has_handicap" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_financement" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "modalite_formation" TEXT,
ADD COLUMN     "niveau_beneficiaire" TEXT,
ADD COLUMN     "objectifs" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "pratique_actuelle" TEXT NOT NULL DEFAULT 'Aucune',
ADD COLUMN     "situation_actuelle" TEXT NOT NULL DEFAULT 'Non renseignée',
ADD COLUMN     "telephone_beneficiaire" TEXT,
ALTER COLUMN "statut" SET NOT NULL,
ALTER COLUMN "statut" SET DEFAULT 'nouveau';

-- CreateTable
CREATE TABLE "public"."programmes_formation" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "type_programme" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "est_actif" BOOLEAN NOT NULL DEFAULT true,
    "est_visible" BOOLEAN NOT NULL DEFAULT true,
    "categorie_id" TEXT,
    "programme_source_id" TEXT,
    "pictogramme" TEXT,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duree" TEXT NOT NULL,
    "prix" TEXT NOT NULL,
    "niveau" TEXT NOT NULL,
    "participants" TEXT NOT NULL,
    "objectifs" TEXT[],
    "objectifs_specifiques" TEXT,
    "prerequis" TEXT NOT NULL,
    "public_concerne" TEXT NOT NULL,
    "contenu_detaille_jours" TEXT NOT NULL,
    "evaluation_sur" TEXT,
    "horaires" TEXT NOT NULL DEFAULT '9h-12h30 et 14h-17h30',
    "modalites" TEXT NOT NULL,
    "modalites_acces" TEXT NOT NULL,
    "modalites_techniques" TEXT NOT NULL,
    "delai_acces" TEXT,
    "modalites_reglement" TEXT NOT NULL,
    "contact_organisme" TEXT NOT NULL DEFAULT 'GestionMax - aurelien@gestionmax.fr - 06.46.02.24.68',
    "referent_pedagogique" TEXT NOT NULL DEFAULT 'Aurélien Lien - aurelien@gestionmax.fr',
    "referent_qualite" TEXT NOT NULL DEFAULT 'Aurélien Lien - aurelien@gestionmax.fr',
    "formateur" TEXT NOT NULL,
    "ressources_disposition" TEXT NOT NULL,
    "modalites_evaluation" TEXT NOT NULL,
    "sanction_formation" TEXT NOT NULL,
    "niveau_certification" TEXT NOT NULL,
    "delai_acceptation" TEXT NOT NULL,
    "accessibilite_handicap" TEXT NOT NULL,
    "cessation_abandon" TEXT NOT NULL,
    "programme_url" TEXT,
    "ressources_associees" TEXT[],
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_modification" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "beneficiaire_id" TEXT,
    "formateur_id" TEXT,
    "positionnement_request_id" TEXT,

    CONSTRAINT "programmes_formation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories_programme" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_programme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "programmes_formation_positionnement_request_id_key" ON "public"."programmes_formation"("positionnement_request_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_programme_code_key" ON "public"."categories_programme"("code");

-- AddForeignKey
ALTER TABLE "public"."programmes_formation" ADD CONSTRAINT "programmes_formation_programme_source_id_fkey" FOREIGN KEY ("programme_source_id") REFERENCES "public"."programmes_formation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."programmes_formation" ADD CONSTRAINT "programmes_formation_positionnement_request_id_fkey" FOREIGN KEY ("positionnement_request_id") REFERENCES "public"."positionnement_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."programmes_formation" ADD CONSTRAINT "programmes_formation_categorie_id_fkey" FOREIGN KEY ("categorie_id") REFERENCES "public"."categories_programme"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dossiers_formation" ADD CONSTRAINT "dossiers_formation_programme_formation_id_fkey" FOREIGN KEY ("programme_formation_id") REFERENCES "public"."programmes_formation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
