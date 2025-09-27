import { WebhookEvent } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
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
          email: event.data.email_addresses[0]?.email_address,
          name: `${event.data.first_name} ${event.data.last_name}`.trim(),
          image: event.data.image_url,
          role: 'user'
        });
        break;

      case 'user.updated':
        await syncClerkUser({
          id: event.data.id,
          email: event.data.email_addresses[0]?.email_address,
          name: `${event.data.first_name} ${event.data.last_name}`.trim(),
          image: event.data.image_url,
          role: 'user'
        });
        break;

      case 'user.deleted':
        await deleteClerkUser(event.data.id);
        break;

      default:
        console.log(`Unhandled webhook event type: ${event.type}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function syncClerkUser(userData: {
  id: string;
  email?: string;
  name?: string;
  image?: string;
  role: string;
}) {
  try {
    await prisma.users.upsert({
      where: { id: userData.id },
      update: {
        email: userData.email,
        name: userData.name,
        image: userData.image,
        role: userData.role,
        updated_at: new Date()
      },
      create: {
        id: userData.id,
        email: userData.email || '',
        name: userData.name || '',
        image: userData.image,
        role: userData.role,
        created_at: new Date(),
        updated_at: new Date()
      }
    });
  } catch (error) {
    console.error('Error syncing user:', error);
    throw error;
  }
}

async function deleteClerkUser(userId: string) {
  try {
    await prisma.users.delete({
      where: { id: userId }
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}
