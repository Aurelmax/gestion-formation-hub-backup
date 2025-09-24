import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Paramètres de l'image
    const title = searchParams.get('title') || 'GestionMax Formation Hub'
    const subtitle = searchParams.get('subtitle') || 'Centre de Formation Professionnelle'
    const category = searchParams.get('category') || ''

    // Couleurs du thème GestionMax
    const primaryColor = '#1e3a8a' // blue-800
    const accentColor = '#3b82f6' // blue-500
    const backgroundColor = '#f8fafc' // slate-50

    return new ImageResponse(
      (
        <div
          style={{
            background: `linear-gradient(135deg, ${backgroundColor} 0%, #e2e8f0 100%)`,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '60px',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {/* Header avec logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <div
              style={{
                background: primaryColor,
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              GM
            </div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: '600',
                color: primaryColor,
              }}
            >
              GestionMax Formation
            </div>
          </div>

          {/* Contenu principal */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              maxWidth: '80%',
            }}
          >
            {category && (
              <div
                style={{
                  backgroundColor: accentColor,
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '18px',
                  fontWeight: '500',
                  display: 'inline-block',
                  alignSelf: 'flex-start',
                }}
              >
                {category}
              </div>
            )}

            <h1
              style={{
                fontSize: '64px',
                fontWeight: '800',
                color: primaryColor,
                lineHeight: '1.1',
                margin: 0,
              }}
            >
              {title}
            </h1>

            {subtitle && (
              <p
                style={{
                  fontSize: '32px',
                  color: '#64748b',
                  margin: 0,
                  fontWeight: '400',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: '#22c55e',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '18px',
                fontWeight: '600',
              }}
            >
              ✓ Certifié Qualiopi
            </div>

            <div
              style={{
                fontSize: '20px',
                color: '#64748b',
                fontWeight: '500',
              }}
            >
              gestionmax-formation-hub.vercel.app
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('Error generating OG image:', error)
    return new Response('Failed to generate image', { status: 500 })
  }
}