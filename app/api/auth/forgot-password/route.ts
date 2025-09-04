import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'super-secret';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Ne pas révéler si l'email existe ou non
    return NextResponse.json({ success: true });
  }

  // Générer un token de réinitialisation
  const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' });

  // URL de réinitialisation
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;

  // TODO: envoyer le mail avec ton service d'email
  console.log(`Lien de réinitialisation : ${resetUrl}`);

  return NextResponse.json({ success: true });
}
