import { NextRequest, NextResponse } from 'next/server';
import { verifyOTPCode } from '@/lib/sms-provider';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';
import { z } from 'zod';

const verifyCodeSchema = z.object({
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Format de téléphone invalide'),
  code: z.string().length(6, 'Le code doit contenir 6 chiffres')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, code } = verifyCodeSchema.parse(body);

    // Vérifier le code OTP
    const isValid = await verifyOTPCode(phone, code);

    if (!isValid) {
      return NextResponse.json({
        error: 'Code invalide ou expiré'
      }, { status: 400 });
    }

    // Chercher ou créer l'utilisateur avec ce numéro de téléphone
    let user = await prisma.user.findUnique({
      where: {
        phone: phone
      }
    });

    if (!user) {
      // Créer un nouvel utilisateur
      user = await prisma.user.create({
        data: {
          phone: phone,
          phoneVerified: new Date(),
          role: 'user'
        }
      });
    } else {
      // Marquer le téléphone comme vérifié
      user = await prisma.user.update({
        where: { id: user.id },
        data: { phoneVerified: new Date() }
      });
    }

    // Créer une session NextAuth manuellement ou retourner les infos utilisateur
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        phone: phone,
        role: user.role
      },
      message: 'Code vérifié avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la vérification du code SMS:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Données invalides',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      error: 'Erreur lors de la vérification du code'
    }, { status: 500 });
  }
}