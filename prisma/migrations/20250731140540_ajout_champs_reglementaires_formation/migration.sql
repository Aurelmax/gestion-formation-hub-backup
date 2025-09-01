/*
  Warnings:

  - You are about to drop the column `accessibiliteHandicapee` on the `formations` table. All the data in the column will be lost.
  - You are about to drop the column `dureeHoraires` on the `formations` table. All the data in the column will be lost.
  - You are about to drop the column `modalitesAcces` on the `formations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "formations" DROP COLUMN "accessibiliteHandicapee",
DROP COLUMN "dureeHoraires",
DROP COLUMN "modalitesAcces",
ADD COLUMN     "accessibilite_handicapee" TEXT NOT NULL DEFAULT 'Formation accessible aux personnes en situation de handicap. Contactez notre référent handicap pour adapter le parcours.',
ADD COLUMN     "delai_acceptation" TEXT NOT NULL DEFAULT '7 jours ouvrables',
ADD COLUMN     "delai_acces" TEXT NOT NULL DEFAULT '15 jours après signature de la convention',
ADD COLUMN     "formateur" TEXT NOT NULL DEFAULT 'Formateur spécialisé WordPress avec 5+ ans d''expérience',
ADD COLUMN     "horaires" TEXT NOT NULL DEFAULT '9h-12h30 et 14h-17h30, adaptables selon les besoins du bénéficiaire',
ADD COLUMN     "modalites_acces" TEXT NOT NULL DEFAULT 'Formation accessible à distance ou en présentiel selon le contexte',
ADD COLUMN     "modalites_techniques" TEXT NOT NULL DEFAULT 'Formation synchrone à distance via visioconférence et partage d''écran',
ADD COLUMN     "niveau_certification" TEXT NOT NULL DEFAULT 'Formation non certifiante',
ADD COLUMN     "objectifs_pedagogiques" TEXT NOT NULL DEFAULT 'Acquérir les compétences nécessaires pour créer et gérer un site WordPress',
ADD COLUMN     "referent_pedagogique" TEXT NOT NULL DEFAULT 'Jean Dupont - jean.dupont@gestionmax.fr',
ADD COLUMN     "referent_qualite" TEXT NOT NULL DEFAULT 'Marie Martin - marie.martin@gestionmax.fr',
ADD COLUMN     "ressources_disposition" TEXT NOT NULL DEFAULT 'Support de cours, tutoriels vidéo, accès à une plateforme d''exercices';
