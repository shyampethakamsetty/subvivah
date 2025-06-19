import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verify } from 'jsonwebtoken';

interface ProfileFilter {
  height?: { gte?: string; lte?: string };
  maritalStatus?: { equals: string; mode: 'insensitive' };
  religion?: { equals: string; mode: 'insensitive' };
  caste?: { equals: string; mode: 'insensitive' };
  motherTongue?: { equals: string; mode: 'insensitive' };
  education?: { equals: string; mode: 'insensitive' };
  occupation?: { equals: string; mode: 'insensitive' };
  annualIncome?: { equals: string; mode: 'insensitive' };
  workLocation?: { equals: string; mode: 'insensitive' };
}

interface UserFilter {
  AND: Array<{
    id?: { not: string };
    dob?: { lte: Date; gte: Date };
    profile?: { AND?: ProfileFilter[]; isNot?: null };
  }>;
}

interface UserWithRelations {
  id: string;
  firstName: string;
  lastName: string;
  dob: Date;
  profile: {
    height: string | null;
    maritalStatus: string | null;
    religion: string | null;
    caste: string | null;
    motherTongue: string | null;
    education: string | null;
    occupation: string | null;
    annualIncome: string | null;
    workLocation: string | null;
  } | null;
  photos: Array<{ url: string }>;
}

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Get the current user's ID from the token
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/token=([^;]+)/);
    const token = match ? match[1] : null;
    
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    
    // Get all search parameters
    const ageMin = parseInt(searchParams.get('ageMin') || '18');
    const ageMax = parseInt(searchParams.get('ageMax') || '70');
    const heightMin = searchParams.get('heightMin') || '';
    const heightMax = searchParams.get('heightMax') || '';
    const maritalStatus = searchParams.get('maritalStatus');
    const religion = searchParams.get('religion');
    const caste = searchParams.get('caste');
    const motherTongue = searchParams.get('motherTongue');
    const education = searchParams.get('education');
    const occupation = searchParams.get('occupation');
    const annualIncome = searchParams.get('annualIncome');
    const workLocation = searchParams.get('workLocation');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Calculate age range dates
    const today = new Date();
    const maxBirthDate = new Date(today.getFullYear() - ageMin, today.getMonth(), today.getDate());
    const minBirthDate = new Date(today.getFullYear() - ageMax, today.getMonth(), today.getDate());

    // Build where clause with more lenient filtering
    const where: UserFilter = {
      AND: [
        // Basic user filters
        {
          id: {
            not: decoded.userId // Exclude current user
          }
        },
        {
          dob: {
            lte: maxBirthDate,
            gte: minBirthDate
          }
        }
      ]
    };

    // Add optional filters only if they are provided
    const profileFilters: ProfileFilter[] = [];

    // Add height range filters
    if (heightMin) {
      profileFilters.push({
        height: {
          gte: heightMin.toString()
        }
      });
    }
    if (heightMax) {
      profileFilters.push({
        height: {
          lte: heightMax.toString()
        }
      });
    }

    // Add exact match filters with case insensitivity
    if (maritalStatus) {
      profileFilters.push({
        maritalStatus: {
          equals: maritalStatus,
          mode: 'insensitive'
        }
      });
    }
    if (religion) {
      profileFilters.push({
        religion: {
          equals: religion,
          mode: 'insensitive'
        }
      });
    }
    if (caste) {
      profileFilters.push({
        caste: {
          equals: caste,
          mode: 'insensitive'
        }
      });
    }
    if (motherTongue) {
      profileFilters.push({
        motherTongue: {
          equals: motherTongue,
          mode: 'insensitive'
        }
      });
    }
    if (education) {
      profileFilters.push({
        education: {
          equals: education,
          mode: 'insensitive'
        }
      });
    }
    if (occupation) {
      profileFilters.push({
        occupation: {
          equals: occupation,
          mode: 'insensitive'
        }
      });
    }
    if (annualIncome) {
      profileFilters.push({
        annualIncome: {
          equals: annualIncome,
          mode: 'insensitive'
        }
      });
    }
    if (workLocation) {
      profileFilters.push({
        workLocation: {
          equals: workLocation,
          mode: 'insensitive'
        }
      });
    }

    // Add profile filters if any exist
    if (profileFilters.length > 0) {
      where.AND.push({
        profile: {
          AND: profileFilters
        }
      });
    } else {
      // If no profile filters, just ensure profile exists
      where.AND.push({
        profile: {
          isNot: null
        }
      });
    }

    // Get total count for pagination
    const total = await prisma.user.count({ where });

    // Get paginated results
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        dob: true,
        profile: {
          select: {
            height: true,
            maritalStatus: true,
            religion: true,
            caste: true,
            motherTongue: true,
            education: true,
            occupation: true,
            annualIncome: true,
            workLocation: true
          }
        },
        photos: {
          where: {
            isProfile: true
          },
          select: {
            url: true
          },
          take: 1
        }
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the response
    const transformedUsers = users.map((user: UserWithRelations) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      age: Math.floor((new Date().getTime() - new Date(user.dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25)),
      height: user.profile?.height || null,
      maritalStatus: user.profile?.maritalStatus || null,
      religion: user.profile?.religion || null,
      caste: user.profile?.caste || null,
      motherTongue: user.profile?.motherTongue || null,
      education: user.profile?.education || null,
      occupation: user.profile?.occupation || null,
      annualIncome: user.profile?.annualIncome || null,
      workLocation: user.profile?.workLocation || null,
      photo: user.photos[0]?.url || null
    }));

    return NextResponse.json({
      users: transformedUsers,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Failed to search profiles' }, { status: 500 });
  }
}
