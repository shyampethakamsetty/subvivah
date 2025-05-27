import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verify } from 'jsonwebtoken';

// Edit a message
export async function PUT(
  request: Request,
  { params }: { params: { messageId: string } }
) {
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

    const { content } = await request.json();
    const { messageId } = params;

    if (!content) {
      return new NextResponse('Content is required', { status: 400 });
    }

    // Check if the message exists and belongs to the user
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return new NextResponse('Message not found', { status: 404 });
    }

    if (message.senderId !== userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Update the message
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { content },
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

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error('Error updating message:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Delete a message
export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
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

    const { messageId } = params;

    // Check if the message exists and belongs to the user
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return new NextResponse('Message not found', { status: 404 });
    }

    if (message.senderId !== userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Delete the message
    await prisma.message.delete({
      where: { id: messageId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting message:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 