import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user's dating preferences
    const userPreferences = await prisma.datingPreference.findUnique({
      where: { userId },
    });

    if (!userPreferences) {
      return NextResponse.json(
        { error: 'User preferences not found' },
        { status: 404 }
      );
    }

    // Build search criteria based on preferences
    const whereClause = {
      age: {
        gte: userPreferences.minAge,
        lte: userPreferences.maxAge,
      },
      gender: userPreferences.gender,
      location: userPreferences.location,
      interests: {
        hasSome: userPreferences.interests,
      },
      NOT: {
        userId: userId, // Exclude current user
      },
    };

    // Get potential matches
    const [profiles, total] = await Promise.all([
      prisma.profile.findMany({
        where: whereClause,
        include: {
          photos: {
            where: { isProfilePhoto: true },
            take: 1,
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.profile.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      profiles,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching dating profiles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, restaurant, date, time } = body;

    if (!userId || !restaurant || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const booking = await prisma.restaurantBooking.create({
      data: {
        userId,
        restaurant,
        date: new Date(date),
        time,
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error creating restaurant booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 