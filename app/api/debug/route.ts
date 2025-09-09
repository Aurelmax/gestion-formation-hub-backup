import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Informations sur l'environnement
    const debug = {
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV,
      vercelUrl: process.env.VERCEL_URL,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      publicApiUrl: process.env.NEXT_PUBLIC_API_URL,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasDirectUrl: !!process.env.DIRECT_URL,
      hasPrismaDataproxy: !!process.env.PRISMA_GENERATE_DATAPROXY,
      requestUrl: request.url,
      requestHeaders: {
        host: request.headers.get('host'),
        userAgent: request.headers.get('user-agent'),
        origin: request.headers.get('origin'),
      },
    };

    return NextResponse.json({
      status: 'ok',
      message: 'API Debug endpoint working',
      debug,
      availableRoutes: [
        '/api/categories',
        '/api/programmes-formation',
        '/api/apprenants',
        '/api/rendezvous',
        '/api/competences',
        '/api/reclamations',
        '/api/actions-correctives',
        '/api/veille',
        '/api/accessibilite/plans',
        '/api/accessibilite/demandes'
      ]
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: 'Debug endpoint failed',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}