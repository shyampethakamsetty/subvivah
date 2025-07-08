import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { verify } from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('🔵 Starting AI personalization save...');
    
    // Try both authentication methods
    let userId: string | undefined;
    
    // 1. Try NextAuth session
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });
      if (user) {
        userId = user.id;
        console.log('✅ Authenticated via NextAuth session');
      }
    }
    
    // 2. Try JWT token if NextAuth failed
    if (!userId) {
      const cookie = request.headers.get('cookie') || '';
      const match = cookie.match(/token=([^;]+)/);
      const token = match ? match[1] : null;
      
      if (token) {
        try {
          const decoded: any = verify(token, process.env.JWT_SECRET || 'your-secret-key');
          userId = decoded.userId;
          console.log('✅ Authenticated via JWT token');
        } catch (error) {
          console.error('❌ JWT verification failed:', error);
        }
      }
    }

    if (!userId) {
      console.log('❌ No valid authentication found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('👤 User ID:', userId);

    const {
      shardAnswers,
      personalizedAnswers,
      profileSummary,
      isCompleted = false
    } = await request.json();

    console.log('📝 Received data:', {
      hasShardAnswers: !!shardAnswers,
      hasPersonalizedAnswers: !!personalizedAnswers,
      hasProfileSummary: !!profileSummary,
      isCompleted
    });

    // Extract shard answers into individual fields
    const shardData = {
      foodPreference: shardAnswers?.food_preference || null,
      sleepSchedule: shardAnswers?.sleep_schedule || null,
      socialPersonality: shardAnswers?.social_personality || null,
      religionSpirituality: shardAnswers?.religion_spirituality || null,
      relationshipType: shardAnswers?.relationship_type || null,
      careerPriority: shardAnswers?.career_priority || null,
      childrenPreference: shardAnswers?.children_preference || null,
      livingSetup: shardAnswers?.living_setup || null,
      relocationFlexibility: shardAnswers?.relocation_flexibility || null,
      marriageTimeline: shardAnswers?.marriage_timeline || null,
      relationshipIntent: shardAnswers?.relationship_intent || null,
    };

    console.log('🔄 Processed shard data:', shardData);

    try {
      // Upsert AI personalization data
      const aiPersonalization = await prisma.aIPersonalization.upsert({
        where: { userId },
        update: {
          ...shardData,
          personalizedAnswers: personalizedAnswers || null,
          profileSummary: profileSummary || null,
          isCompleted,
          completedAt: isCompleted ? new Date() : null,
          updatedAt: new Date(),
        },
        create: {
          userId,
          ...shardData,
          personalizedAnswers: personalizedAnswers || null,
          profileSummary: profileSummary || null,
          isCompleted,
          completedAt: isCompleted ? new Date() : null,
        },
      });

      console.log('✅ Successfully saved AI personalization:', {
        id: aiPersonalization.id,
        userId: aiPersonalization.userId,
        isCompleted: aiPersonalization.isCompleted
      });

      return NextResponse.json({ 
        success: true, 
        data: aiPersonalization 
      });

    } catch (dbError) {
      console.error('❌ Database error:', dbError);
      throw dbError;
    }

  } catch (error) {
    console.error('❌ Error saving AI personalization:', error);
    return NextResponse.json(
      { 
        error: 'Failed to save personalization data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔵 Starting AI personalization fetch...');
    
    // Try both authentication methods
    let userId: string | undefined;
    
    // 1. Try NextAuth session
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });
      if (user) {
        userId = user.id;
        console.log('✅ Authenticated via NextAuth session');
      }
    }
    
    // 2. Try JWT token if NextAuth failed
    if (!userId) {
      const cookie = request.headers.get('cookie') || '';
      const match = cookie.match(/token=([^;]+)/);
      const token = match ? match[1] : null;
      
      if (token) {
        try {
          const decoded: any = verify(token, process.env.JWT_SECRET || 'your-secret-key');
          userId = decoded.userId;
          console.log('✅ Authenticated via JWT token');
        } catch (error) {
          console.error('❌ JWT verification failed:', error);
        }
      }
    }

    if (!userId) {
      console.log('❌ No valid authentication found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('👤 User ID:', userId);

    const aiPersonalization = await prisma.aIPersonalization.findUnique({
      where: { userId }
    });

    console.log('✅ Successfully fetched AI personalization:', {
      found: !!aiPersonalization,
      isCompleted: aiPersonalization?.isCompleted
    });

    return NextResponse.json({ 
      success: true, 
      data: aiPersonalization 
    });

  } catch (error) {
    console.error('❌ Error fetching AI personalization:', error);
    return NextResponse.json(
      { error: 'Failed to fetch personalization data' },
      { status: 500 }
    );
  }
} 