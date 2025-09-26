import { NextRequest } from 'next/server';
import { z } from 'zod';

/**
 * Champs sensibles à masquer dans les logs
 */
const SENSITIVE_FIELDS = [
  'password',
  'token',
  'secret',
  'key',
  'auth',
  'credential',
  'session',
  'cookie',
  'email', // Dans certains contextes
  'telephone',
  'phone',
  'ssn',
  'social',
  'card',
  'bank',
  'account'
];

/**
 * Patterns sensibles à détecter
 */
const SENSITIVE_PATTERNS = [
  /\b[\w\.-]+@[\w\.-]+\.\w+\b/gi, // Email
  /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, // Numéro de carte
  /\b(?:\+33|0)[1-9](?:[.\-\s]?\d{2}){4}\b/g, // Téléphone français
];

/**
 * Interface for sanitized log data
 */
export interface SanitizedLogData {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: any;
  timestamp: string;
  requestId?: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  route?: string;
}

/**
 * Logger sécurisé qui masque les données sensibles
 */
export class SecureLogger {
  private static instance: SecureLogger;

  private constructor() {}

  public static getInstance(): SecureLogger {
    if (!SecureLogger.instance) {
      SecureLogger.instance = new SecureLogger();
    }
    return SecureLogger.instance;
  }

  /**
   * Sanitise les données en masquant les informations sensibles
   */
  private sanitizeData(data: any): any {
    if (data === null || data === undefined) return data;

    // String
    if (typeof data === 'string') {
      return this.sanitizeString(data);
    }

    // Array
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }

    // Object
    if (typeof data === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        const lowerKey = key.toLowerCase();

        // Masquer les champs sensibles
        if (SENSITIVE_FIELDS.some(field => lowerKey.includes(field))) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = this.sanitizeData(value);
        }
      }
      return sanitized;
    }

    return data;
  }

  /**
   * Sanitise une chaîne de caractères
   */
  private sanitizeString(str: string): string {
    let sanitized = str;

    // Appliquer les patterns de détection
    SENSITIVE_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    });

    return sanitized;
  }

  /**
   * Log sécurisé
   */
  public log(logData: Omit<SanitizedLogData, 'timestamp'>): void {
    const sanitizedData: SanitizedLogData = {
      ...logData,
      timestamp: new Date().toISOString(),
      data: this.sanitizeData(logData.data)
    };

    // En développement, afficher dans la console
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${sanitizedData.level.toUpperCase()}] ${sanitizedData.message}`,
        sanitizedData.data ? sanitizedData.data : '');
    }

    // En production, envoyer vers un service de logging
    // TODO: Implémenter l'envoi vers un service externe (Sentry, LogRocket, etc.)
  }

  /**
   * Méthodes de commodité
   */
  public info(message: string, data?: any, context?: Partial<SanitizedLogData>): void {
    this.log({ level: 'info', message, data, ...context });
  }

  public warn(message: string, data?: any, context?: Partial<SanitizedLogData>): void {
    this.log({ level: 'warn', message, data, ...context });
  }

  public error(message: string, data?: any, context?: Partial<SanitizedLogData>): void {
    this.log({ level: 'error', message, data, ...context });
  }

  public debug(message: string, data?: any, context?: Partial<SanitizedLogData>): void {
    this.log({ level: 'debug', message, data, ...context });
  }
}

/**
 * Instance globale du logger sécurisé
 */
export const secureLogger = SecureLogger.getInstance();

/**
 * Validation de sécurité pour les requêtes
 */
export interface SecurityValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedData?: any;
}

/**
 * Validateur de sécurité
 */
export class SecurityValidator {
  /**
   * Valide et sanitise les données d'une requête
   */
  public static async validateRequest<T>(
    request: NextRequest,
    schema: z.ZodSchema<T>
  ): Promise<SecurityValidationResult & { data?: T }> {
    try {
      // Récupérer le body de la requête
      const rawBody = await request.json().catch(() => ({}));

      // Validation avec Zod
      const validation = schema.safeParse(rawBody);

      if (!validation.success) {
        const errors = validation.error.errors.map(err =>
          `${err.path.join('.')}: ${err.message}`
        );

        secureLogger.warn('Validation failed for request', {
          route: request.nextUrl.pathname,
          method: request.method,
          errors
        });

        return {
          isValid: false,
          errors,
        };
      }

      return {
        isValid: true,
        errors: [],
        data: validation.data
      };

    } catch (error) {
      secureLogger.error('Error validating request', {
        error: error instanceof Error ? error.message : 'Unknown error',
        route: request.nextUrl.pathname,
        method: request.method
      });

      return {
        isValid: false,
        errors: ['Invalid request format'],
      };
    }
  }

  /**
   * Vérifie la présence de contenu potentiellement malveillant
   */
  public static detectMaliciousContent(data: any): string[] {
    const issues: string[] = [];
    const dataStr = JSON.stringify(data).toLowerCase();

    // Patterns d'injection SQL
    const sqlPatterns = [
      /union[\s]+select/gi,
      /drop[\s]+table/gi,
      /insert[\s]+into/gi,
      /delete[\s]+from/gi,
      /update[\s]+set/gi,
      /exec[\s]*\(/gi,
    ];

    // Patterns XSS
    const xssPatterns = [
      /<script[^>]*>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>/gi,
      /eval\s*\(/gi,
    ];

    // Vérifier SQL injection
    sqlPatterns.forEach(pattern => {
      if (pattern.test(dataStr)) {
        issues.push('Potential SQL injection detected');
      }
    });

    // Vérifier XSS
    xssPatterns.forEach(pattern => {
      if (pattern.test(dataStr)) {
        issues.push('Potential XSS content detected');
      }
    });

    return issues;
  }
}

/**
 * Wrapper pour sécuriser une route API
 */
export function withSecurity<T>(
  handler: (request: NextRequest, context: any, data: T) => Promise<Response>,
  schema: z.ZodSchema<T>
) {
  return async (request: NextRequest, context: any) => {
    try {
      // Validation de sécurité
      const validation = await SecurityValidator.validateRequest(request, schema);

      if (!validation.isValid) {
        return new Response(
          JSON.stringify({
            success: false,
            error: {
              type: 'validation_error',
              message: 'Données invalides',
              details: validation.errors
            }
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }

      // Vérifier le contenu malveillant
      const securityIssues = SecurityValidator.detectMaliciousContent(validation.data);

      if (securityIssues.length > 0) {
        secureLogger.warn('Malicious content detected', {
          route: request.nextUrl.pathname,
          method: request.method,
          issues: securityIssues
        });

        return new Response(
          JSON.stringify({
            success: false,
            error: {
              type: 'security_violation',
              message: 'Contenu suspect détecté'
            }
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }

      // Exécuter le handler avec les données validées
      return await handler(request, context, validation.data!);

    } catch (error) {
      secureLogger.error('Security wrapper error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        route: request.nextUrl.pathname,
        method: request.method
      });

      return new Response(
        JSON.stringify({
          success: false,
          error: {
            type: 'internal_error',
            message: 'Erreur serveur'
          }
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  };
}

/**
 * Utilitaires de sécurité pour les headers
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    // Protection XSS
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',

    // CSP basique (à adapter selon les besoins)
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",

    // Autres headers de sécurité
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  };
}