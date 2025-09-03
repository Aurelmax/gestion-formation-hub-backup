import { NextRequest, NextResponse } from "next/server";
import { authOptions } from '@/app/auth';
import { getServerSession } from 'next-auth/next';

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
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
