// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    // Ici tu peux appeler ton service pour envoyer l'email
    // Exemple : await sendResetPasswordEmail(email);

    console.log(`Demande de réinitialisation pour : ${email}`);

    return NextResponse.json({ message: 'Email de réinitialisation envoyé si le compte existe.' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
