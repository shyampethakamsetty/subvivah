import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    try {
      const horoscope = await prisma.horoscope.findUnique({
        where: { userId }
      });

      if (!horoscope) {
        return NextResponse.json(
          { error: 'Horoscope not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(horoscope);
    } catch (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch horoscope' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      userId,
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
      rashi,
      nakshatra,
      gotra,
      manglik
    } = data;

    if (!userId || !dateOfBirth) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    try {
      const horoscope = await prisma.horoscope.upsert({
        where: { userId },
        update: {
          dateOfBirth,
          timeOfBirth,
          placeOfBirth,
          rashi,
          nakshatra,
          gotra,
          manglik
        },
        create: {
          userId,
          dateOfBirth,
          timeOfBirth,
          placeOfBirth,
          rashi,
          nakshatra,
          gotra,
          manglik
        }
      });

      return NextResponse.json(horoscope);
    } catch (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to save horoscope' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 