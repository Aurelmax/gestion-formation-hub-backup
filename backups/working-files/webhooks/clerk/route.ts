import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { syncClerkUser, deleteClerkUser } from '@/app/lib/clerk-sync';
import { requireAuth, requireAuthWithRole } from '@/lib/api-auth';

export async function POST(req: NextRequest) {
  try {
    // Vérifier l'authentification et les permissions admin
    const authResult = await requireAuthWithRole('admin');
    if (!authResult.isAuthenticated) {
      return authResult.error!;
    }

  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

    );
  }
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.text();
  const body = JSON.parse(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;

    );
  }
  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url, public_metadata } = evt.data;
    
    try {
      await syncClerkUser({
        id,
        primaryEmailAddress: email_addresses?.[0],
        fullName: `${first_name || ''} ${last_name || ''}`.trim(),
        imageUrl: image_url,
        publicMetadata: public_metadata,
      } as any);
      
      console.log('User created and synced:', id);

  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url, public_metadata } = evt.data;
    
    try {
      await syncClerkUser({
        id,
        primaryEmailAddress: email_addresses?.[0],
        fullName: `${first_name || ''} ${last_name || ''}`.trim(),
        imageUrl: image_url,
        publicMetadata: public_metadata,
      } as any);
      
      console.log('User updated and synced:', id);

  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;
    
    try {
      await deleteClerkUser(id);
      console.log('User deleted and synced:', id);

  }

  return new Response('', { status: 200 });
}

    );
  }
