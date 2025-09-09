// Configuration globale avant l'exécution de tous les tests
module.exports = async () => {
  // Configuration de l'environnement de test
  process.env.NODE_ENV = 'test';
  process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
  
  // Mock des variables d'environnement nécessaires
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
  process.env.NEXTAUTH_SECRET = 'test-secret';
  process.env.NEXTAUTH_URL = 'http://localhost:3000';
  
  console.log('🧪 Jest Global Setup - Environment configured');
};