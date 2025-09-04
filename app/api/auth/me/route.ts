import { NextRequest, NextResponse } from "next/server";
import { authOptions } from '@/auth';
import { getServerSession } from 'next-auth/next';
import type { Session } from 'next-auth';

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session?.user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ 
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role || 'user'
      } 
    });
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
