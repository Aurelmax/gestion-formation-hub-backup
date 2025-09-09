import { 
  Rendezvous, 
  RendezvousFormData, 
  ImpactEvaluationData 
} from '@/hooks/useRendezvous';

// Fonctions de validation pour les rendez-vous
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateRendezvousFormData = (data: RendezvousFormData): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  // Validation des champs obligatoires
  if (!data.nomBeneficiaire?.trim()) {
    errors.push('Le nom du bénéficiaire est obligatoire');
  }

  if (!data.prenomBeneficiaire?.trim()) {
    errors.push('Le prénom du bénéficiaire est obligatoire');
  }

  if (!data.emailBeneficiaire?.trim()) {
    errors.push('L\'email du bénéficiaire est obligatoire');
  } else if (!validateEmail(data.emailBeneficiaire)) {
    errors.push('L\'email du bénéficiaire n\'est pas valide');
  }

  // Validation du téléphone (optionnel mais doit être valide si fourni)
  if (data.telephoneBeneficiaire && !validatePhone(data.telephoneBeneficiaire)) {
    errors.push('Le numéro de téléphone n\'est pas valide');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateImpactEvaluation = (data: ImpactEvaluationData): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  // Validation de la satisfaction (obligatoire, entre 1 et 10)
  if (data.satisfactionImpact === undefined || data.satisfactionImpact === null) {
    errors.push('La satisfaction est obligatoire');
  } else if (data.satisfactionImpact < 1 || data.satisfactionImpact > 10) {
    errors.push('La satisfaction doit être comprise entre 1 et 10');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const formatRendezvousForDisplay = (rdv: Rendezvous): {
  fullName: string;
  formattedDate: string;
  statusLabel: string;
  canalLabel: string;
} => {
  const fullName = `${rdv.prenomBeneficiaire || ''} ${rdv.nomBeneficiaire || ''}`.trim();
  
  const formattedDate = rdv.dateRdv 
    ? new Date(rdv.dateRdv).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '';

  const statusLabels: Record<string, string> = {
    'nouveau': 'Nouveau',
    'rdv_planifie': 'RDV Planifié',
    'termine': 'Terminé',
    'annule': 'Annulé',
    'impact': 'Impact'
  };

  const canalLabels: Record<string, string> = {
    'visio': 'Visio',
    'presentiel': 'Présentiel',
    'telephone': 'Téléphone'
  };

  return {
    fullName,
    formattedDate,
    statusLabel: statusLabels[rdv.statut] || rdv.statut,
    canalLabel: canalLabels[rdv.canal || ''] || rdv.canal || 'Non spécifié'
  };
};

export const mapApiDataToRendezvous = (apiData: any): Rendezvous => {
  return {
    id: apiData.id,
    statut: apiData.status || apiData.statut,
    type: apiData.type,
    
    // Informations personnelles avec mapping des noms de champs
    nomBeneficiaire: apiData.nom || apiData.nomBeneficiaire,
    prenomBeneficiaire: apiData.prenom || apiData.prenomBeneficiaire,
    emailBeneficiaire: apiData.email || apiData.emailBeneficiaire,
    telephoneBeneficiaire: apiData.telephone || apiData.telephoneBeneficiaire,
    
    // Informations pédagogiques
    objectifs: apiData.objectifs ? (Array.isArray(apiData.objectifs) ? apiData.objectifs : [apiData.objectifs]) : undefined,
    niveauBeneficiaire: apiData.niveau || apiData.niveauBeneficiaire,
    situationActuelle: apiData.situationActuelle,
    attentes: apiData.attentes,
    pratiqueActuelle: apiData.pratiqueActuelle,
    
    // Informations de rendez-vous
    canal: apiData.formatRdv || apiData.canal,
    dateRdv: apiData.dateRdv,
    synthese: apiData.synthese,
    
    // Informations de formation
    formationSelectionnee: apiData.formationTitre || apiData.formationSelectionnee,
    
    // Disponibilités
    dateDispo: apiData.disponibilites || apiData.dateDispo,
    modaliteFormation: apiData.formatSouhaite || apiData.modaliteFormation,
    
    // Financement
    isFinancement: apiData.isFinancement,
    typeFinancement: apiData.typeFinancement,
    
    // Handicap
    hasHandicap: apiData.hasHandicap,
    detailsHandicap: apiData.detailsHandicap,
    besoinHandicap: apiData.besoinHandicap,
    
    // Entreprise
    entreprise: apiData.entreprise,
    siret: apiData.siret,
    adresseEntreprise: apiData.adresseEntreprise,
    interlocuteurNom: apiData.interlocuteurNom,
    interlocuteurFonction: apiData.interlocuteurFonction,
    interlocuteurEmail: apiData.interlocuteurEmail,
    interlocuteurTelephone: apiData.interlocuteurTelephone,
    organismeFinanceur: apiData.organismeFinanceur,
    
    // Commentaires
    commentaires: apiData.commentaires,
    
    // Informations d'impact
    dateImpact: apiData.dateImpact,
    satisfactionImpact: apiData.satisfactionImpact,
    competencesAppliquees: apiData.competencesAppliquees,
    ameliorationsSuggeres: apiData.ameliorationsSuggeres,
    commentairesImpact: apiData.commentairesImpact,
    rendezvousParentId: apiData.rendezvousParentId,
    
    // Compétences
    competencesActuelles: apiData.competencesActuelles,
    competencesRecherchees: apiData.competencesRecherchees,
    
    // Métadonnées
    dateContact: apiData.dateContact,
    dateDebutSouhaitee: apiData.dateDebutSouhaitee,
    dateFinSouhaitee: apiData.dateFinSouhaitee,
    createdAt: apiData.createdAt,
    updatedAt: apiData.updatedAt
  };
};

export const prepareRendezvousForApi = (formData: RendezvousFormData): any => {
  return {
    type: formData.type || 'positionnement',
    prenom: formData.prenomBeneficiaire,
    nom: formData.nomBeneficiaire,
    email: formData.emailBeneficiaire,
    telephone: formData.telephoneBeneficiaire,
    objectifs: Array.isArray(formData.objectifs) ? formData.objectifs.join(', ') : formData.objectifs,
    formationSelectionnee: formData.formationSelectionnee,
    commentaires: formData.commentaires,
    niveau: formData.niveauBeneficiaire,
    situationActuelle: formData.situationActuelle,
    attentes: formData.attentes,
    dateRdv: formData.dateRdv,
    canal: formData.canal,
    synthese: formData.synthese,
    dateDispo: formData.dateDispo,
    modaliteFormation: formData.modaliteFormation,
    entreprise: formData.entreprise,
    siret: formData.siret,
    adresseEntreprise: formData.adresseEntreprise,
    interlocuteurNom: formData.interlocuteurNom,
    interlocuteurFonction: formData.interlocuteurFonction,
    interlocuteurEmail: formData.interlocuteurEmail,
    interlocuteurTelephone: formData.interlocuteurTelephone,
    hasHandicap: formData.hasHandicap,
    detailsHandicap: formData.detailsHandicap,
    besoinHandicap: formData.besoinHandicap,
    isFinancement: formData.isFinancement,
    typeFinancement: formData.typeFinancement,
    organismeFinanceur: formData.organismeFinanceur
  };
};

// Tests pour les fonctions de validation et de transformation
describe('Rendez-vous Validation and Data Transformations', () => {
  describe('Email Validation', () => {
    it('should validate correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name+tag@domain.co.uk',
        'first.last@subdomain.example.com',
        'user123@example-site.org'
      ];

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    it('should reject incorrect email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user..double.dot@domain.com',
        'user@domain',
        'user name@domain.com'
      ];

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });

    it('should handle edge cases', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('   ')).toBe(false);
      expect(validateEmail('a@b.c')).toBe(true); // Minimum valid email
    });
  });

  describe('Phone Validation', () => {
    it('should validate correct French phone number formats', () => {
      const validPhones = [
        '0123456789',
        '01 23 45 67 89',
        '01.23.45.67.89',
        '01-23-45-67-89',
        '+33123456789',
        '0033123456789',
        '+33 1 23 45 67 89'
      ];

      validPhones.forEach(phone => {
        expect(validatePhone(phone)).toBe(true);
      });
    });

    it('should reject incorrect phone number formats', () => {
      const invalidPhones = [
        '123456789', // Trop court
        '01234567890', // Trop long
        '0023456789', // Ne commence pas par un bon chiffre
        'abcdefghij', // Lettres
        '01 23 45 67', // Trop court
        '+331234567890' // Trop long avec indicatif
      ];

      invalidPhones.forEach(phone => {
        expect(validatePhone(phone)).toBe(false);
      });
    });

    it('should handle edge cases for phone validation', () => {
      expect(validatePhone('')).toBe(false);
      expect(validatePhone('   ')).toBe(false);
    });
  });

  describe('Rendez-vous Form Data Validation', () => {
    const validFormData: RendezvousFormData = {
      nomBeneficiaire: 'Dupont',
      prenomBeneficiaire: 'Jean',
      emailBeneficiaire: 'jean.dupont@email.com',
      telephoneBeneficiaire: '0123456789',
      formationSelectionnee: 'Formation React',
      type: 'positionnement'
    };

    it('should validate complete valid form data', () => {
      const result = validateRendezvousFormData(validFormData);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing required fields', () => {
      const incompleteData: RendezvousFormData = {
        nomBeneficiaire: '',
        prenomBeneficiaire: '',
        emailBeneficiaire: ''
      };

      const result = validateRendezvousFormData(incompleteData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Le nom du bénéficiaire est obligatoire');
      expect(result.errors).toContain('Le prénom du bénéficiaire est obligatoire');
      expect(result.errors).toContain('L\'email du bénéficiaire est obligatoire');
    });

    it('should validate email format in form data', () => {
      const dataWithInvalidEmail: RendezvousFormData = {
        ...validFormData,
        emailBeneficiaire: 'invalid-email-format'
      };

      const result = validateRendezvousFormData(dataWithInvalidEmail);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('L\'email du bénéficiaire n\'est pas valide');
    });

    it('should validate optional phone number format', () => {
      const dataWithInvalidPhone: RendezvousFormData = {
        ...validFormData,
        telephoneBeneficiaire: 'invalid-phone'
      };

      const result = validateRendezvousFormData(dataWithInvalidPhone);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Le numéro de téléphone n\'est pas valide');
    });

    it('should allow empty optional phone number', () => {
      const dataWithoutPhone: RendezvousFormData = {
        ...validFormData,
        telephoneBeneficiaire: ''
      };

      const result = validateRendezvousFormData(dataWithoutPhone);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle whitespace-only values', () => {
      const dataWithWhitespace: RendezvousFormData = {
        nomBeneficiaire: '   ',
        prenomBeneficiaire: '   ',
        emailBeneficiaire: '   '
      };

      const result = validateRendezvousFormData(dataWithWhitespace);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Impact Evaluation Validation', () => {
    it('should validate complete valid impact evaluation', () => {
      const validEvaluation: ImpactEvaluationData = {
        satisfactionImpact: 8,
        competencesAppliquees: 'Excellentes compétences appliquées',
        ameliorationsSuggeres: 'Continuer la formation continue',
        commentairesImpact: 'Très satisfaisant'
      };

      const result = validateImpactEvaluation(validEvaluation);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should require satisfaction rating', () => {
      const evaluationWithoutSatisfaction: ImpactEvaluationData = {
        satisfactionImpact: undefined as any,
        competencesAppliquees: 'Bonnes compétences'
      };

      const result = validateImpactEvaluation(evaluationWithoutSatisfaction);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('La satisfaction est obligatoire');
    });

    it('should validate satisfaction rating range', () => {
      const evaluationBelowRange: ImpactEvaluationData = {
        satisfactionImpact: 0
      };

      const evaluationAboveRange: ImpactEvaluationData = {
        satisfactionImpact: 11
      };

      const resultBelow = validateImpactEvaluation(evaluationBelowRange);
      const resultAbove = validateImpactEvaluation(evaluationAboveRange);
      
      expect(resultBelow.isValid).toBe(false);
      expect(resultBelow.errors).toContain('La satisfaction doit être comprise entre 1 et 10');
      
      expect(resultAbove.isValid).toBe(false);
      expect(resultAbove.errors).toContain('La satisfaction doit être comprise entre 1 et 10');
    });

    it('should accept boundary values for satisfaction', () => {
      const evaluationMin: ImpactEvaluationData = {
        satisfactionImpact: 1
      };

      const evaluationMax: ImpactEvaluationData = {
        satisfactionImpact: 10
      };

      const resultMin = validateImpactEvaluation(evaluationMin);
      const resultMax = validateImpactEvaluation(evaluationMax);
      
      expect(resultMin.isValid).toBe(true);
      expect(resultMax.isValid).toBe(true);
    });
  });

  describe('Display Formatting', () => {
    const mockRendezvous: Rendezvous = {
      id: 'rdv-001',
      statut: 'rdv_planifie',
      nomBeneficiaire: 'Dupont',
      prenomBeneficiaire: 'Jean',
      emailBeneficiaire: 'jean@email.com',
      canal: 'visio',
      dateRdv: new Date('2024-12-15T10:30:00')
    };

    it('should format rendez-vous for display correctly', () => {
      const formatted = formatRendezvousForDisplay(mockRendezvous);
      
      expect(formatted.fullName).toBe('Jean Dupont');
      expect(formatted.statusLabel).toBe('RDV Planifié');
      expect(formatted.canalLabel).toBe('Visio');
      expect(formatted.formattedDate).toMatch(/15\/12\/2024.*10:30/);
    });

    it('should handle missing names gracefully', () => {
      const rdvWithMissingNames: Rendezvous = {
        ...mockRendezvous,
        nomBeneficiaire: '',
        prenomBeneficiaire: ''
      };

      const formatted = formatRendezvousForDisplay(rdvWithMissingNames);
      
      expect(formatted.fullName).toBe('');
    });

    it('should handle unknown status and canal', () => {
      const rdvWithUnknownValues: Rendezvous = {
        ...mockRendezvous,
        statut: 'unknown_status',
        canal: 'unknown_canal'
      };

      const formatted = formatRendezvousForDisplay(rdvWithUnknownValues);
      
      expect(formatted.statusLabel).toBe('unknown_status');
      expect(formatted.canalLabel).toBe('unknown_canal');
    });

    it('should handle missing date', () => {
      const rdvWithoutDate: Rendezvous = {
        ...mockRendezvous,
        dateRdv: undefined
      };

      const formatted = formatRendezvousForDisplay(rdvWithoutDate);
      
      expect(formatted.formattedDate).toBe('');
    });

    it('should handle missing canal', () => {
      const rdvWithoutCanal: Rendezvous = {
        ...mockRendezvous,
        canal: undefined
      };

      const formatted = formatRendezvousForDisplay(rdvWithoutCanal);
      
      expect(formatted.canalLabel).toBe('Non spécifié');
    });
  });

  describe('API Data Mapping', () => {
    it('should map API data to Rendezvous interface correctly', () => {
      const apiData = {
        id: 'rdv-001',
        status: 'rdv_planifie', // API uses 'status'
        nom: 'Dupont', // API uses 'nom'
        prenom: 'Jean', // API uses 'prenom'
        email: 'jean@email.com', // API uses 'email'
        telephone: '0123456789', // API uses 'telephone'
        formatRdv: 'visio', // API uses 'formatRdv'
        formationTitre: 'Formation React', // API uses 'formationTitre'
        niveau: 'intermédiaire', // API uses 'niveau'
        disponibilites: '2024-12-20', // API uses 'disponibilites'
        formatSouhaite: 'présentiel', // API uses 'formatSouhaite'
        objectifs: 'Améliorer compétences, Obtenir certification'
      };

      const mapped = mapApiDataToRendezvous(apiData);
      
      expect(mapped.id).toBe('rdv-001');
      expect(mapped.statut).toBe('rdv_planifie');
      expect(mapped.nomBeneficiaire).toBe('Dupont');
      expect(mapped.prenomBeneficiaire).toBe('Jean');
      expect(mapped.emailBeneficiaire).toBe('jean@email.com');
      expect(mapped.telephoneBeneficiaire).toBe('0123456789');
      expect(mapped.canal).toBe('visio');
      expect(mapped.formationSelectionnee).toBe('Formation React');
      expect(mapped.niveauBeneficiaire).toBe('intermédiaire');
      expect(mapped.dateDispo).toBe('2024-12-20');
      expect(mapped.modaliteFormation).toBe('présentiel');
      expect(mapped.objectifs).toEqual(['Améliorer compétences, Obtenir certification']);
    });

    it('should handle array objectifs correctly', () => {
      const apiDataWithArrayObjectifs = {
        id: 'rdv-002',
        objectifs: ['Objectif 1', 'Objectif 2', 'Objectif 3']
      };

      const mapped = mapApiDataToRendezvous(apiDataWithArrayObjectifs);
      
      expect(mapped.objectifs).toEqual(['Objectif 1', 'Objectif 2', 'Objectif 3']);
    });

    it('should handle null/undefined objectifs', () => {
      const apiDataWithNullObjectifs = {
        id: 'rdv-003',
        objectifs: null
      };

      const mapped = mapApiDataToRendezvous(apiDataWithNullObjectifs);
      
      expect(mapped.objectifs).toBeUndefined();
    });

    it('should prefer specific field names over generic ones', () => {
      const apiDataWithBothFieldNames = {
        id: 'rdv-004',
        // API a les deux noms, doit préférer le spécifique
        nom: 'GenericNom',
        nomBeneficiaire: 'SpecificNom',
        status: 'generic_status',
        statut: 'specific_status'
      };

      const mapped = mapApiDataToRendezvous(apiDataWithBothFieldNames);
      
      expect(mapped.nomBeneficiaire).toBe('GenericNom'); // Priorité à 'nom' dans le mapping
      expect(mapped.statut).toBe('generic_status'); // Priorité à 'status' dans le mapping
    });
  });

  describe('API Data Preparation', () => {
    it('should prepare form data for API correctly', () => {
      const formData: RendezvousFormData = {
        type: 'positionnement',
        nomBeneficiaire: 'Martin',
        prenomBeneficiaire: 'Sophie',
        emailBeneficiaire: 'sophie.martin@email.com',
        telephoneBeneficiaire: '0987654321',
        formationSelectionnee: 'Formation Angular',
        objectifs: ['Apprendre Angular', 'Développer des applications'],
        commentaires: 'Très motivée',
        niveauBeneficiaire: 'débutant'
      };

      const prepared = prepareRendezvousForApi(formData);
      
      expect(prepared.type).toBe('positionnement');
      expect(prepared.nom).toBe('Martin');
      expect(prepared.prenom).toBe('Sophie');
      expect(prepared.email).toBe('sophie.martin@email.com');
      expect(prepared.telephone).toBe('0987654321');
      expect(prepared.formationSelectionnee).toBe('Formation Angular');
      expect(prepared.objectifs).toBe('Apprendre Angular, Développer des applications');
      expect(prepared.commentaires).toBe('Très motivée');
      expect(prepared.niveau).toBe('débutant');
    });

    it('should handle string objectifs', () => {
      const formDataWithStringObjectifs: RendezvousFormData = {
        nomBeneficiaire: 'Test',
        prenomBeneficiaire: 'User',
        emailBeneficiaire: 'test@email.com',
        objectifs: 'Un seul objectif string'
      };

      const prepared = prepareRendezvousForApi(formDataWithStringObjectifs);
      
      expect(prepared.objectifs).toBe('Un seul objectif string');
    });

    it('should use default type when not specified', () => {
      const formDataWithoutType: RendezvousFormData = {
        nomBeneficiaire: 'Test',
        prenomBeneficiaire: 'User',
        emailBeneficiaire: 'test@email.com'
      };

      const prepared = prepareRendezvousForApi(formDataWithoutType);
      
      expect(prepared.type).toBe('positionnement');
    });

    it('should handle all optional fields', () => {
      const completeFormData: RendezvousFormData = {
        nomBeneficiaire: 'Dupont',
        prenomBeneficiaire: 'Jean',
        emailBeneficiaire: 'jean@email.com',
        telephoneBeneficiaire: '0123456789',
        formationSelectionnee: 'Formation React',
        niveauBeneficiaire: 'avancé',
        situationActuelle: 'Développeur senior',
        attentes: 'Perfectionnement',
        dateRdv: new Date('2024-12-15T10:00:00'),
        canal: 'visio',
        synthese: 'Synthèse détaillée',
        dateDispo: '2024-12-20',
        modaliteFormation: 'mixte',
        entreprise: 'TechCorp',
        siret: '12345678901234',
        hasHandicap: true,
        detailsHandicap: 'Mobilité réduite',
        isFinancement: true,
        typeFinancement: 'CPF'
      };

      const prepared = prepareRendezvousForApi(completeFormData);
      
      expect(prepared.niveau).toBe('avancé');
      expect(prepared.situationActuelle).toBe('Développeur senior');
      expect(prepared.attentes).toBe('Perfectionnement');
      expect(prepared.entreprise).toBe('TechCorp');
      expect(prepared.siret).toBe('12345678901234');
      expect(prepared.hasHandicap).toBe(true);
      expect(prepared.detailsHandicap).toBe('Mobilité réduite');
      expect(prepared.isFinancement).toBe(true);
      expect(prepared.typeFinancement).toBe('CPF');
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle large datasets efficiently', () => {
      const startTime = performance.now();
      
      // Créer un grand nombre de validations
      for (let i = 0; i < 1000; i++) {
        validateEmail(`user${i}@domain${i}.com`);
        validatePhone(`012345678${i % 10}`);
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // La validation devrait être rapide (moins de 100ms pour 1000 validations)
      expect(duration).toBeLessThan(100);
    });

    it('should handle malformed input gracefully', () => {
      const malformedData = {
        id: null,
        status: undefined,
        nom: 123, // Wrong type
        email: {}, // Wrong type
        objectifs: 'not an array or string but should still work'
      };

      expect(() => {
        mapApiDataToRendezvous(malformedData);
      }).not.toThrow();

      const result = mapApiDataToRendezvous(malformedData);
      expect(result.id).toBe(null);
      expect(result.nomBeneficiaire).toBe(123);
    });

    it('should maintain data integrity through multiple transformations', () => {
      const originalFormData: RendezvousFormData = {
        nomBeneficiaire: 'Test',
        prenomBeneficiaire: 'User',
        emailBeneficiaire: 'test@example.com',
        objectifs: ['Objectif 1', 'Objectif 2']
      };

      // Form data -> API data -> Rendezvous
      const apiData = prepareRendezvousForApi(originalFormData);
      const rendezvous = mapApiDataToRendezvous(apiData);

      expect(rendezvous.nomBeneficiaire).toBe(originalFormData.nomBeneficiaire);
      expect(rendezvous.prenomBeneficiaire).toBe(originalFormData.prenomBeneficiaire);
      expect(rendezvous.emailBeneficiaire).toBe(originalFormData.emailBeneficiaire);
    });
  });
});