import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/db';
import { OAuth2Client } from 'google-auth-library';
import { clearCookieConfig } from '@/lib/auth';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(request: Request) {
  try {
    console.log('Starting logout process');
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    // If there's a token, try to get user info to check if it's a Google user
    if (token) {
      console.log('Found existing token, attempting to decode');
      try {
        const decoded = verify(token.value, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
        console.log('Token decoded successfully, fetching user:', decoded.userId);
        
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: { email: true, password: true }
        });

        // If user exists and has no password, they're a Google user
        if (user && !user.password) {
          console.log('Google user detected, attempting to revoke Google token');
          try {
            const googleToken = cookieStore.get('google_token');
            if (googleToken) {
              await googleClient.revokeToken(googleToken.value);
              console.log('Google token revoked successfully');
            }
          } catch (error) {
            console.error('Error revoking Google token:', error);
          }
        }
      } catch (error) {
        console.error('Error processing existing token:', error);
      }
    } else {
      console.log('No token found in cookies');
    }

    // Create response with cleared cookies
    const response = NextResponse.json({ success: true });
    
    // List of all auth-related cookies to clear
    const cookiesToClear = ['token', 'google_token', 'next-auth.session-token', 'next-auth.callback-url', 'next-auth.csrf-token'];
    
    console.log('Clearing cookies:', cookiesToClear);
    
    // Clear all auth-related cookies with standardized config
    cookiesToClear.forEach(cookieName => {
      if (cookieStore.has(cookieName)) {
        console.log(`Clearing cookie: ${cookieName}`);
        response.cookies.set(cookieName, '', clearCookieConfig);
      }
    });

    // Also clear cookies without domain to handle any legacy cookies
    const legacyConfig = { ...clearCookieConfig, domain: undefined };
    cookiesToClear.forEach(cookieName => {
      console.log(`Clearing legacy cookie: ${cookieName}`);
      response.cookies.set(cookieName, '', legacyConfig);
    });

    console.log('Logout process completed successfully');
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json(
      { error: 'Failed to logout', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 