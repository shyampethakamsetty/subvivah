import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verify } from 'jsonwebtoken';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Get the token from the cookie
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/token=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const userId = params.userId;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get profile with user details
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            gender: true,
            dob: true,
            email: true,
            phone: true
          }
        }
      }
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 