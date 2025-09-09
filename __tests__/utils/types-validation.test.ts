/**
 * Tests unitaires pour les types centralisés et validations Zod
 * Tests critiques pour la cohérence des données
 */

import {
  ProgrammeType,
  PROGRAMME_TYPE_ENUM,
  PROGRAMME_TYPE_LABELS,
  programmeFormationSchema,
  isTypeCatalogue,
  isTypePersonnalise,
  isProgrammeActif,
  isProgrammeVisible,
  mapProgrammeToListe
} from '@/types';
import { z } from 'zod';

describe('Types Centralisés - Validation Critique', () => {

  // =====================================
  // TESTS DES ÉNUMÉRATIONS DE BASE
  // =====================================

  describe('Énumérations ProgrammeType', () => {
    
    it('should have correct programme types', () => {
      expect(PROGRAMME_TYPE_ENUM).toEqual(['catalogue', 'personnalise']);
      expect(PROGRAMME_TYPE_ENUM).toHaveLength(2);
    });

    it('should have corresponding labels', () => {
      expect(PROGRAMME_TYPE_LABELS).toEqual({
        catalogue: 'Catalogue',
        personnalise: 'Personnalisé'
      });
    });

    it('should validate programme type correctly', () => {
      const validTypes: ProgrammeType[] = ['catalogue', 'personnalise'];
      const invalidTypes = ['sur-mesure', 'custom', '', null, undefined];

      validTypes.forEach(type => {
        expect(PROGRAMME_TYPE_ENUM.includes(type)).toBe(true);
      });

      invalidTypes.forEach(type => {
        expect(PROGRAMME_TYPE_ENUM.includes(type as any)).toBe(false);
      });
    });
  });

  // =====================================
  // TESTS DE VALIDATION ZOD
  // =====================================

  describe('Validation Zod Schema', () => {
    
    const validProgrammeData = {
      code: 'TEST-001',
      type: 'catalogue' as ProgrammeType,
      titre: 'Programme de Test',
      description: 'Description du programme',
      niveau: 'Débutant',
      participants: '8-12',
      duree: '2 jours',
      prix: '1500€',
      objectifs: ['Objectif 1', 'Objectif 2'],
      prerequis: 'Aucun',
      publicConcerne: 'Professionnels',
      contenuDetailleJours: 'Contenu sur 2 jours',
      modalites: 'Présentiel',
      modalitesAcces: 'Sur inscription',
      modalitesTechniques: 'Salle équipée',
      modalitesReglement: 'Paiement à l\'inscription',
      formateur: 'Expert métier',
      ressourcesDisposition: 'Support de cours',
      modalitesEvaluation: 'QCM et pratique',
      sanctionFormation: 'Attestation',
      niveauCertification: 'Niveau 1',
      delaiAcceptation: '48h',
      accessibiliteHandicap: 'Locaux accessibles',
      cessationAbandon: 'Remboursement partiel',
      estActif: true,
      estVisible: true
    };

    it('should validate complete valid programme', () => {
      const result = programmeFormationSchema.safeParse(validProgrammeData);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.type).toBe('catalogue');
        expect(result.data.titre).toBe('Programme de Test');
        expect(result.data.objectifs).toEqual(['Objectif 1', 'Objectif 2']);
      }
    });

    it('should reject programme with invalid type', () => {
      const invalidData = {
        ...validProgrammeData,
        type: 'sur-mesure' // Type invalide
      };
      
      const result = programmeFormationSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Type de programme invalide');
      }
    });

    it('should reject programme with missing required fields', () => {
      const requiredFields = [
        'code', 'type', 'titre', 'description', 'niveau', 
        'participants', 'duree', 'prix', 'publicConcerne',
        'contenuDetailleJours', 'modalites', 'modalitesAcces',
        'modalitesTechniques', 'modalitesReglement', 'formateur',
        'ressourcesDisposition', 'modalitesEvaluation', 'sanctionFormation',
        'niveauCertification', 'delaiAcceptation', 'accessibiliteHandicap',
        'cessationAbandon'
      ];

      requiredFields.forEach(field => {
        const incompleteData = { ...validProgrammeData };
        delete (incompleteData as any)[field];
        
        const result = programmeFormationSchema.safeParse(incompleteData);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues.some(issue => 
            issue.path.includes(field)
          )).toBe(true);
        }
      });
    });

    it('should validate optional fields correctly', () => {
      const dataWithOptionals = {
        ...validProgrammeData,
        categorieId: 'test-category',
        beneficiaireId: 'test-beneficiary',
        programmeCatalogueId: 'test-source',
        pictogramme: '📚',
        programmeUrl: 'https://example.com',
        ressourcesAssociees: ['Resource 1', 'Resource 2'],
        objectifsSpecifiques: 'Objectifs spéciaux'
      };
      
      const result = programmeFormationSchema.safeParse(dataWithOptionals);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.categorieId).toBe('test-category');
        expect(result.data.ressourcesAssociees).toEqual(['Resource 1', 'Resource 2']);
      }
    });

    it('should validate field constraints', () => {
      const constraints = [
        {
          field: 'code',
          value: '',
          shouldFail: true,
          expectedError: 'Le code est obligatoire'
        },
        {
          field: 'code', 
          value: 'A'.repeat(51), // Trop long
          shouldFail: true,
          expectedError: 'Code trop long'
        },
        {
          field: 'titre',
          value: '',
          shouldFail: true,
          expectedError: 'Le titre est obligatoire'
        },
        {
          field: 'titre',
          value: 'A'.repeat(201), // Trop long
          shouldFail: true,
          expectedError: 'Titre trop long'
        },
        {
          field: 'objectifs',
          value: [],
          shouldFail: true,
          expectedError: 'Au moins un objectif est requis'
        }
      ];

      constraints.forEach(({ field, value, shouldFail, expectedError }) => {
        const testData = { ...validProgrammeData, [field]: value };
        const result = programmeFormationSchema.safeParse(testData);
        
        expect(result.success).toBe(!shouldFail);
        
        if (shouldFail && !result.success) {
          expect(result.error.issues.some(issue => 
            issue.message === expectedError
          )).toBe(true);
        }
      });
    });
  });

  // =====================================
  // TESTS DES TYPE GUARDS
  // =====================================

  describe('Type Guards', () => {
    
    it('should identify catalogue type correctly', () => {
      expect(isTypeCatalogue('catalogue')).toBe(true);
      expect(isTypeCatalogue('personnalise')).toBe(false);
      expect(isTypeCatalogue('invalid' as any)).toBe(false);
    });

    it('should identify personnalise type correctly', () => {
      expect(isTypePersonnalise('personnalise')).toBe(true);
      expect(isTypePersonnalise('catalogue')).toBe(false);
      expect(isTypePersonnalise('invalid' as any)).toBe(false);
    });

    it('should check programme active status', () => {
      const activeProgramme = createMockProgramme({ estActif: true });
      const inactiveProgramme = createMockProgramme({ estActif: false });
      
      expect(isProgrammeActif(activeProgramme)).toBe(true);
      expect(isProgrammeActif(inactiveProgramme)).toBe(false);
    });

    it('should check programme visibility', () => {
      const visibleProgramme = createMockProgramme({ estVisible: true });
      const hiddenProgramme = createMockProgramme({ estVisible: false });
      
      expect(isProgrammeVisible(visibleProgramme)).toBe(true);
      expect(isProgrammeVisible(hiddenProgramme)).toBe(false);
    });
  });

  // =====================================
  // TESTS DES UTILITAIRES DE TRANSFORMATION
  // =====================================

  describe('Utilitaires de Transformation', () => {
    
    it('should map programme to liste format correctly', () => {
      const fullProgramme = createMockProgramme({
        id: 'test-id',
        code: 'TEST-001',
        type: 'catalogue',
        titre: 'Programme Test',
        description: 'Description test',
        niveau: 'Débutant',
        duree: '2 jours',
        prix: '1500€',
        categorieId: 'cat-id',
        categorie: {
          id: 'cat-id',
          nom: 'Catégorie Test',
          titre: 'Catégorie de Test'
        },
        pictogramme: '📚',
        estActif: true,
        estVisible: true,
        version: 1,
        dateCreation: '2025-01-01T00:00:00Z',
        dateModification: '2025-01-02T00:00:00Z'
      });

      const listeFormat = mapProgrammeToListe(fullProgramme);
      
      expect(listeFormat).toEqual({
        id: 'test-id',
        code: 'TEST-001',
        type: 'catalogue',
        titre: 'Programme Test',
        description: 'Description test',
        niveau: 'Débutant',
        duree: '2 jours',
        prix: '1500€',
        categorieId: 'cat-id',
        categorie: {
          id: 'cat-id',
          nom: 'Catégorie Test',
          titre: 'Catégorie de Test'
        },
        pictogramme: '📚',
        estActif: true,
        estVisible: true,
        version: 1,
        dateCreation: '2025-01-01T00:00:00Z',
        dateModification: '2025-01-02T00:00:00Z'
      });
    });

    it('should handle programme without category', () => {
      const programmeWithoutCategory = createMockProgramme({
        categorie: null,
        categorieId: null
      });

      const listeFormat = mapProgrammeToListe(programmeWithoutCategory);
      
      expect(listeFormat.categorie).toBeNull();
      expect(listeFormat.categorieId).toBeNull();
    });

    it('should preserve all required fields in mapping', () => {
      const programme = createMockProgramme();
      const mapped = mapProgrammeToListe(programme);
      
      const requiredFields = [
        'id', 'code', 'type', 'titre', 'description', 
        'niveau', 'duree', 'prix', 'estActif', 'estVisible', 
        'version', 'dateCreation'
      ];
      
      requiredFields.forEach(field => {
        expect(mapped).toHaveProperty(field);
        expect((mapped as any)[field]).toBeDefined();
      });
    });
  });

  // =====================================
  // TESTS DE COHÉRENCE DES TYPES
  // =====================================

  describe('Cohérence des Types', () => {
    
    it('should maintain type consistency across enums and labels', () => {
      const enumTypes = PROGRAMME_TYPE_ENUM;
      const labelKeys = Object.keys(PROGRAMME_TYPE_LABELS) as ProgrammeType[];
      
      expect(enumTypes.sort()).toEqual(labelKeys.sort());
    });

    it('should validate all programme types have labels', () => {
      PROGRAMME_TYPE_ENUM.forEach(type => {
        expect(PROGRAMME_TYPE_LABELS[type]).toBeDefined();
        expect(typeof PROGRAMME_TYPE_LABELS[type]).toBe('string');
        expect(PROGRAMME_TYPE_LABELS[type].length).toBeGreaterThan(0);
      });
    });

    it('should ensure type guards cover all enum values', () => {
      const allTypes: ProgrammeType[] = [...PROGRAMME_TYPE_ENUM];
      
      allTypes.forEach(type => {
        const isCatalogue = isTypeCatalogue(type);
        const isPersonnalise = isTypePersonnalise(type);
        
        // Chaque type doit être identifié par exactement un type guard
        expect(isCatalogue || isPersonnalise).toBe(true);
        expect(isCatalogue && isPersonnalise).toBe(false);
      });
    });
  });

  // =====================================
  // TESTS DE PERFORMANCE ET EDGE CASES
  // =====================================

  describe('Performance et Edge Cases', () => {
    
    it('should handle large arrays in objectifs field', () => {
      const largeObjectifs = Array.from({ length: 100 }, (_, i) => `Objectif ${i + 1}`);
      
      const dataWithLargeArray = {
        ...programmeFormationSchema.parse({
          code: 'TEST-001',
          type: 'catalogue',
          titre: 'Test',
          description: 'Test',
          niveau: 'Test',
          participants: 'Test',
          duree: 'Test',
          prix: 'Test',
          objectifs: largeObjectifs,
          prerequis: 'Test',
          publicConcerne: 'Test',
          contenuDetailleJours: 'Test',
          modalites: 'Test',
          modalitesAcces: 'Test',
          modalitesTechniques: 'Test',
          modalitesReglement: 'Test',
          formateur: 'Test',
          ressourcesDisposition: 'Test',
          modalitesEvaluation: 'Test',
          sanctionFormation: 'Test',
          niveauCertification: 'Test',
          delaiAcceptation: 'Test',
          accessibiliteHandicap: 'Test',
          cessationAbandon: 'Test',
          estActif: true,
          estVisible: true
        })
      };
      
      expect(dataWithLargeArray.objectifs).toHaveLength(100);
    });

    it('should handle special characters in string fields', () => {
      const specialChars = 'àáâãäåæçèéêëìíîïñòóôõöøùúûüýÿ!@#$%^&*()[]{}|;:,.<>?';
      
      const dataWithSpecialChars = {
        code: 'SPÉC-001',
        type: 'catalogue' as ProgrammeType,
        titre: `Programme avec ${specialChars}`,
        description: `Description ${specialChars}`,
        niveau: specialChars.substring(0, 20),
        participants: '8-12',
        duree: '2 jours',
        prix: '1500€',
        objectifs: [`Objectif ${specialChars}`],
        prerequis: specialChars,
        publicConcerne: specialChars,
        contenuDetailleJours: specialChars,
        modalites: specialChars,
        modalitesAcces: specialChars,
        modalitesTechniques: specialChars,
        modalitesReglement: specialChars,
        formateur: specialChars,
        ressourcesDisposition: specialChars,
        modalitesEvaluation: specialChars,
        sanctionFormation: specialChars,
        niveauCertification: specialChars,
        delaiAcceptation: specialChars,
        accessibiliteHandicap: specialChars,
        cessationAbandon: specialChars,
        estActif: true,
        estVisible: true
      };
      
      const result = programmeFormationSchema.safeParse(dataWithSpecialChars);
      expect(result.success).toBe(true);
    });

    it('should be performant with type guards', () => {
      const iterations = 10000;
      const testType: ProgrammeType = 'catalogue';
      
      const start = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        isTypeCatalogue(testType);
        isTypePersonnalise(testType);
      }
      
      const end = performance.now();
      const duration = end - start;
      
      // Les type guards doivent être très rapides (< 10ms pour 10k opérations)
      expect(duration).toBeLessThan(10);
    });
  });
});