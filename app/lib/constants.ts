// Configuration des URLs et constantes SEO
export const SEO_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://gestionmax-formation-hub.vercel.app',
  siteName: 'GestionMax Formation Hub',
  defaultTitle: 'GestionMax Formation Hub - Centre de Formation Professionnelle',
  defaultDescription: 'Organisme de formation professionnelle certifié Qualiopi. Formations WordPress, développement web, bureautique et management.',
  locale: 'fr_FR' as const,
  type: 'website' as const,
  images: {
    ogDefault: '/images/og/og-default.jpg',
    ogCatalogue: '/images/og/og-catalogue.jpg',
    ogFormation: '/images/og/og-formation.jpg',
    logo: '/logo-gestionmax-antibes.png',
    qualiopiBadge: '/logo-qualiopi-gestionmax.webp',
  },
  twitter: {
    site: '@gestionmax',
    creator: '@aurelien_gmax',
  },
}

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/gestionmax',
  instagram: 'https://instagram.com/gestionmax',
  linkedin: 'https://linkedin.com/company/gestionmax',
  twitter: 'https://twitter.com/gestionmax',
}

export const CONTACT_INFO = {
  email: 'aurelien@gestionmax.fr',
  phone: '06.46.02.24.68',
  address: 'Antibes, France',
}

// Helper function pour générer des URLs complètes
export function getFullUrl(path: string = ''): string {
  return `${SEO_CONFIG.baseUrl}${path.startsWith('/') ? path : `/${path}`}`
}