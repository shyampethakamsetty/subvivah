import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

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
      let hasFilters = false;

      if (age) {
        const [minAge, maxAge] = age.split('-').map(Number);
        whereClause.dateOfBirth = {
          gte: new Date(new Date().setFullYear(new Date().getFullYear() - maxAge)),
          lte: new Date(new Date().setFullYear(new Date().getFullYear() - minAge))
        };
        hasFilters = true;
      }

      // Map frontend education values to DB values
      const educationMap: Record<string, string> = {
        high_school: 'High School',
        bachelors: "Bachelor's Degree",
        masters: "Master's Degree",
        phd: 'PhD',
      };
      let mappedEducation = education && educationMap[education] ? educationMap[education] : education;

      if (location) {
        whereClause.location = { contains: location, mode: 'insensitive' };
        hasFilters = true;
      }
      if (mappedEducation) {
        whereClause.education = { contains: mappedEducation, mode: 'insensitive' };
        hasFilters = true;
      }
      if (profession) {
        whereClause.profession = { contains: profession, mode: 'insensitive' };
        hasFilters = true;
      }
      if (religion) {
        whereClause.religion = { equals: religion, mode: 'insensitive' };
        hasFilters = true;
      }
      if (caste) {
        whereClause.caste = { contains: caste, mode: 'insensitive' };
        hasFilters = true;
      }

      // If no filters are applied, return empty result
      if (!hasFilters) {
        return new NextResponse(
          JSON.stringify({
            profiles: [],
            total: 0,
            page,
            totalPages: 0
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Log the where clause for debugging
      console.log('Search query:', whereClause);

      const profiles = await prisma.profile.findMany({
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
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      });

      // Log the number of profiles found
      console.log('Number of profiles found:', profiles.length);

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