import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verify } from 'jsonwebtoken';

interface AIPersonalizationData {
  // Basic Info
  fullName?: string;
  dateOfBirth?: string;
  location?: string;
  
  // Education
  education?: string;
  fieldOfStudy?: string;
  graduationYear?: string;
  
  // Work Experience
  occupation?: string;
  company?: string;
  workLocation?: string;
  experience?: string;
  annualIncome?: string;
  
  // Family
  fatherName?: string;
  fatherOccupation?: string;
  motherName?: string;
  motherOccupation?: string;
  siblings?: string;
  familyType?: string;
  familyStatus?: string;
  
  // Preferences
  ageFrom?: number;
  ageTo?: number;
  heightFrom?: string;
  heightTo?: string;
  preferredEducation?: string;
  preferredOccupation?: string;
  preferredLocation?: string;
  preferredIncome?: string;
  maritalStatus?: string;
  religion?: string;
  caste?: string;
  
  // Horoscope
  timeOfBirth?: string;
  placeOfBirth?: string;
  rashi?: string;
  nakshatra?: string;
  gotra?: string;
  manglik?: string;
  
  // AI Generated
  aiSummary?: string;
  personalityTraits?: string[];
  interests?: string[];
}

export async function POST(request: NextRequest) {
  try {
    // Get the token from the cookie
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/token=([^;]+)/);
    const token = match ? match[1] : null;
    
    if (!token) {
      console.log('No token found in cookies');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data: AIPersonalizationData = await request.json();

    // Start a transaction to save all data atomically
    const result = await prisma.$transaction(async (tx) => {
      const userId = decoded.userId;
      
      // 1. Update User basic info if provided
      const userUpdateData: any = {};
      if (data.fullName) {
        const nameParts = data.fullName.trim().split(' ');
        userUpdateData.firstName = nameParts[0];
        userUpdateData.lastName = nameParts.slice(1).join(' ') || nameParts[0];
      }
      if (data.dateOfBirth) {
        userUpdateData.dob = new Date(data.dateOfBirth);
      }

      if (Object.keys(userUpdateData).length > 0) {
        await tx.user.update({
          where: { id: userId },
          data: userUpdateData,
        });
      }

      // 2. Create/Update Profile
      const profileData: any = {};
      if (data.education) profileData.education = data.education;
      if (data.occupation) profileData.occupation = data.occupation;
      if (data.annualIncome) profileData.annualIncome = data.annualIncome;
      if (data.workLocation) profileData.workLocation = data.workLocation;
      if (data.fatherName) profileData.fatherName = data.fatherName;
      if (data.fatherOccupation) profileData.fatherOccupation = data.fatherOccupation;
      if (data.motherName) profileData.motherName = data.motherName;
      if (data.motherOccupation) profileData.motherOccupation = data.motherOccupation;
      if (data.siblings) profileData.siblings = data.siblings;
      if (data.familyType) profileData.familyType = data.familyType;
      if (data.familyStatus) profileData.familyStatus = data.familyStatus;
      if (data.aiSummary) profileData.aboutMe = data.aiSummary;
      if (data.interests && data.interests.length > 0) {
        profileData.hobbies = data.interests.join(', ');
      }
      if (data.maritalStatus) profileData.maritalStatus = data.maritalStatus;
      if (data.religion) profileData.religion = data.religion;
      if (data.caste) profileData.caste = data.caste;

      let profile = null;
      if (Object.keys(profileData).length > 0) {
        profile = await tx.profile.upsert({
          where: { userId },
          update: profileData,
          create: {
            userId,
            ...profileData,
          },
        });
      }

      // 3. Create/Update Horoscope
      const horoscopeData: any = {};
      if (data.dateOfBirth) horoscopeData.dateOfBirth = new Date(data.dateOfBirth);
      if (data.timeOfBirth) horoscopeData.timeOfBirth = data.timeOfBirth;
      if (data.placeOfBirth) horoscopeData.placeOfBirth = data.placeOfBirth;
      if (data.rashi) horoscopeData.rashi = data.rashi;
      if (data.nakshatra) horoscopeData.nakshatra = data.nakshatra;
      if (data.gotra) horoscopeData.gotra = data.gotra;
      if (data.manglik) horoscopeData.manglik = data.manglik;

      let horoscope = null;
      if (Object.keys(horoscopeData).length > 0) {
        horoscope = await tx.horoscope.upsert({
          where: { userId },
          update: horoscopeData,
          create: {
            userId,
            ...horoscopeData,
          },
        });
      }

      // 4. Create/Update Preferences
      const preferencesData: any = {};
      if (data.ageFrom) preferencesData.ageFrom = data.ageFrom;
      if (data.ageTo) preferencesData.ageTo = data.ageTo;
      if (data.heightFrom) preferencesData.heightFrom = data.heightFrom;
      if (data.heightTo) preferencesData.heightTo = data.heightTo;
      if (data.preferredEducation) preferencesData.education = data.preferredEducation;
      if (data.preferredOccupation) preferencesData.occupation = data.preferredOccupation;
      if (data.preferredLocation) preferencesData.location = data.preferredLocation;
      if (data.preferredIncome) preferencesData.income = data.preferredIncome;
      if (data.maritalStatus) preferencesData.maritalStatus = data.maritalStatus;
      if (data.religion) preferencesData.religion = data.religion;
      if (data.caste) preferencesData.caste = data.caste;

      let preferences = null;
      if (Object.keys(preferencesData).length > 0) {
        preferences = await tx.preferences.upsert({
          where: { userId },
          update: preferencesData,
          create: {
            userId,
            ...preferencesData,
          },
        });
      }

      return {
        user: userUpdateData,
        profile,
        horoscope,
        preferences,
        message: 'AI personalization data saved successfully'
      };
    });

    console.log(`✅ Saved AI personalization data for user ${decoded.userId}`);
    
    return NextResponse.json({ 
      success: true, 
      data: result,
      message: 'Profile updated successfully with AI personalization data'
    });

  } catch (error) {
    console.error('Error saving AI personalization data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to save AI personalization data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 