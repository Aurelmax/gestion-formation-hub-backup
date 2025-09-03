"use client";

import { useState } from "react";
import { useConfetti } from "@/hooks/useConfetti";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import PositionnementFormHeader from "./PositionnementFormHeader";
import BeneficiaireInfoSection from "./BeneficiaireInfoSection";
import CoordonneesSection from "./CoordonneesSection";
import ExperienceObjectifsSection from "./ExperienceObjectifsSection";
import { Label } from "@/components/ui/label";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Loader2 } from "lucide-react";

interface PositionnementFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  formationTitre?: string;
}

const PositionnementForm = ({ onSubmit, onCancel, formationTitre = "" }: PositionnementFormProps) => {
  const [formData, setFormData] = useState({
    // Formation sélectionnée
    formationSelectionnee: formationTitre,
    // Informations du bénéficiaire
    nomBeneficiaire: "",
    prenomBeneficiaire: "",
    dateNaissance: "",
    sexe: "",
    situationHandicap: "",
    // Date et heure du rendez-vous
    dateRdv: undefined as Date | undefined,
    // Coordonnées
    email: "",
    telephone: "",
    // Adresse
    adresse: "",
    codePostal: "",
    ville: "",
    // Statut
    statut: "",
    // Expérience
    experienceWordPress: "",
    // Objectifs
    objectifsPrincipaux: "",
    // Niveau de maîtrise
    niveauMaitrise: "débutant",
    // Programme de formation
    programmeFormation: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { fireConfetti } = useConfetti();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nomBeneficiaire.trim()) {
      newErrors.nomBeneficiaire = "Le nom est requis";
    }
    
    if (!formData.prenomBeneficiaire.trim()) {
      newErrors.prenomBeneficiaire = "Le prénom est requis";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }
    
    if (!formData.telephone.trim()) {
      newErrors.telephone = "Le téléphone est requis";
    } else if (!/^[0-9\s\-.]{10,20}$/.test(formData.telephone)) {
      newErrors.telephone = "Le numéro de téléphone n'est pas valide";
    }
    
    if (!formData.dateRdv) {
      newErrors.dateRdv = "Veuillez sélectionner une date de rendez-vous";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post('/api/rendezvous', {
        // Champs obligatoires pour la création d'un rendez-vous
        nom: formData.nomBeneficiaire,
        prenom: formData.prenomBeneficiaire,
        email: formData.email,
        telephone: formData.telephone,
        // Informations sur la formation
        formationSelectionnee: formData.formationSelectionnee,
        formationTitre: formData.formationSelectionnee,
        // Informations personnelles
        dateNaissance: formData.dateNaissance || null,
        sexe: formData.sexe,
        // Situation de handicap
        hasHandicap: !!formData.situationHandicap,
        detailsHandicap: formData.situationHandicap || null,
        // Adresse
        adresse: formData.adresse,
        codePostal: formData.codePostal,
        ville: formData.ville,
        // Statut professionnel
        statut: formData.statut,
        // Expérience et objectifs
        experience: formData.experienceWordPress,
        objectifs: formData.objectifsPrincipaux,
        niveau: formData.niveauMaitrise,
        // Date et statut du rendez-vous
        dateRdv: formData.dateRdv,
        status: 'nouveau',
        type: 'positionnement',
        source: 'site-internet'
      });

      console.log('Demande créée avec succès, ID:', response.data.id);

      toast({
        title: "Demande envoyée",
        description: "Votre demande de rendez-vous de positionnement a été enregistrée. Nous vous recontacterons rapidement pour confirmer la date et l'heure.",
        className: "bg-green-500 text-white"
      });
      
      fireConfetti();
      
      // Appeler la fonction de soumission du parent
      onSubmit(formData);
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi:', error);
      
      let errorMessage = "Une erreur est survenue lors de l'envoi de votre demande.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        className: "bg-red-500 text-white"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | boolean | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Effacer l'erreur du champ quand il est modifié
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <Card className="border-0 shadow-lg">
        <PositionnementFormHeader formationTitre={formationTitre} />
        <CardContent className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Information importante :</span> Ce formulaire nous aide à mieux cerner vos attentes et votre niveau actuel. 
                Un conseiller vous contactera dans les 24-48h pour finaliser votre inscription et convenir d'un créneau pour votre entretien de positionnement.
              </p>
            </div>

            <BeneficiaireInfoSection 
              formData={formData} 
              handleChange={handleChange} 
              errors={errors}
            />
            
            <CoordonneesSection 
              formData={formData} 
              handleChange={handleChange} 
              errors={errors}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Date du rendez-vous</h3>
              <div className="space-y-2">
                <Label>Date et heure du positionnement *</Label>
                <div className="w-full">
                  <DateTimePicker
                    date={formData.dateRdv}
                    setDate={(date) => handleChange("dateRdv", date)}
                  />
                </div>
                {errors.dateRdv && (
                  <p className="text-sm text-red-600">{errors.dateRdv}</p>
                )}
                <p className="text-sm text-gray-500">
                  Cette date est indicative. Notre équipe vous contactera pour confirmer le créneau.
                </p>
              </div>
            </div>

            <ExperienceObjectifsSection 
              formData={formData} 
              handleChange={handleChange} 
            />

            <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  "Envoyer ma demande"
                )}
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 text-center">
              En soumettant ce formulaire, vous acceptez que vos informations soient utilisées pour traiter votre demande 
              conformément à notre <a href="/politique-confidentialite" className="text-blue-600 hover:underline">politique de confidentialité</a>.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PositionnementForm;
