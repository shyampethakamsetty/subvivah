import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verify } from 'jsonwebtoken';

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

    // Get all messages for the user
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photos: {
              select: {
                url: true,
              },
            },
          },
        },
        receiver: {
          select: {
            id: true,
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
        createdAt: 'desc',
      },
    });

    // Group messages by conversation
    const conversationMap = new Map();
    messages.forEach((message) => {
      const otherUser = message.senderId === userId ? message.receiver : message.sender;
      const conversationId = otherUser.id;

      if (!conversationMap.has(conversationId)) {
        conversationMap.set(conversationId, {
          id: conversationId,
          userId: conversationId,
          firstName: otherUser.firstName,
          lastName: otherUser.lastName,
          lastMessage: message.content,
          lastMessageTime: message.createdAt,
          unreadCount: 0,
          photo: otherUser.photos[0]?.url || '/default-avatar.png',
        });
      }

      // Update unread count
      if (!message.isRead && message.receiverId === userId) {
        const conversation = conversationMap.get(conversationId);
        conversation.unreadCount++;
        conversationMap.set(conversationId, conversation);
      }
    });

    const conversations = Array.from(conversationMap.values());

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 