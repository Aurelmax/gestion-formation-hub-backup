// Configuration Jest pour les tests de la bibliothèque de programmes de formation
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfills pour l'environnement de test
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock des APIs Web non disponibles dans jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock de ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock de IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Configuration des timeouts
jest.setTimeout(30000);

// Mock des imports Next.js
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
    getAll: jest.fn(),
    has: jest.fn(),
    entries: jest.fn(),
    keys: jest.fn(),
    values: jest.fn(),
  }),
  usePathname: () => '/test-path',
}));

// Mock de next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return React.createElement('img', props);
  },
}));

// Mock global du service API
jest.mock('@/services/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(), 
  delete: jest.fn(),
  patch: jest.fn(),
}));

// Mock du hook de toast
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
    dismiss: jest.fn(),
    toasts: [],
  }),
}));

// Mock des composants UI lourds (pour les tests unitaires)
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }) => React.createElement('div', { 'data-testid': 'dialog' }, children),
  DialogContent: ({ children }) => React.createElement('div', { 'data-testid': 'dialog-content' }, children),
  DialogHeader: ({ children }) => React.createElement('div', { 'data-testid': 'dialog-header' }, children),
  DialogTitle: ({ children }) => React.createElement('h2', { 'data-testid': 'dialog-title' }, children),
  DialogDescription: ({ children }) => React.createElement('p', { 'data-testid': 'dialog-description' }, children),
  DialogFooter: ({ children }) => React.createElement('div', { 'data-testid': 'dialog-footer' }, children),
}));

// Helpers de test globaux
global.createMockProgramme = (overrides = {}) => ({
  id: 'test-programme-id',
  code: 'TEST-001',
  type: 'catalogue',
  titre: 'Programme de Test',
  description: 'Description du programme de test',
  niveau: 'Débutant', 
  participants: '8-12',
  duree: '2 jours',
  prix: '1500',
  objectifs: ['Objectif 1', 'Objectif 2'],
  prerequis: 'Aucun prérequis',
  publicConcerne: 'Professionnels',
  contenuDetailleJours: 'Contenu détaillé sur 2 jours',
  modalites: 'Présentiel',
  modalitesAcces: 'Sur inscription',
  modalitesTechniques: 'Salle équipée',
  modalitesReglement: 'Paiement à l\'inscription', 
  formateur: 'Formateur expert',
  ressourcesDisposition: 'Support de cours',
  modalitesEvaluation: 'QCM et pratique',
  sanctionFormation: 'Attestation',
  niveauCertification: 'Niveau 1',
  delaiAcceptation: '48h',
  accessibiliteHandicap: 'Locaux accessibles',
  cessationAbandon: 'Remboursement partiel',
  categorieId: 'test-category-id',
  categorie: {
    id: 'test-category-id',
    nom: 'Catégorie Test',
    titre: 'Catégorie de Test'
  },
  pictogramme: '📚',
  estActif: true,
  estVisible: true,
  version: 1,
  dateCreation: '2025-01-01T00:00:00Z',
  dateModification: null,
  ...overrides
});

global.createMockCategory = (overrides = {}) => ({
  id: 'test-category-id',
  titre: 'Catégorie Test',
  nom: 'Catégorie Test',
  code: 'CAT_TEST',
  description: 'Description de la catégorie test',
  estActive: true,
  pictogramme: '📁',
  dateCreation: '2025-01-01T00:00:00Z',
  ...overrides
});

// Console warnings pour les problèmes de test
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
     args[0].includes('Warning: React.createFactory() is deprecated'))
  ) {
    return;
  }
  originalError.call(console, ...args);
};