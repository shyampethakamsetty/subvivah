import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

interface UserPhoto {
  id: string;
  url: string;
  isProfile: boolean;
}

interface UserWithPhotos {
  firstName: string;
  lastName: string;
  photos: UserPhoto[];
}

type MessageWithRelations = Prisma.MessageGetPayload<{
  include: {
    sender: {
      select: {
        firstName: true;
        lastName: true;
        photos: {
          where: { isProfile: true };
          take: 1;
        };
      };
    };
    receiver: {
      select: {
        firstName: true;
        lastName: true;
        photos: {
          where: { isProfile: true };
          take: 1;
        };
      };
    };
  };
}>;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const otherUserId = searchParams.get('otherUserId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      let messages;
      if (otherUserId) {
        // Get messages between two specific users
        messages = await prisma.message.findMany({
          where: {
            OR: [
              { senderId: userId, receiverId: otherUserId },
              { senderId: otherUserId, receiverId: userId }
            ]
          },
          include: {
            sender: {
              select: {
                firstName: true,
                lastName: true,
                photos: {
                  where: { isProfile: true },
                  take: 1
                }
              }
            },
            receiver: {
              select: {
                firstName: true,
                lastName: true,
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
      } else {
        // Get all conversations for the user
        const conversations = await prisma.message.findMany({
          where: {
            OR: [
              { senderId: userId },
              { receiverId: userId }
            ]
          },
          include: {
            sender: {
              select: {
                firstName: true,
                lastName: true,
                photos: {
                  where: { isProfile: true },
                  take: 1
                }
              }
            },
            receiver: {
              select: {
                firstName: true,
                lastName: true,
                photos: {
                  where: { isProfile: true },
                  take: 1
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        });

        // Group messages by conversation
        const conversationMap = new Map();
        conversations.forEach((message) => {
          const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
          if (!conversationMap.has(otherUserId)) {
            conversationMap.set(otherUserId, {
              user: message.senderId === userId ? message.receiver : message.sender,
              lastMessage: message,
              unreadCount: 0
            });
          }
          if (!message.isRead && message.receiverId === userId) {
            conversationMap.get(otherUserId).unreadCount++;
          }
        });

        messages = Array.from(conversationMap.values());
      }

      return new NextResponse(
        JSON.stringify(messages),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Database error:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Failed to fetch messages' }),
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

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { senderId, receiverId, content } = data;

    if (!senderId || !receiverId || !content) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate content length
    if (content.length > 1000) {
      return new NextResponse(
        JSON.stringify({ error: 'Message content too long. Maximum 1000 characters allowed.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate content type (no HTML or scripts)
    if (/<[^>]*>/.test(content)) {
      return new NextResponse(
        JSON.stringify({ error: 'HTML content is not allowed in messages' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      // Check if users can message each other
      const interest = await prisma.interest.findUnique({
        where: {
          senderId_receiverId: {
            senderId,
            receiverId
          }
        }
      });

      if (!interest || interest.status !== 'accepted') {
        return new NextResponse(
          JSON.stringify({ error: 'Cannot send message to this user' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const message = await prisma.message.create({
        data: {
          senderId,
          receiverId,
          content,
          isRead: false,
          iv: '', // Add empty IV for now - this should be properly generated in production
          sender: {
            connect: { id: senderId }
          },
          receiver: {
            connect: { id: receiverId }
          }
        },
        include: {
          sender: {
            select: {
              firstName: true,
              lastName: true,
              photos: {
                where: { isProfile: true },
                take: 1
              }
            }
          },
          receiver: {
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

      // Create notification for receiver
      await prisma.notification.create({
        data: {
          userId: receiverId,
          type: 'message',
          message: `New message from ${message.sender.firstName} ${message.sender.lastName}`
        }
      });

      return new NextResponse(
        JSON.stringify(message),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Database error:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Failed to send message' }),
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