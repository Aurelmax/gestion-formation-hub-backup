/*
  Warnings:

  - You are about to drop the column `cessationAbandon` on the `formations` table. All the data in the column will be lost.
  - You are about to drop the column `delai_acces` on the `formations` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `formations` table. All the data in the column will be lost.
  - You are about to drop the column `modalitesEvaluation` on the `formations` table. All the data in the column will be lost.
  - You are about to drop the column `modalitesReglement` on the `formations` table. All the data in the column will be lost.
  - You are about to drop the column `modalites_techniques` on the `formations` table. All the data in the column will be lost.
  - You are about to drop the column `objectifs` on the `formations` table. All the data in the column will be lost.
  - You are about to drop the column `pdfUrl` on the `formations` table. All the data in the column will be lost.
  - You are about to drop the column `programme` on the `formations` table. All the data in the column will be lost.
  - You are about to drop the column `public` on the `formations` table. All the data in the column will be lost.
  - You are about to drop the column `publicConcerne` on the `formations` table. All the data in the column will be lost.
  - You are about to drop the column `sanctionFormation` on the `formations` table. All the data in the column will be lost.
  - You are about to drop the column `titre` on the `formations` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `formations` table. All the data in the column will be lost.
  - Made the column `code` on table `formations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `libelle` on table `formations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cessation_abandon` on table `formations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contact_organisme` on table `formations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modalites_evaluation` on table `formations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modalites_reglement` on table `formations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `public_concerne` on table `formations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sanction_formation` on table `formations` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "formations" DROP COLUMN "cessationAbandon",
DROP COLUMN "delai_acces",
DROP COLUMN "description",
DROP COLUMN "modalitesEvaluation",
DROP COLUMN "modalitesReglement",
DROP COLUMN "modalites_techniques",
DROP COLUMN "objectifs",
DROP COLUMN "pdfUrl",
DROP COLUMN "programme",
DROP COLUMN "public",
DROP COLUMN "publicConcerne",
DROP COLUMN "sanctionFormation",
DROP COLUMN "titre",
DROP COLUMN "version",
ADD COLUMN     "modalitesTechniques" TEXT NOT NULL DEFAULT 'Formation en présentiel individuel',
ALTER COLUMN "code" SET NOT NULL,
ALTER COLUMN "libelle" SET NOT NULL,
ALTER COLUMN "cessation_abandon" SET NOT NULL,
ALTER COLUMN "contact_organisme" SET NOT NULL,
ALTER COLUMN "modalites_evaluation" SET NOT NULL,
ALTER COLUMN "modalites_reglement" SET NOT NULL,
ALTER COLUMN "public_concerne" SET NOT NULL,
ALTER COLUMN "sanction_formation" SET NOT NULL;
