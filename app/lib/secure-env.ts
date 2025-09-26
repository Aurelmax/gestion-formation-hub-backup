/**
 * Gestion sécurisée des variables d'environnement
 * Évite les fallbacks faibles et assure la sécurité des secrets
 */

export class SecureEnv {
  /**
   * Récupère une variable d'environnement requise
   * Lance une erreur si la variable n'est pas définie
   */
  static getRequired(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Variable d'environnement requise manquante: ${key}`);
    }
    return value;
  }

  /**
   * Récupère une variable d'environnement avec validation
   */
  static getRequiredWithValidation(
    key: string, 
    validator: (value: string) => boolean,
    errorMessage?: string
  ): string {
    const value = this.getRequired(key);
    if (!validator(value)) {
      throw new Error(errorMessage || `Variable d'environnement invalide: ${key}`);
    }
    return value;
  }

  /**
   * Récupère une variable d'environnement optionnelle avec valeur par défaut sécurisée
   */
  static getOptional(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
  }

  /**
   * Valide qu'une variable d'environnement a une longueur minimale
   */
  static getSecret(key: string, minLength: number = 32): string {
    const value = this.getRequired(key);
    if (value.length < minLength) {
      throw new Error(`Secret ${key} trop court. Minimum ${minLength} caractères requis.`);
    }
    return value;
  }

  /**
   * Valide qu'une URL est sécurisée (HTTPS en production)
   */
  static getSecureUrl(key: string): string {
    const value = this.getRequired(key);
    const url = new URL(value);
    
    if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') {
      throw new Error(`URL ${key} doit utiliser HTTPS en production: ${value}`);
    }
    
    return value;
  }
}

/**
 * Configuration sécurisée des variables d'environnement
 */
export const secureConfig = {
  // Secrets critiques - doivent être définis
  clerk: {
    publishableKey: SecureEnv.getRequired('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY'),
    secretKey: SecureEnv.getSecret('CLERK_SECRET_KEY', 32),
  },
  
  // Base de données
  database: {
    url: SecureEnv.getRequired('DATABASE_URL'),
  },
  
  // URLs sécurisées
  api: {
    baseUrl: SecureEnv.getSecureUrl('NEXT_PUBLIC_API_URL'),
  },
  
  // Configuration optionnelle
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
  }
};

/**
 * Validation des secrets au démarrage de l'application
 */
export function validateSecrets(): void {
  try {
    // Vérifier que tous les secrets requis sont présents
    secureConfig.clerk.publishableKey;
    secureConfig.clerk.secretKey;
    secureConfig.database.url;
    secureConfig.api.baseUrl;
    
    console.log('✅ Configuration des secrets validée');
  } catch (error) {
    console.error('❌ Erreur de configuration des secrets:', error);
    throw error;
  }
}
