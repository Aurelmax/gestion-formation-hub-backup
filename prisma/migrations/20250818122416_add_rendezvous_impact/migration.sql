-- AlterTable
ALTER TABLE "public"."rendezvous" ADD COLUMN     "ameliorations_suggerees" TEXT,
ADD COLUMN     "commentaires_impact" TEXT,
ADD COLUMN     "competences_appliquees" TEXT,
ADD COLUMN     "date_impact" TIMESTAMP(3),
ADD COLUMN     "rendezvous_parent_id" TEXT,
ADD COLUMN     "satisfaction_impact" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."rendezvous" ADD CONSTRAINT "rendezvous_rendezvous_parent_id_fkey" FOREIGN KEY ("rendezvous_parent_id") REFERENCES "public"."rendezvous"("id") ON DELETE SET NULL ON UPDATE CASCADE;
