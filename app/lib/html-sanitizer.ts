/**
 * Utilitaire de sanitisation HTML pour prévenir les attaques XSS
 */

export interface SanitizeOptions {
  allowTags?: string[];
  allowAttributes?: string[];
  stripScripts?: boolean;
  stripEvents?: boolean;
  stripDataAttributes?: boolean;
}

const DEFAULT_OPTIONS: SanitizeOptions = {
  allowTags: ['div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br', 'strong', 'em', 'u', 'i', 'b'],
  allowAttributes: ['class', 'id', 'style'],
  stripScripts: true,
  stripEvents: true,
  stripDataAttributes: true,
};

/**
 * Sanitise le contenu HTML pour prévenir les attaques XSS
 */
export function sanitizeHTML(html: string, options: SanitizeOptions = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  let sanitized = html;

  // Supprimer les scripts
  if (opts.stripScripts) {
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    sanitized = sanitized.replace(/<script\b[^>]*>/gi, '');
  }

  // Supprimer les événements JavaScript
  if (opts.stripEvents) {
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  }

  // Supprimer les attributs data dangereux
  if (opts.stripDataAttributes) {
    sanitized = sanitized.replace(/data-[^=]*\s*=\s*["'][^"']*["']/gi, '');
  }

  // Supprimer les protocoles dangereux
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/vbscript:/gi, '');
  sanitized = sanitized.replace(/data:/gi, '');
  sanitized = sanitized.replace(/file:/gi, '');

  // Supprimer les balises non autorisées
  if (opts.allowTags && opts.allowTags.length > 0) {
    const allowedTagsPattern = opts.allowTags.join('|');
    const tagPattern = new RegExp(`<(?!/?(?:${allowedTagsPattern})\\b)[^>]*>`, 'gi');
    sanitized = sanitized.replace(tagPattern, '');
  }

  // Supprimer les attributs non autorisés
  if (opts.allowAttributes && opts.allowAttributes.length > 0) {
    const allowedAttrsPattern = opts.allowAttributes.join('|');
    const attrPattern = new RegExp(`\\s(?!${allowedAttrsPattern}\\b)[a-zA-Z-]+\\s*=\\s*["'][^"']*["']`, 'gi');
    sanitized = sanitized.replace(attrPattern, '');
  }

  return sanitized;
}

/**
 * Échapper les caractères HTML pour éviter l'injection
 */
export function escapeHTML(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, (s) => map[s]);
}

/**
 * Valider et nettoyer une URL pour éviter les attaques
 */
export function sanitizeURL(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    
    // Autoriser seulement les protocoles sécurisés
    const allowedProtocols = ['http:', 'https:'];
    if (!allowedProtocols.includes(parsedUrl.protocol)) {
      return null;
    }

    // Vérifier que ce n'est pas une URL de données ou javascript
    if (url.toLowerCase().includes('javascript:') || url.toLowerCase().includes('data:')) {
      return null;
    }

    return parsedUrl.toString();
  } catch {
    return null;
  }
}

/**
 * Nettoyer le contenu d'un élément DOM de manière sécurisée
 */
export function clearElementSafely(element: HTMLElement): void {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * Créer un élément DOM de manière sécurisée
 */
export function createSafeElement(tagName: string, content?: string): HTMLElement {
  const element = document.createElement(tagName);
  
  if (content) {
    // Utiliser textContent au lieu d'innerHTML pour éviter l'injection
    element.textContent = content;
  }
  
  return element;
}

/**
 * Vérifier si une chaîne contient du contenu potentiellement dangereux
 */
export function containsDangerousContent(content: string): boolean {
  const dangerousPatterns = [
    /<script\b/i,
    /javascript:/i,
    /vbscript:/i,
    /on\w+\s*=/i,
    /data:/i,
    /file:/i,
  ];

  return dangerousPatterns.some(pattern => pattern.test(content));
}
