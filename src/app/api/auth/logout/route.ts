import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/db';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    // If there's a token, try to get user info to check if it's a Google user
    if (token) {
      try {
        const decoded = verify(token.value, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: { email: true, password: true }
        });

        // If user exists and has no password, they're a Google user
        if (user && !user.password) {
          try {
            // Attempt to revoke any existing Google tokens
            const googleToken = cookieStore.get('google_token');
            if (googleToken) {
              await googleClient.revokeToken(googleToken.value);
              cookieStore.delete('google_token');
            }
          } catch (error) {
            console.error('Error revoking Google token:', error);
            // Continue with logout even if Google token revocation fails
          }
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        // Continue with logout even if token decoding fails
      }
    }

    // Clear all auth-related cookies
    cookieStore.delete('token');
    cookieStore.delete('google_token');
    
    // Send response with cleared cookies
    const response = NextResponse.json({ success: true });
    
    // Ensure cookies are properly cleared in the response with the same options
    const cookieOptions = {
      domain: process.env.NODE_ENV === 'production' ? '.subvivah.com' : undefined,
      path: '/',
      maxAge: 0
    };

    response.cookies.set('token', '', cookieOptions);
    response.cookies.set('google_token', '', cookieOptions);

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
} 