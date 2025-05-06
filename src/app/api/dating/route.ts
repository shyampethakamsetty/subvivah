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
    const userPreferences = await prisma.preferences.findUnique({
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
      AND: [
        {
          user: {
            dob: {
              gte: new Date(new Date().setFullYear(new Date().getFullYear() - (userPreferences.ageTo || 99))),
              lte: new Date(new Date().setFullYear(new Date().getFullYear() - (userPreferences.ageFrom || 18)))
            }
          }
        },
        userPreferences.maritalStatus ? { maritalStatus: userPreferences.maritalStatus } : {},
        userPreferences.religion ? { religion: userPreferences.religion } : {},
        userPreferences.caste ? { caste: userPreferences.caste } : {},
        userPreferences.education ? { education: userPreferences.education } : {},
        userPreferences.occupation ? { occupation: userPreferences.occupation } : {},
        userPreferences.location ? { workLocation: userPreferences.location } : {},
        {
          NOT: {
            userId: userId, // Exclude current user
          }
        }
      ]
    };

    // Get potential matches
    const [profiles, total] = await Promise.all([
      prisma.profile.findMany({
        where: whereClause,
        include: {
          user: {
            include: {
              photos: {
                where: { isProfile: true },
                take: 1
              }
            }
          }
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
    const { userId, restaurant, date, time, guests } = body;

    if (!userId || !restaurant || !date || !time || !guests) {
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
        guests,
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