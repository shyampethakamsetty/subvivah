import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '@/lib/db';
import { sign } from 'jsonwebtoken';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      console.log('No token provided in request');
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    console.log('Verifying Google token...');
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      console.log('Invalid token payload');
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 400 }
      );
    }

    const { email, name, picture, sub } = payload;

    if (!email) {
      console.log('No email in token payload');
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('Finding or creating user for email:', email);
    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log('Creating new user for email:', email);
      user = await prisma.user.create({
        data: {
          email,
          firstName: name?.split(' ')[0] || '',
          lastName: name?.split(' ').slice(1).join(' ') || '',
          gender: 'Not Specified', // Default value
          dob: new Date(), // Default value
          password: '', // Empty password for OAuth users
          profile: {
            create: {
              // Profile fields are optional, so we don't need to set them
            }
          }
        },
      });
    }

    console.log('Creating JWT token for user:', user.id);
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
      },
    });

    console.log('Setting authentication cookies');
    // Set JWT token cookie
    response.cookies.set('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain: process.env.NODE_ENV === 'production' ? '.subvivah.com' : undefined,
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // Store Google token for later revocation
    response.cookies.set('google_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain: process.env.NODE_ENV === 'production' ? '.subvivah.com' : undefined,
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Google authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 