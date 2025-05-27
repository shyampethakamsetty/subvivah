import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verify } from 'jsonwebtoken';
import crypto from 'crypto';

interface Message {
  senderId: string;
  receiverId: string;
  isRead: boolean;
  sender: any; // Replace 'any' with a more specific type if available
  receiver: any; // Replace 'any' with a more specific type if available
}

// Get messages between two users
export async function GET(request: Request) {
  try {
    // Get the token from the cookie
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/token=([^;]+)/);
    const token = match ? match[1] : null;
    
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Verify token and get user ID
    let userId: string;
    try {
      const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
      userId = decoded.userId;
    } catch {
      return new NextResponse('Invalid token', { status: 401 });
    }

    // Get the other user's ID from query params
    const { searchParams } = new URL(request.url);
    const otherUserId = searchParams.get('userId');

    if (!otherUserId) {
      return new NextResponse('User ID is required', { status: 400 });
    }

    // Fetch messages between the two users
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            AND: [
              { senderId: userId },
              { receiverId: otherUserId },
            ],
          },
          {
            AND: [
              { senderId: otherUserId },
              { receiverId: userId },
            ],
          },
        ],
      },
      include: {
        sender: {
          select: {
            firstName: true,
            lastName: true,
            photos: {
              select: {
                url: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Mark unread messages as read
    await prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({ messages, currentUserId: userId });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Send a new message
export async function POST(request: Request) {
  try {
    // Get the token from the cookie
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/token=([^;]+)/);
    const token = match ? match[1] : null;
    
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Verify token and get user ID
    let userId: string;
    try {
      const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
      userId = decoded.userId;
    } catch {
      return new NextResponse('Invalid token', { status: 401 });
    }

    const { receiverId, content } = await request.json();

    if (!receiverId || !content) {
      return new NextResponse('Receiver ID and content are required', { status: 400 });
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        content,
        senderId: userId,
        receiverId,
        isRead: false,
        iv: crypto.randomBytes(16).toString('hex'), // Generate a random IV
      },
      include: {
        sender: {
          select: {
            firstName: true,
            lastName: true,
            photos: {
              select: {
                url: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error sending message:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { messageIds } = data;

    if (!messageIds || !Array.isArray(messageIds)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid message IDs' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      await prisma.message.updateMany({
        where: {
          id: {
            in: messageIds
          }
        },
        data: {
          isRead: true
        }
      });

      return new NextResponse(
        JSON.stringify({ success: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Database error:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Failed to mark messages as read' }),
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