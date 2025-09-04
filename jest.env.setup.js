// Configuration des variables d'environnement pour les tests API
process.env.NODE_ENV = 'test';
process.env.NEXTAUTH_SECRET = 'test-secret-key-for-testing-purposes-only';
process.env.NEXTAUTH_URL = 'http://localhost:3001';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'file:./test.db';

// Supprimer les logs de Prisma pendant les tests
process.env.PRISMA_HIDE_UPDATE_MESSAGE = 'true';

// Configuration de base pour les tests
global.console = {
  ...console,
  // Réduire le bruit dans les logs de test
  log: process.env.VERBOSE_TESTS ? console.log : jest.fn(),
  debug: process.env.VERBOSE_TESTS ? console.debug : jest.fn(),
  info: process.env.VERBOSE_TESTS ? console.info : jest.fn(),
  warn: console.warn,
  error: console.error,
};