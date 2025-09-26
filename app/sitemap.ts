import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { secureConfig } from '@/lib/secure-env'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = secureConfig.api.baseUrl

  // Pages statiques
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/a-propos`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/politique-confidentialite`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/accessibilite`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  // Pages dynamiques des formations
  let formationsPages: MetadataRoute.Sitemap = []

  try {
    const formations = await prisma.programmeFormation.findMany({
      where: {
        estActif: true,
        estVisible: true,
      },
      select: {
        id: true,
        dateModification: true,
      },
    })

    formationsPages = formations.map((formation: { id: string; dateModification: Date }) => ({
      url: `${baseUrl}/formations/${formation.id}`,
      lastModified: formation.dateModification,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Erreur lors de la génération du sitemap pour les formations:', error)
  }

  return [...staticPages, ...formationsPages]
}