/** @type {import('jest').Config} */
const config = {
  // Environnement de test pour React/DOM
  testEnvironment: 'jsdom',
  
  // Fichiers de configuration exécutés avant chaque test
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Extensions de fichiers à transformer
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  
  // Pattern pour identifier les fichiers de test
  testMatch: [
    '<rootDir>/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/app/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/app/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ],
  
  // Transformation des fichiers TypeScript et JSX
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  
  // Résolution des modules (alias Next.js)
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/app/$1',
    '^@/components/(.*)$': '<rootDir>/app/components/$1',
    '^@/hooks/(.*)$': '<rootDir>/app/hooks/$1',
    '^@/types/(.*)$': '<rootDir>/app/types/$1',
    '^@/services/(.*)$': '<rootDir>/app/services/$1',
    '^@/adapters/(.*)$': '<rootDir>/app/adapters/$1',
    '^@/utils/(.*)$': '<rootDir>/app/utils/$1'
  },
  
  // Fichiers à ignorer lors de la transformation
  transformIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/coverage/'
  ],
  
  // Configuration de la couverture de code
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    '!app/**/*.d.ts',
    '!app/**/*.stories.{ts,tsx}',
    '!app/**/*.config.{ts,js}',
    '!app/layout.tsx',
    '!app/loading.tsx',
    '!app/error.tsx',
    '!app/not-found.tsx',
    '!app/global-error.tsx',
    // Focus sur les fichiers critiques
    'app/hooks/useProgrammesFormation.ts',
    'app/types/index.ts', 
    'app/components/formations/**/*.{ts,tsx}',
    'app/adapters/**/*.{ts,tsx}'
  ],
  
  // Seuils de couverture (strictes pour les zones critiques)
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80, 
      lines: 70,
      statements: 70
    },
    // Seuils spécifiques pour les fichiers critiques
    'app/hooks/useProgrammesFormation.ts': {
      branches: 90,
      functions: 95,
      lines: 90,
      statements: 90
    },
    'app/types/index.ts': {
      branches: 85,
      functions: 90,
      lines: 85,
      statements: 85
    }
  },
  
  // Répertoire de sortie pour la couverture
  coverageDirectory: 'coverage',
  
  // Formats de rapport de couverture
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  
  // Variables d'environnement pour les tests
  testEnvironmentOptions: {
    url: 'http://localhost:3000'
  },
  
  // Timeout global pour les tests (30 secondes)
  testTimeout: 30000,
  
  // Mode verbose pour les détails des tests
  verbose: true,
  
  // Nettoyage automatique des mocks entre les tests
  clearMocks: true,
  restoreMocks: true,
  
  // Gestion des ressources statiques
  moduleNameMapping: {
    ...require('./jest.config.js').moduleNameMapping,
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js'
  },
  
  // Fichiers globaux à charger
  globalSetup: '<rootDir>/jest.globalSetup.js',
  globalTeardown: '<rootDir>/jest.globalTeardown.js',
  
  // Parallélisation des tests (optimisation performance)
  maxWorkers: '50%'
};

module.exports = config;