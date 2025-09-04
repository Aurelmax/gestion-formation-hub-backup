import { NextRequest, NextResponse } from 'next/server';
import { generateOTPCode, smsProvider } from '@/lib/sms-provider';
import { z } from 'zod';

const sendCodeSchema = z.object({
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Format de téléphone invalide (format international requis)')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = sendCodeSchema.parse(body);

    // Générer le code OTP
    const code = await generateOTPCode(phone);

    // Envoyer le SMS
    const message = `Votre code de vérification GestionMax est: ${code}. Ce code expire dans 5 minutes.`;
    await smsProvider.sendSMS(phone, message);

    return NextResponse.json({
      success: true,
      message: 'Code envoyé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi du code SMS:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Données invalides',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      error: 'Erreur lors de l\'envoi du code'
    }, { status: 500 });
  }
}