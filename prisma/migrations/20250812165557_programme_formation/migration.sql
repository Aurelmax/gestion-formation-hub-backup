-- AlterTable
ALTER TABLE "public"."positionnement_requests" ALTER COLUMN "attentes" DROP DEFAULT,
ALTER COLUMN "date_dispo" DROP DEFAULT,
ALTER COLUMN "email_beneficiaire" DROP DEFAULT,
ALTER COLUMN "objectifs" DROP DEFAULT,
ALTER COLUMN "pratique_actuelle" DROP DEFAULT,
ALTER COLUMN "situation_actuelle" DROP DEFAULT;
