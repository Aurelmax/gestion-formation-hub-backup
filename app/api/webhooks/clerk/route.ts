import { WebhookEvent } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { syncClerkUser, ClerkUserData } from '@/lib/clerk-sync';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
    }

    const payload = await request.text();
    const headers = request.headers;

    // Vérifier la signature du webhook (à implémenter selon la doc Clerk)
    // Pour l'instant, on accepte tous les webhooks

    const event = JSON.parse(payload) as WebhookEvent;

    switch (event.type) {
      case 'user.created':
        await syncClerkUser({
          id: event.data.id,
          emailAddresses: event.data.email_addresses,
          firstName: event.data.first_name,
          lastName: event.data.last_name,
          imageUrl: event.data.image_url,
          lastSignInAt: event.data.last_sign_in_at
        } as ClerkUserData);
        console.log('Utilisateur Clerk créé et synchronisé:', event.data.id);
        break;

      case 'user.updated':
        await syncClerkUser({
          id: event.data.id,
          emailAddresses: event.data.email_addresses,
          firstName: event.data.first_name,
          lastName: event.data.last_name,
          imageUrl: event.data.image_url,
          lastSignInAt: event.data.last_sign_in_at
        } as ClerkUserData);
        console.log('Utilisateur Clerk mis à jour:', event.data.id);
        break;

      case 'user.deleted':
        // Désactiver au lieu de supprimer
        await prisma.user.updateMany({
          where: { clerkId: event.data.id },
          data: { isActive: false }
        });
        console.log('Utilisateur Clerk désactivé:', event.data.id);
        break;

      case 'session.created':
        // Mettre à jour la dernière connexion
        await prisma.user.updateMany({
          where: { clerkId: event.data.user_id },
          data: { lastLoginAt: new Date() }
        });
        console.log('Connexion utilisateur enregistrée:', event.data.user_id);
        break;

      default:
        console.log(`Type d'événement webhook non géré: ${event.type}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur webhook Clerk:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
