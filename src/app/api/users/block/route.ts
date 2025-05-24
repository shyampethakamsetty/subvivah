import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await request.json();
    const { userId, reason } = data;
    const blockerId = session.user.id;

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if block already exists
    const existingBlock = await prisma.userBlock.findUnique({
      where: {
        blockedById_blockedUserId: {
          blockedById: blockerId,
          blockedUserId: userId
        }
      }
    });

    if (existingBlock) {
      return new NextResponse(
        JSON.stringify({ error: 'User is already blocked' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create block
    const block = await prisma.userBlock.create({
      data: {
        blockedById: blockerId,
        blockedUserId: userId,
        reason
      }
    });

    return new NextResponse(
      JSON.stringify(block),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('API error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const blockerId = session.user.id;

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Delete block
    await prisma.userBlock.delete({
      where: {
        blockedById_blockedUserId: {
          blockedById: blockerId,
          blockedUserId: userId
        }
      }
    });

    return new NextResponse(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('API error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userId = session.user.id;

    // Get all blocked users
    const blocks = await prisma.userBlock.findMany({
      where: {
        blockedById: userId
      },
      include: {
        blockedUser: {
          select: {
            firstName: true,
            lastName: true,
            photos: {
              where: { isProfile: true },
              take: 1
            }
          }
        }
      }
    });

    return new NextResponse(
      JSON.stringify(blocks),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('API error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 