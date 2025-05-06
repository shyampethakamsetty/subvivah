import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '@/lib/db';
import { sign } from 'jsonwebtoken';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 400 }
      );
    }

    const { email, name, picture, sub } = payload;

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (!user) {
      const [firstName, ...lastNameParts] = name?.split(' ') || ['', ''];
      const lastName = lastNameParts.join(' ');

      if (!email) {
        throw new Error('Email is required for user creation');
      }

      user = await prisma.user.create({
        data: {
          email,
          password: '', // You might want to handle this differently
          firstName,
          lastName,
          gender: '', // Required field, but we don't get it from Google
          dob: new Date(), // Required field, but we don't get it from Google
          isVerified: true, // Google verified
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
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified,
        profile: user.profile,
      },
    });

    response.cookies.set('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Google authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 