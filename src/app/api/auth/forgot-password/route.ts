import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { signJwt } from '@/lib/jwt';
import nodemailer from 'nodemailer';

// Create transporter only if email configuration is available
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;
  
  if (!emailUser || !emailPassword) {
    console.warn('⚠️ Email configuration not found. EMAIL_USER and EMAIL_PASSWORD must be set for password reset emails.');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });
};

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({ 
        message: 'If an account with this email exists, a password reset link has been sent.' 
      });
    }

    // Generate reset token
    const resetToken = signJwt({ userId: user.id, email }, { expiresIn: '1h' });

    // Save reset token to database
    await prisma.verificationToken.create({
      data: {
        token: resetToken,
        email,
        expiresAt: new Date(Date.now() + 3600000), // 1 hour
      },
    });

    // Check if email configuration is available
    const transporter = createTransporter();
    
    if (!transporter) {
      // If email is not configured, return success but log the token for development
      console.log('📧 Password reset token generated (email not configured):', resetToken);
      console.log('📧 Reset URL would be:', `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`);
      
      return NextResponse.json({ 
        message: 'If an account with this email exists, a password reset link has been sent.',
        note: 'Email configuration not set up. Check console for reset token in development.'
      });
    }

    // Send reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset your password - शुभ विवाह',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">शुभ विवाह</h1>
            <p style="color: white; margin: 10px 0 0 0;">Password Reset Request</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${user.firstName},</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              We received a request to reset your password for your शुभ विवाह account. 
              If you didn't make this request, you can safely ignore this email.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        display: inline-block;
                        font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              This link will expire in 1 hour for security reasons.
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              If the button doesn't work, you can copy and paste this link into your browser:
            </p>
            
            <p style="color: #667eea; word-break: break-all; font-size: 14px;">
              ${resetUrl}
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              This is an automated email from शुभ विवाह. Please do not reply to this email.
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ 
      message: 'If an account with this email exists, a password reset link has been sent.' 
    });
  } catch (error) {
    console.error('Error in forgot-password:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('JWT')) {
        return NextResponse.json(
          { error: 'Authentication service temporarily unavailable. Please try again later.' },
          { status: 500 }
        );
      }
      if (error.message.includes('email') || error.message.includes('mail')) {
        return NextResponse.json(
          { error: 'Email service temporarily unavailable. Please try again later.' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to process password reset request. Please try again later.' },
      { status: 500 }
    );
  }
} 