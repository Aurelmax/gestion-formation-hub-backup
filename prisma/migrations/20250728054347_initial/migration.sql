-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "nom" TEXT,
    "prenom" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formations" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "objectifs" TEXT NOT NULL,
    "programme" TEXT NOT NULL,
    "duree" TEXT NOT NULL,
    "public" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "prerequis" TEXT NOT NULL,
    "publicConcerne" TEXT NOT NULL,
    "dureeHoraires" TEXT NOT NULL,
    "modalitesAcces" TEXT NOT NULL,
    "tarif" TEXT NOT NULL,
    "modalitesReglement" TEXT NOT NULL,
    "accessibiliteHandicapee" TEXT NOT NULL,
    "modalitesEvaluation" TEXT NOT NULL,
    "sanctionFormation" TEXT NOT NULL,
    "cessationAbandon" TEXT NOT NULL,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_modification" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "formations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apprenants" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "apprenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competences" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "domaine_developpement" TEXT NOT NULL,
    "niveau_actuel" INTEGER NOT NULL,
    "objectif_niveau" INTEGER NOT NULL,
    "statut" TEXT NOT NULL,
    "action_prevue" TEXT NOT NULL,
    "plateforme_formation" TEXT,
    "lien_formation" TEXT,
    "type_preuve" TEXT NOT NULL,
    "contenu_preuve" TEXT NOT NULL,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_modification" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "formateur_id" TEXT,

    CONSTRAINT "competences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "positionnement_requests" (
    "id" TEXT NOT NULL,
    "formation_selectionnee" TEXT,
    "nom_beneficiaire" TEXT NOT NULL,
    "prenom_beneficiaire" TEXT NOT NULL,
    "date_naissance" TIMESTAMP(3),
    "sexe" TEXT,
    "situation_handicap" TEXT,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "adresse" TEXT,
    "code_postal" TEXT,
    "ville" TEXT,
    "statut" TEXT,
    "experience_wordpress" TEXT,
    "objectifs_principaux" TEXT,
    "niveau_maitrise" TEXT NOT NULL DEFAULT 'non',
    "programme_formation" TEXT,
    "attestation_besoin" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'en_attente',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "positionnement_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reclamations" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "sujet" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'nouvelle',
    "priorite" TEXT NOT NULL DEFAULT 'normale',
    "assignee_id" TEXT,
    "notes_internes" TEXT,
    "date_resolution" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reclamations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actions_correctives" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'planifiee',
    "origine_type" TEXT NOT NULL,
    "origine_ref" TEXT,
    "origine_date" TIMESTAMP(3),
    "origine_resume" TEXT,
    "priorite" TEXT NOT NULL DEFAULT 'moyenne',
    "avancement" INTEGER NOT NULL DEFAULT 0,
    "responsable_nom" TEXT,
    "responsable_email" TEXT,
    "date_echeance" TIMESTAMP(3),
    "indicateur_efficacite" TEXT,
    "reclamation_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "actions_correctives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historique_actions_correctives" (
    "id" TEXT NOT NULL,
    "action_corrective_id" TEXT NOT NULL,
    "date_action" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" TEXT NOT NULL,
    "utilisateur" TEXT NOT NULL,
    "commentaire" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historique_actions_correctives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plans_accessibilite" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_modification" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actions_requises" TEXT[],
    "statut" TEXT NOT NULL DEFAULT 'actif',

    CONSTRAINT "plans_accessibilite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demandes_accessibilite" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "description" TEXT NOT NULL,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" TEXT NOT NULL DEFAULT 'nouvelle',
    "reponse" TEXT,
    "date_resolution" TIMESTAMP(3),

    CONSTRAINT "demandes_accessibilite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dossiers_formation" (
    "id" TEXT NOT NULL,
    "formation_id" TEXT NOT NULL,
    "apprenant_id" TEXT NOT NULL,
    "positionnement_id" TEXT,
    "statut_dossier" TEXT NOT NULL DEFAULT 'en_attente',
    "date_inscription" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_debut" TIMESTAMP(3),
    "date_fin" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dossiers_formation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents_formation" (
    "id" TEXT NOT NULL,
    "dossier_formation_id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_formation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programmes_personnalises" (
    "id" TEXT NOT NULL,
    "formation_id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "duree" TEXT NOT NULL,
    "objectifs_specifiques" TEXT NOT NULL,
    "evaluation_sur" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "programmes_personnalises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "veilles" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'nouvelle',
    "avancement" INTEGER NOT NULL DEFAULT 0,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_echeance" TIMESTAMP(3),

    CONSTRAINT "veilles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conformite_qualiopi" (
    "id" TEXT NOT NULL,
    "indicateur" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "statut_conformite" TEXT NOT NULL,
    "date_verification" TIMESTAMP(3) NOT NULL,
    "prochaine_echeance" TIMESTAMP(3) NOT NULL,
    "element_preuve" TEXT,
    "commentaire" TEXT,

    CONSTRAINT "conformite_qualiopi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "dossiers_formation_positionnement_id_key" ON "dossiers_formation"("positionnement_id");

-- AddForeignKey
ALTER TABLE "reclamations" ADD CONSTRAINT "reclamations_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actions_correctives" ADD CONSTRAINT "actions_correctives_reclamation_id_fkey" FOREIGN KEY ("reclamation_id") REFERENCES "reclamations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historique_actions_correctives" ADD CONSTRAINT "historique_actions_correctives_action_corrective_id_fkey" FOREIGN KEY ("action_corrective_id") REFERENCES "actions_correctives"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dossiers_formation" ADD CONSTRAINT "dossiers_formation_formation_id_fkey" FOREIGN KEY ("formation_id") REFERENCES "formations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dossiers_formation" ADD CONSTRAINT "dossiers_formation_apprenant_id_fkey" FOREIGN KEY ("apprenant_id") REFERENCES "apprenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dossiers_formation" ADD CONSTRAINT "dossiers_formation_positionnement_id_fkey" FOREIGN KEY ("positionnement_id") REFERENCES "positionnement_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents_formation" ADD CONSTRAINT "documents_formation_dossier_formation_id_fkey" FOREIGN KEY ("dossier_formation_id") REFERENCES "dossiers_formation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programmes_personnalises" ADD CONSTRAINT "programmes_personnalises_formation_id_fkey" FOREIGN KEY ("formation_id") REFERENCES "formations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
