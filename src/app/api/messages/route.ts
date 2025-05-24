import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MessageSecurityService } from '@/lib/services/messageSecurityService';

interface Message {
  senderId: string;
  receiverId: string;
  isRead: boolean;
  sender: any; // Replace 'any' with a more specific type if available
  receiver: any; // Replace 'any' with a more specific type if available
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

    const { searchParams } = new URL(request.url);
    const otherUserId = searchParams.get('otherUserId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const userId = session.user.id;

    try {
      // Check if user is blocked
      if (otherUserId) {
        const canInteract = await MessageSecurityService.canInteract(userId, otherUserId);
        if (!canInteract) {
          return new NextResponse(
            JSON.stringify({ error: 'Cannot interact with this user' }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }

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

        // Decrypt messages
        messages = await Promise.all(messages.map(async (message) => {
          if (message.content && message.iv) {
            message.content = await MessageSecurityService.decryptMessage(message.content, message.iv);
          }
          return message;
        }));

        const totalCount = await prisma.message.count({
          where: {
            OR: [
              { senderId: userId, receiverId: otherUserId },
              { senderId: otherUserId, receiverId: userId }
            ]
          }
        });

        return new NextResponse(
          JSON.stringify({
            messages,
            hasMore: (page * limit) < totalCount
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
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
        for (const message of conversations) {
          const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
          
          // Skip blocked users
          const canInteract = await MessageSecurityService.canInteract(userId, otherUserId);
          if (!canInteract) continue;

          if (!conversationMap.has(otherUserId)) {
            // Decrypt last message
            if (message.content && message.iv) {
              message.content = await MessageSecurityService.decryptMessage(message.content, message.iv);
            }

            conversationMap.set(otherUserId, {
              user: message.senderId === userId ? message.receiver : message.sender,
              lastMessage: message,
              unreadCount: 0
            });
          }
          if (!message.isRead && message.receiverId === userId) {
            conversationMap.get(otherUserId).unreadCount++;
          }
        }

        messages = Array.from(conversationMap.values());
      }

      return new NextResponse(
        JSON.stringify({ conversations: messages }),
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
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await request.json();
    const { receiverId, content } = data;
    const senderId = session.user.id;

    if (!receiverId || !content) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      // Check if user is blocked
      const canInteract = await MessageSecurityService.canInteract(senderId, receiverId);
      if (!canInteract) {
        return new NextResponse(
          JSON.stringify({ error: 'Cannot send message to this user' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Check rate limit
      const withinLimit = await MessageSecurityService.checkRateLimit(senderId, 'message');
      if (!withinLimit) {
        return new NextResponse(
          JSON.stringify({ error: 'Message limit exceeded. Please try again later.' }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Check for spam
      const isSpam = await MessageSecurityService.isSpam(senderId, content);
      if (isSpam) {
        return new NextResponse(
          JSON.stringify({ error: 'Message detected as spam' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Encrypt message
      const { encryptedText, iv } = await MessageSecurityService.encryptMessage(content);

      const message = await prisma.message.create({
        data: {
          senderId,
          receiverId,
          content: encryptedText,
          iv
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

      // Decrypt message for response
      message.content = content;

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
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

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
          },
          receiverId: session.user.id // Only mark messages as read if user is the receiver
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
        JSON.stringify({ error: 'Failed to update messages' }),
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