import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const age = searchParams.get('age');
    const location = searchParams.get('location');
    const education = searchParams.get('education');
    const profession = searchParams.get('profession');
    const religion = searchParams.get('religion');
    const caste = searchParams.get('caste');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    try {
      const whereClause: any = {};

      if (age) {
        const [minAge, maxAge] = age.split('-').map(Number);
        whereClause.dateOfBirth = {
          gte: new Date(new Date().setFullYear(new Date().getFullYear() - maxAge)),
          lte: new Date(new Date().setFullYear(new Date().getFullYear() - minAge))
        };
      }

      if (location) whereClause.location = { contains: location, mode: 'insensitive' };
      if (education) whereClause.education = education;
      if (profession) whereClause.profession = profession;
      if (religion) whereClause.religion = religion;
      if (caste) whereClause.caste = caste;

      const profiles = await prisma.profile.findMany({
        where: whereClause,
        include: {
          photos: {
            where: { isProfile: true },
            take: 1
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      });

      const total = await prisma.profile.count({
        where: whereClause
      });

      return new NextResponse(
        JSON.stringify({
          profiles,
          total,
          page,
          totalPages: Math.ceil(total / limit)
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Database error:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Failed to fetch profiles' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 