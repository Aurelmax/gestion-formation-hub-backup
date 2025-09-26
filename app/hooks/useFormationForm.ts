import { useState, useEffect } from "react";
import { ProgrammeFormation } from "@/types/programmes";

interface UseFormationFormProps {
  programme?: Partial<ProgrammeFormation>;
  onSubmit: (data: Partial<ProgrammeFormation>) => void;
}

export const useFormationForm = ({ programme, onSubmit }: UseFormationFormProps) => {
  // État du formulaire avec le modèle unifié
  const [formData, setFormData] = useState<Partial<ProgrammeFormation>>({
    // Champs d'identification
    code: programme?.code || "",
    type: programme?.type || "catalogue",
    titre: programme?.titre || "",
    description: programme?.description || "",

    // Champs descriptifs
    niveau: programme?.niveau || "Débutant",
    participants: programme?.participants || "1 à 5",
    duree: programme?.duree || "21h (3 jours)",
    prix: programme?.prix || "1500€",
    objectifs: programme?.objectifs || [""],
    prerequis: programme?.prerequis || "Aucun prérequis spécifique",
    modalites: programme?.modalites || "A distance ou en présentiel",

    // Champs réglementaires
    publicConcerne: programme?.publicConcerne || "Tout public désirant se former à WordPress",
    contenuDetailleJours: programme?.contenuDetailleJours || "",
    modalitesAcces: programme?.modalitesAcces || "Formation accessible à distance ou en présentiel selon le contexte",
    modalitesTechniques: programme?.modalitesTechniques || "Formation synchrone à distance via visioconférence et partage d'écran",
    modalitesReglement: programme?.modalitesReglement || "Règlement à 30 jours, sans escompte",
    formateur: programme?.formateur || "Formateur spécialisé WordPress avec 5+ ans d'expérience",
    ressourcesDisposition: programme?.ressourcesDisposition || "Support de cours, tutoriels vidéo, accès à une plateforme d'exercices",
    modalitesEvaluation: programme?.modalitesEvaluation || "QCM et exercices pratiques",
    sanctionFormation: programme?.sanctionFormation || "Attestation de formation",
    niveauCertification: programme?.niveauCertification || "Formation non certifiante",
    delaiAcceptation: programme?.delaiAcceptation || "7 jours ouvrables",
    accessibiliteHandicap: programme?.accessibiliteHandicap || "Formation accessible aux personnes en situation de handicap. Contactez notre référent handicap pour adapter le parcours.",
    cessationAbandon: programme?.cessationAbandon || "En cas d'abandon, la facturation sera établie au prorata des heures réalisées.",

    // Champs spécifiques aux programmes personnalise
    beneficiaireId: programme?.beneficiaireId || null,
    objectifsSpecifiques: programme?.objectifsSpecifiques || null,
    positionnementRequestId: programme?.positionnementRequestId || null,

    // URL vers le programme HTML
    programmeUrl: programme?.programmeUrl || null,

    // Catégorie
    categorieId: programme?.categorieId || null,

    // Style
    pictogramme: programme?.pictogramme || "📚",
  });

  // Pour gérer les objectifs comme un tableau
  const [objectifsArray, setObjectifsArray] = useState<string[]>(
    Array.isArray(programme?.objectifs) ? programme.objectifs : [""]
  );

  useEffect(() => {
    setFormData(prev => ({ ...prev, objectifs: objectifsArray.filter(obj => obj.trim() !== "") }));
  }, [objectifsArray]);

  // Pour ajouter un nouvel objectif
  const addObjectif = () => {
    setObjectifsArray([...objectifsArray, ""]);
  };

  // Pour supprimer un objectif
  const removeObjectif = (index: number) => {
    setObjectifsArray(objectifsArray.filter((_, i) => i !== index));
  };

  // Pour mettre à jour un objectif spécifique
  const updateObjectif = (index: number, value: string) => {
    const newObjectifs = [...objectifsArray];
    newObjectifs[index] = value;
    setObjectifsArray(newObjectifs);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    objectifsArray,
    handleSubmit,
    handleChange,
    addObjectif,
    removeObjectif,
    updateObjectif
  };
};