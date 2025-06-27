const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Indian names data
const indianNames = {
  male: {
    firstNames: [
      'Arjun', 'Vikram', 'Rahul', 'Amit', 'Rajesh', 'Suresh', 'Mohan', 'Krishna', 'Vishal', 'Prakash',
      'Sunil', 'Anand', 'Deepak', 'Ravi', 'Sanjay', 'Ajay', 'Nitin', 'Pradeep', 'Manoj', 'Dinesh',
      'Harish', 'Ganesh', 'Sachin', 'Ramesh', 'Vinod', 'Ashok', 'Mahesh', 'Jagdish', 'Bharat', 'Sandeep'
    ],
    lastNames: [
      'Sharma', 'Verma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Malhotra', 'Kapoor', 'Joshi', 'Chopra',
      'Reddy', 'Mehra', 'Tiwari', 'Yadav', 'Kaur', 'Bhatt', 'Chauhan', 'Saxena', 'Mishra', 'Agarwal'
    ]
  },
  female: {
    firstNames: [
      'Priya', 'Anjali', 'Meera', 'Kavita', 'Sunita', 'Rekha', 'Pooja', 'Neha', 'Divya', 'Sonia',
      'Ritu', 'Mamta', 'Jyoti', 'Sangeeta', 'Vandana', 'Kalpana', 'Shweta', 'Archana', 'Rashmi', 'Deepika',
      'Anita', 'Sarita', 'Lakshmi', 'Gayatri', 'Madhavi', 'Sushma', 'Kiran', 'Manisha', 'Rekha', 'Asha'
    ],
    lastNames: [
      'Sharma', 'Verma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Malhotra', 'Kapoor', 'Joshi', 'Chopra',
      'Reddy', 'Mehra', 'Tiwari', 'Yadav', 'Kaur', 'Bhatt', 'Chauhan', 'Saxena', 'Mishra', 'Agarwal'
    ]
  },
  unknown: {
    firstNames: [
      'Aadi', 'Advait', 'Arnav', 'Dhruv', 'Ishaan', 'Kavya', 'Mira', 'Nisha', 'Om', 'Pari',
      'Riya', 'Saanvi', 'Tara', 'Vivaan', 'Zara', 'Aarav', 'Diya', 'Ira', 'Kiya', 'Lavanya',
      'Myra', 'Navya', 'Ojas', 'Prisha', 'Rudra', 'Siya', 'Tanisha', 'Vanya', 'Yash', 'Zara'
    ],
    lastNames: [
      'Sharma', 'Verma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Malhotra', 'Kapoor', 'Joshi', 'Chopra',
      'Reddy', 'Mehra', 'Tiwari', 'Yadav', 'Kaur', 'Bhatt', 'Chauhan', 'Saxena', 'Mishra', 'Agarwal'
    ]
  }
};

// Indian cities
const indianCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat',
  'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara'
];

// Indian religions
const religions = ['Hindu', 'Muslim', 'Sikh', 'Christian', 'Buddhist', 'Jain', 'Other'];

// Indian castes
const castes = ['Brahmin', 'Kshatriya', 'Vaishya', 'Shudra', 'Other'];

// Education levels
const educationLevels = [
  'High School', 'Diploma', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 'Professional Degree'
];

// Occupations
const occupations = [
  'Software Engineer', 'Doctor', 'Teacher', 'Business Analyst', 'Marketing Manager', 'Accountant',
  'Lawyer', 'Architect', 'Designer', 'Sales Executive', 'HR Manager', 'Project Manager'
];

// Marital statuses
const maritalStatuses = ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'];

// Family types
const familyTypes = ['Joint Family', 'Nuclear Family', 'Extended Family'];

// Family statuses
const familyStatuses = ['Middle Class', 'Upper Middle Class', 'Rich', 'Affluent'];

// Hobbies
const hobbies = [
  'Reading', 'Traveling', 'Cooking', 'Dancing', 'Singing', 'Photography', 'Painting', 'Gardening',
  'Yoga', 'Meditation', 'Sports', 'Music', 'Movies', 'Cooking', 'Fitness'
];

// Income ranges
const incomeRanges = [
  'Below 3 LPA', '3-5 LPA', '5-7 LPA', '7-10 LPA', '10-15 LPA', '15-25 LPA', 'Above 25 LPA'
];

// Height ranges
const heights = ['4\'10"', '5\'0"', '5\'2"', '5\'4"', '5\'6"', '5\'8"', '5\'10"', '6\'0"', '6\'2"'];

// Weight ranges
const weights = ['45-50 kg', '50-55 kg', '55-60 kg', '60-65 kg', '65-70 kg', '70-75 kg', '75-80 kg', '80+ kg'];

// Mother tongues
const motherTongues = [
  'Hindi', 'English', 'Punjabi', 'Gujarati', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam',
  'Bengali', 'Odia', 'Assamese', 'Urdu', 'Sanskrit'
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generatePhoneNumber() {
  const prefixes = ['6', '7', '8', '9'];
  const prefix = getRandomElement(prefixes);
  const remaining = Math.floor(Math.random() * 9000000000) + 1000000000;
  return `${prefix}${remaining}`;
}

function generateEmail(firstName, lastName) {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
  const domain = getRandomElement(domains);
  const numbers = Math.floor(Math.random() * 1000);
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${numbers}@${domain}`;
}

async function createUserWithProfile(gender, index) {
  const names = indianNames[gender];
  const firstName = getRandomElement(names.firstNames);
  const lastName = getRandomElement(names.lastNames);
  const email = generateEmail(firstName, lastName);
  const phone = generatePhoneNumber();
  
  // Generate date of birth (age between 18-45)
  const currentYear = new Date().getFullYear();
  const minAge = 18;
  const maxAge = 45;
  const birthYear = currentYear - Math.floor(Math.random() * (maxAge - minAge + 1)) - minAge;
  const birthMonth = Math.floor(Math.random() * 12);
  const birthDay = Math.floor(Math.random() * 28) + 1;
  const dob = new Date(birthYear, birthMonth, birthDay);

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  try {
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        gender,
        dob,
        phone,
        isVerified: Math.random() > 0.3, // 70% verified
        isActive: true,
        lastLogin: Math.random() > 0.5 ? new Date() : null,
      }
    });

    // Create profile for the user
    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        height: getRandomElement(heights),
        weight: getRandomElement(weights),
        maritalStatus: getRandomElement(maritalStatuses),
        religion: getRandomElement(religions),
        caste: getRandomElement(castes),
        subCaste: Math.random() > 0.7 ? 'Not Specified' : null,
        motherTongue: getRandomElement(motherTongues),
        education: getRandomElement(educationLevels),
        occupation: getRandomElement(occupations),
        annualIncome: getRandomElement(incomeRanges),
        workLocation: getRandomElement(indianCities),
        fatherName: `${getRandomElement(indianNames.male.firstNames)} ${lastName}`,
        fatherOccupation: getRandomElement(occupations),
        motherName: `${getRandomElement(indianNames.female.firstNames)} ${lastName}`,
        motherOccupation: getRandomElement(occupations),
        siblings: Math.random() > 0.5 ? `${Math.floor(Math.random() * 3) + 1} sibling(s)` : 'Only child',
        familyType: getRandomElement(familyTypes),
        familyStatus: getRandomElement(familyStatuses),
        aboutMe: `I am ${firstName}, a ${getRandomElement(occupations).toLowerCase()} from ${getRandomElement(indianCities)}. I enjoy ${getRandomElement(hobbies).toLowerCase()} and looking for a life partner.`,
        hobbies: getRandomElement(hobbies),
      }
    });

    // Create preferences for the user
    const preferences = await prisma.preferences.create({
      data: {
        userId: user.id,
        ageFrom: 18,
        ageTo: 45,
        heightFrom: '5\'0"',
        heightTo: '6\'2"',
        maritalStatus: 'Never Married',
        religion: getRandomElement(religions),
        caste: getRandomElement(castes),
        education: getRandomElement(educationLevels),
        occupation: getRandomElement(occupations),
        location: getRandomElement(indianCities),
        income: getRandomElement(incomeRanges),
      }
    });

    console.log(`✅ Created user ${index + 1}: ${firstName} ${lastName} (${gender}) - ${email}`);
    return { user, profile, preferences };
  } catch (error) {
    console.error(`❌ Error creating user ${index + 1}:`, error.message);
    return null;
  }
}

async function generateUsers() {
  console.log('🚀 Starting user generation...\n');

  const users = [];
  
  // Generate 10 male users
  console.log('👨 Creating 10 male users...');
  for (let i = 0; i < 10; i++) {
    const result = await createUserWithProfile('male', i);
    if (result) users.push(result);
    await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
  }

  // Generate 10 female users
  console.log('\n👩 Creating 10 female users...');
  for (let i = 0; i < 10; i++) {
    const result = await createUserWithProfile('female', i + 10);
    if (result) users.push(result);
    await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
  }

  // Generate 10 unknown gender users
  console.log('\n❓ Creating 10 unknown gender users...');
  for (let i = 0; i < 10; i++) {
    const result = await createUserWithProfile('unknown', i + 20);
    if (result) users.push(result);
    await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
  }

  console.log(`\n🎉 Successfully created ${users.length} users with profiles and preferences!`);
  
  // Summary
  const maleCount = users.filter(u => u.user.gender === 'male').length;
  const femaleCount = users.filter(u => u.user.gender === 'female').length;
  const unknownCount = users.filter(u => u.user.gender === 'unknown').length;
  
  console.log('\n📊 Summary:');
  console.log(`   Male users: ${maleCount}`);
  console.log(`   Female users: ${femaleCount}`);
  console.log(`   Unknown gender users: ${unknownCount}`);
  console.log(`   Total users: ${users.length}`);
  
  return users;
}

// Run the script
generateUsers()
  .then(() => {
    console.log('\n✨ User generation completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error during user generation:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 