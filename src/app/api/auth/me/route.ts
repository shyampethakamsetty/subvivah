import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verify } from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Get the token from the cookie
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/token=([^;]+)/);
    const token = match ? match[1] : null;
    
    if (!token) {
      console.log('No token found in cookies');
      return NextResponse.json({ isAuthenticated: false });
    }

    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || '', {
        algorithms: ['HS256']
      });
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ isAuthenticated: false });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        profile: true,
        photos: true,
        horoscope: true,
        preferences: true,
      },
    });

    if (!user) {
      console.log('User not found for ID:', decoded.userId);
      return NextResponse.json({ isAuthenticated: false });
    }

    const { password, ...userWithoutPassword } = user;
    return NextResponse.json({ 
      isAuthenticated: true,
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json({ 
      isAuthenticated: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
} 