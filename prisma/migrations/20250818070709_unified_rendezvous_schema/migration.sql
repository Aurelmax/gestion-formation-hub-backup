-- CreateTable
CREATE TABLE "public"."rendezvous" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "objectifs" TEXT,
    "competences_actuelles" TEXT,
    "niveau" TEXT,
    "format_souhaite" TEXT,
    "disponibilites" TEXT,
    "commentaires" TEXT,
    "date_rdv" TIMESTAMP(3),
    "duree_rdv" INTEGER,
    "format_rdv" TEXT,
    "lieu_rdv" TEXT,
    "lien_visio" TEXT,
    "notes" TEXT,
    "synthese" TEXT,
    "formation_titre" TEXT,
    "formation_selectionnee" TEXT,
    "situation_actuelle" TEXT,
    "attentes" TEXT,
    "pratique_actuelle" TEXT,
    "is_financement" BOOLEAN DEFAULT false,
    "type_financement" TEXT,
    "organisme_financeur" TEXT,
    "has_handicap" BOOLEAN DEFAULT false,
    "details_handicap" TEXT,
    "besoin_handicap" TEXT,
    "entreprise" TEXT,
    "siret" TEXT,
    "adresse_entreprise" TEXT,
    "interlocuteur_nom" TEXT,
    "interlocuteur_fonction" TEXT,
    "interlocuteur_email" TEXT,
    "interlocuteur_telephone" TEXT,
    "date_contact" TIMESTAMP(3),
    "date_debut_souhaitee" TIMESTAMP(3),
    "date_fin_souhaitee" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "formation_id" TEXT,
    "dossier_formation_id" TEXT,
    "programme_personnalise_id" TEXT,

    CONSTRAINT "rendezvous_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."rendezvous" ADD CONSTRAINT "rendezvous_dossier_formation_fkey" FOREIGN KEY ("dossier_formation_id") REFERENCES "public"."dossiers_formation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."rendezvous" ADD CONSTRAINT "rendezvous_programme_personnalise_fkey" FOREIGN KEY ("programme_personnalise_id") REFERENCES "public"."programmes_personnalises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."rendezvous" ADD CONSTRAINT "rendezvous_formation_fkey" FOREIGN KEY ("formation_id") REFERENCES "public"."programmes_formation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
