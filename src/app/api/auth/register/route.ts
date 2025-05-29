import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      firstName,
      lastName,
      email,
      password,
      gender,
      dateOfBirth,
      // Profile data
      height,
      weight,
      maritalStatus,
      religion,
      caste,
      motherTongue,
      education,
      occupation,
      annualIncome,
      workLocation,
      fatherName,
      fatherOccupation,
      motherName,
      motherOccupation,
      siblings,
      // Horoscope data
      timeOfBirth,
      placeOfBirth,
      rashi,
      nakshatra,
      gothra,
      manglikStatus,
      // Preferences data
      preferredAge,
      preferredHeight,
      preferredEducation,
      preferredOccupation,
      preferredLocation,
    } = data;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !gender || !dateOfBirth) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with profile, horoscope, and preferences
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        gender,
        dob: new Date(dateOfBirth),
        isVerified: false,
        isActive: true,
        profile: {
          create: {
            height,
            weight,
            maritalStatus,
            religion,
            caste,
            motherTongue,
            education,
            occupation,
            annualIncome,
            workLocation,
            fatherName,
            fatherOccupation,
            motherName,
            motherOccupation,
            siblings,
          },
        },
        horoscope: {
          create: {
            dateOfBirth: new Date(dateOfBirth),
            timeOfBirth,
            placeOfBirth,
            rashi,
            nakshatra,
            gotra: gothra,
            manglik: manglikStatus,
          },
        },
        preferences: {
          create: {
            ageFrom: preferredAge?.split('-')[0] ? parseInt(preferredAge.split('-')[0]) : null,
            ageTo: preferredAge?.split('-')[1] ? parseInt(preferredAge.split('-')[1]) : null,
            heightFrom: preferredHeight?.split('-')[0] || null,
            heightTo: preferredHeight?.split('-')[1] || null,
            education: preferredEducation,
            occupation: preferredOccupation,
            location: preferredLocation,
          },
        },
      },
      include: {
        profile: true,
        horoscope: true,
        preferences: true,
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'Registration successful',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
} 