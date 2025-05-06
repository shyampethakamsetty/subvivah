import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sign } from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { accessToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token is required' },
        { status: 400 }
      );
    }

    // Verify Facebook token
    const response = await fetch(
      `https://graph.facebook.com/v12.0/me?fields=id,name,email,picture&access_token=${accessToken}`
    );
    const data = await response.json();

    if (!data.id) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 400 }
      );
    }

    const { email, name, picture } = data;

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      const [firstName, ...lastNameParts] = name?.split(' ') || ['', ''];
      const lastName = lastNameParts.join(' ');
      
      user = await prisma.user.create({
        data: {
          email,
          password: '', // You might want to handle this differently
          firstName,
          lastName,
          gender: '', // Required field, but we don't get it from Facebook
          dob: new Date(), // Required field, but we don't get it from Facebook
          isVerified: true, // Facebook verified
          profile: {
            create: {
              // Create an empty profile as required by the schema
            }
          }
        },
        include: { profile: true }
      });
    }

    // Create JWT token
    const jwtToken = sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Set cookie
    const res = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified,
        profile: user.profile,
      },
    });

    res.cookies.set('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return res;
  } catch (error) {
    console.error('Facebook authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 