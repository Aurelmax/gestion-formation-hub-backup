/*
  Warnings:

  - A unique constraint covering the columns `[positionnement_request_id]` on the table `programmes_personnalises` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "programmes_personnalises" ADD COLUMN     "positionnement_request_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "programmes_personnalises_positionnement_request_id_key" ON "programmes_personnalises"("positionnement_request_id");

-- AddForeignKey
ALTER TABLE "programmes_personnalises" ADD CONSTRAINT "programmes_personnalises_positionnement_request_id_fkey" FOREIGN KEY ("positionnement_request_id") REFERENCES "positionnement_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
