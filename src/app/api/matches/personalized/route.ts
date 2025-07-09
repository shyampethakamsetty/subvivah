import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    // Get the token from the cookie
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/token=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify token
    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const userId = decoded.userId;

    // Get current user's personalization data
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        gender: true,
        photos: true,
        aiPersonalization: {
          select: {
            foodPreference: true,
            sleepSchedule: true,
            socialPersonality: true,
            religionSpirituality: true,
            relationshipType: true,
            careerPriority: true,
            childrenPreference: true,
            livingSetup: true,
            relocationFlexibility: true,
            marriageTimeline: true,
            relationshipIntent: true,
            isCompleted: true
          }
        }
      }
    });

    if (!currentUser?.aiPersonalization?.isCompleted) {
      return NextResponse.json(
        { error: 'Personalization not completed' },
        { status: 400 }
      );
    }

    // Get potential matches
    const potentialMatches = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: userId } },
          { isActive: true },
          { isVerified: true },
          {
            aiPersonalization: {
              isCompleted: true
            }
          }
        ]
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        photos: true,
        aiPersonalization: {
          select: {
            foodPreference: true,
            sleepSchedule: true,
            socialPersonality: true,
            religionSpirituality: true,
            relationshipType: true,
            careerPriority: true,
            childrenPreference: true,
            livingSetup: true,
            relocationFlexibility: true,
            marriageTimeline: true,
            relationshipIntent: true
          }
        }
      },
      take: 100 // Limit initial fetch to 100 profiles
    });

    // Calculate matches
    const matches = potentialMatches
      .filter(match => match.aiPersonalization) // Ensure aiPersonalization exists
      .map(match => {
        const matchScore = calculateMatchScore(
          currentUser.aiPersonalization!,
          match.aiPersonalization!
        );

        const matchingCriteria = getMatchingCriteria(
          currentUser.aiPersonalization!,
          match.aiPersonalization!
        );

        return {
          id: match.id,
          user: {
            firstName: match.firstName,
            lastName: match.lastName,
            photos: match.photos || []
          },
          matchScore,
          matchingCriteria
        };
      })
      .filter(match => match.matchScore >= 50)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 20);

    return NextResponse.json(matches);
  } catch (error) {
    console.error('Error fetching personalized matches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch matches', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function calculateMatchScore(user1: any, user2: any): number {
  let totalScore = 0;
  let totalWeight = 0;

  const fields = {
    foodPreference: 1,
    sleepSchedule: 1,
    socialPersonality: 2,
    religionSpirituality: 3,
    relationshipType: 3,
    careerPriority: 2,
    childrenPreference: 3,
    livingSetup: 2,
    relocationFlexibility: 2,
    marriageTimeline: 3,
    relationshipIntent: 3
  };

  for (const [field, weight] of Object.entries(fields)) {
    if (user1[field] && user2[field]) {
      if (user1[field] === user2[field]) {
        totalScore += weight;
      } else if (areCompatibleAnswers(field, user1[field], user2[field])) {
        totalScore += weight * 0.5;
      }
      totalWeight += weight;
    }
  }

  // Prevent division by zero
  if (totalWeight === 0) return 0;
  return Math.round((totalScore / totalWeight) * 100);
}

function getMatchingCriteria(user1: any, user2: any): string[] {
  const criteria: string[] = [];
  
  if (user1.foodPreference === user2.foodPreference) {
    criteria.push('Similar Food Preferences');
  }
  if (user1.sleepSchedule === user2.sleepSchedule) {
    criteria.push('Similar Sleep Schedule');
  }
  if (user1.socialPersonality === user2.socialPersonality) {
    criteria.push('Matching Social Style');
  }
  if (user1.religionSpirituality === user2.religionSpirituality) {
    criteria.push('Spiritual Alignment');
  }
  if (user1.relationshipType === user2.relationshipType) {
    criteria.push('Relationship Goals Match');
  }
  if (user1.careerPriority === user2.careerPriority) {
    criteria.push('Career Priority Match');
  }
  if (user1.childrenPreference === user2.childrenPreference) {
    criteria.push('Family Planning Match');
  }
  if (user1.livingSetup === user2.livingSetup) {
    criteria.push('Living Setup Match');
  }
  if (user1.marriageTimeline === user2.marriageTimeline) {
    criteria.push('Marriage Timeline Match');
  }

  return criteria;
}

function areCompatibleAnswers(field: string, value1: string, value2: string): boolean {
  const compatibilityRules: Record<string, string[][]> = {
    socialPersonality: [
      ['extrovert', 'ambivert'],
      ['introvert', 'ambivert']
    ],
    sleepSchedule: [
      ['early_bird', 'flexible'],
      ['night_owl', 'flexible']
    ],
    relocationFlexibility: [
      ['willing', 'conditional'],
      ['not_willing', 'conditional']
    ],
    marriageTimeline: [
      ['0-6_months', '6-12_months'],
      ['1-2_years', '2-3_years']
    ]
  };

  if (compatibilityRules[field]) {
    return compatibilityRules[field].some(pair => 
      (pair.includes(value1) && pair.includes(value2))
    );
  }

  return value1 === value2;
} 