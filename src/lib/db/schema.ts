import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Profile {
  id: string;
  userId: string;
  height: string;
  weight: string;
  maritalStatus: string;
  religion: string;
  caste: string;
  motherTongue: string;
  education: string;
  occupation: string;
  annualIncome: string;
  workLocation: string;
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  siblings: string;
  familyType: string;
  horoscope: Horoscope;
  preferences: Preferences;
  photos: Photo[];
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Horoscope {
  id: string;
  profileId: string;
  dateOfBirth: Date;
  timeOfBirth: string;
  placeOfBirth: string;
  rashi: string;
  nakshatra: string;
  gotra: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Preferences {
  id: string;
  profileId: string;
  ageRange: string;
  height: string;
  maritalStatus: string;
  religion: string;
  education: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Photo {
  id: string;
  profileId: string;
  url: string;
  isProfilePhoto: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Membership {
  id: string;
  userId: string;
  type: string;
  startDate: Date;
  endDate: Date;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Interest {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: Date;
  createdAt: Date;
  updatedAt: Date;
  profile: Profile;
  membership: Membership;
}

export type {
  User,
  Profile,
  Horoscope,
  Preferences,
  Photo,
  Membership,
  Message,
  Interest
};

export const schema = {
  User: {
    id: 'string',
    email: 'string',
    password: 'string',
    firstName: 'string',
    lastName: 'string',
    gender: 'string',
    dateOfBirth: 'date',
    createdAt: 'date',
    updatedAt: 'date',
    profile: 'Profile',
    membership: 'Membership',
  },
  Profile: {
    id: 'string',
    userId: 'string',
    height: 'string',
    weight: 'string',
    maritalStatus: 'string',
    religion: 'string',
    caste: 'string',
    motherTongue: 'string',
    education: 'string',
    occupation: 'string',
    annualIncome: 'string',
    workLocation: 'string',
    fatherName: 'string',
    fatherOccupation: 'string',
    motherName: 'string',
    motherOccupation: 'string',
    siblings: 'string',
    familyType: 'string',
    horoscope: 'Horoscope',
    preferences: 'Preferences',
    photos: 'Photo[]',
    isVerified: 'boolean',
    createdAt: 'date',
    updatedAt: 'date',
  },
  Horoscope: {
    id: 'string',
    profileId: 'string',
    dateOfBirth: 'date',
    timeOfBirth: 'string',
    placeOfBirth: 'string',
    rashi: 'string',
    nakshatra: 'string',
    gotra: 'string',
    createdAt: 'date',
    updatedAt: 'date',
  },
  Preferences: {
    id: 'string',
    profileId: 'string',
    ageRange: 'string',
    height: 'string',
    maritalStatus: 'string',
    religion: 'string',
    education: 'string',
    location: 'string',
    createdAt: 'date',
    updatedAt: 'date',
  },
  Photo: {
    id: 'string',
    profileId: 'string',
    url: 'string',
    isProfilePhoto: 'boolean',
    isVerified: 'boolean',
    createdAt: 'date',
    updatedAt: 'date',
  },
  Membership: {
    id: 'string',
    userId: 'string',
    type: 'string',
    startDate: 'date',
    endDate: 'date',
    features: 'string[]',
    isActive: 'boolean',
    createdAt: 'date',
    updatedAt: 'date',
  },
  Message: {
    id: 'string',
    senderId: 'string',
    receiverId: 'string',
    content: 'string',
    isRead: 'boolean',
    createdAt: 'date',
    updatedAt: 'date',
  },
  Interest: {
    id: 'string',
    senderId: 'string',
    receiverId: 'string',
    status: 'string',
    createdAt: 'date',
    updatedAt: 'date',
  },
}; 