import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      shardAnswers,
      personalizedAnswers,
      profileSummary,
      isCompleted = false
    } = await request.json();

    // Get user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

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

    // Upsert AI personalization data
    const aiPersonalization = await prisma.aIPersonalization.upsert({
      where: { userId: user.id },
      update: {
        ...shardData,
        personalizedAnswers: personalizedAnswers || null,
        profileSummary: profileSummary || null,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        ...shardData,
        personalizedAnswers: personalizedAnswers || null,
        profileSummary: profileSummary || null,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    return NextResponse.json({ 
      success: true, 
      data: aiPersonalization 
    });

  } catch (error) {
    console.error('Error saving AI personalization:', error);
    return NextResponse.json(
      { error: 'Failed to save personalization data' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const aiPersonalization = await prisma.aIPersonalization.findUnique({
      where: { userId: user.id }
    });

    return NextResponse.json({ 
      success: true, 
      data: aiPersonalization 
    });

  } catch (error) {
    console.error('Error fetching AI personalization:', error);
    return NextResponse.json(
      { error: 'Failed to fetch personalization data' },
      { status: 500 }
    );
  }
} 