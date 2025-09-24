import { Metadata } from 'next'
import { SEO_CONFIG, getFullUrl } from './constants'

interface SeoProps {
  title?: string
  description?: string
  url?: string
  image?: string
  type?: 'website' | 'article'
  keywords?: string[]
  noIndex?: boolean
}

export function generateMetadata({
  title,
  description = SEO_CONFIG.defaultDescription,
  url = '',
  image = SEO_CONFIG.images.ogDefault,
  type = 'website',
  keywords = [],
  noIndex = false,
}: SeoProps = {}): Metadata {
  const fullTitle = title
    ? `${title} | ${SEO_CONFIG.siteName}`
    : SEO_CONFIG.defaultTitle

  const fullUrl = getFullUrl(url)
  const fullImageUrl = getFullUrl(image)

  return {
    title: fullTitle,
    description,
    keywords,
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
    openGraph: {
      type,
      locale: SEO_CONFIG.locale,
      siteName: SEO_CONFIG.siteName,
      title: fullTitle,
      description,
      url: fullUrl,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title || SEO_CONFIG.defaultTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: SEO_CONFIG.twitter.site,
      creator: SEO_CONFIG.twitter.creator,
      title: fullTitle,
      description,
      images: [fullImageUrl],
    },
    alternates: {
      canonical: fullUrl,
    },
  }
}

// Helper spécifique pour les formations
export function generateFormationMetadata(formation: {
  titre: string
  description: string
  id: string
  dateModification?: Date
}) {
  // Génération d'image OG dynamique pour la formation
  const dynamicImage = generateDynamicOgImage({
    title: formation.titre,
    subtitle: 'Formation Professionnelle',
    category: 'Formation Qualiopi',
  })

  return generateMetadata({
    title: formation.titre,
    description: formation.description.substring(0, 160),
    url: `/formations/${formation.id}`,
    image: dynamicImage,
    type: 'article',
    keywords: [
      'formation',
      'formation professionnelle',
      formation.titre.toLowerCase(),
      'Qualiopi',
      'CPF',
    ],
  })
}

// Helper pour générer des images OG dynamiques (placeholder pour l'implémentation future)
export function generateDynamicOgImage(params: {
  title: string
  subtitle?: string
  category?: string
}) {
  const searchParams = new URLSearchParams({
    title: params.title,
    subtitle: params.subtitle || '',
    category: params.category || '',
  })

  return `/api/og?${searchParams.toString()}`
}