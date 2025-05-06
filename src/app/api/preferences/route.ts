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
      const preferences = await prisma.preferences.findUnique({
        where: { userId }
      });

      if (!preferences) {
        return NextResponse.json(
          { error: 'Preferences not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(preferences);
    } catch (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch preferences' },
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
      ageFrom,
      ageTo,
      heightFrom,
      heightTo,
      maritalStatus,
      religion,
      caste,
      education,
      occupation,
      income,
      location
    } = data;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    try {
      const preferences = await prisma.preferences.upsert({
        where: { userId },
        update: {
          ageFrom,
          ageTo,
          heightFrom,
          heightTo,
          maritalStatus,
          religion,
          caste,
          education,
          occupation,
          income,
          location
        },
        create: {
          userId,
          ageFrom,
          ageTo,
          heightFrom,
          heightTo,
          maritalStatus,
          religion,
          caste,
          education,
          occupation,
          income,
          location
        }
      });

      return NextResponse.json(preferences);
    } catch (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to save preferences' },
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