import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verify } from 'jsonwebtoken';

export async function PUT(request: NextRequest) {
  try {
    // Get the token from the cookie (same pattern as /api/auth/me)
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/token=([^;]+)/);
    const token = match ? match[1] : null;
    
    if (!token) {
      console.log('No token found in cookies');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { gender, confidence } = await request.json();

    if (!gender || typeof gender !== 'string') {
      return NextResponse.json({ error: 'Valid gender is required' }, { status: 400 });
    }

    // Validate gender value
    if (!['male', 'female'].includes(gender.toLowerCase())) {
      return NextResponse.json({ error: 'Gender must be either male or female' }, { status: 400 });
    }

    // Update user's gender in the database
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: { 
        gender: gender.toLowerCase(),
        updatedAt: new Date()
      },
    });

    console.log(`✅ Updated gender for user ${decoded.userId}: ${gender} (confidence: ${confidence})`);

    return NextResponse.json({ 
      success: true, 
      gender: updatedUser.gender,
      message: 'Gender updated successfully'
    });

  } catch (error) {
    console.error('Error updating gender:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 