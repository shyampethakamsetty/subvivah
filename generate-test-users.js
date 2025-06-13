const prisma = require('./lib/prisma').default;
const bcrypt = require('bcryptjs');

// Arrays of common Indian names and details
const firstNames = [
    'Aarav', 'Arjun', 'Vihaan', 'Aditya', 'Vivaan', 'Rohan', 'Arnav', 'Atharv', 'Rudra', 'Ishaan',
    'Shaurya', 'Krishna', 'Ritvik', 'Aryan', 'Dhruv', 'Kartik', 'Aarush', 'Karthik', 'Reyansh', 'Mohammed',
    'Ananya', 'Diya', 'Pooja', 'Priya', 'Riya', 'Saanvi', 'Sara', 'Ira', 'Ahana', 'Anvi',
    'Myra', 'Ridhi', 'Siya', 'Riya', 'Navya', 'Tara', 'Aisha', 'Zara', 'Meera', 'Aaradhya'
];

const lastNames = [
    'Patel', 'Kumar', 'Singh', 'Sharma', 'Verma', 'Gupta', 'Mehta', 'Chopra', 'Reddy', 'Kapoor',
    'Malhotra', 'Joshi', 'Chauhan', 'Nair', 'Menon', 'Iyer', 'Agarwal', 'Mishra', 'Bhat', 'Desai'
];

const religions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain'];
const castes = ['Brahmin', 'Kshatriya', 'Vaishya', 'Other'];
const education = [
    'B.Tech', 'MBBS', 'B.Com', 'BBA', 'MBA', 'MCA', 'B.Sc', 'M.Sc', 'Ph.D', 'CA',
    'LLB', 'B.Arch', 'BDS', 'B.Pharm', 'M.Tech'
];
const occupations = [
    'Software Engineer', 'Doctor', 'Business Owner', 'Teacher', 'Bank Manager',
    'Government Employee', 'Accountant', 'Lawyer', 'Architect', 'Pharmacist',
    'Marketing Manager', 'HR Manager', 'Sales Executive', 'Project Manager', 'Consultant'
];
const locations = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune',
    'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal'
];

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomHeight() {
    const feet = Math.floor(Math.random() * 2) + 5; // 5-6 feet
    const inches = Math.floor(Math.random() * 12);
    return `${feet}'${inches}"`;
}

function getRandomIncome() {
    const ranges = ['3-5 LPA', '5-7 LPA', '7-10 LPA', '10-15 LPA', '15-20 LPA', '20+ LPA'];
    return getRandomElement(ranges);
}

async function generateUsers(count) {
    console.log(`Starting to generate ${count} test users...`);
    
    for (let i = 0; i < count; i++) {
        try {
            const gender = Math.random() > 0.5 ? 'male' : 'female';
            const firstName = getRandomElement(firstNames);
            const lastName = getRandomElement(lastNames);
            const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@subvivah.com`;
            
            // Hash password
            const hashedPassword = await bcrypt.hash('test123', 10);
            
            // Create user
            const user = await prisma.user.create({
                data: {
                    email: email,
                    password: hashedPassword,
                    firstName: firstName,
                    lastName: lastName,
                    gender: gender,
                    dob: getRandomDate(new Date('1980-01-01'), new Date('2000-12-31')),
                    phone: `9${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`,
                    isVerified: Math.random() > 0.3, // 70% verified
                    isActive: true,
                },
            });

            // Create profile
            await prisma.profile.create({
                data: {
                    userId: user.id,
                    height: getRandomHeight(),
                    weight: `${Math.floor(Math.random() * 30) + 45}kg`,
                    maritalStatus: 'Never Married',
                    religion: getRandomElement(religions),
                    caste: getRandomElement(castes),
                    education: getRandomElement(education),
                    occupation: getRandomElement(occupations),
                    annualIncome: getRandomIncome(),
                    workLocation: getRandomElement(locations),
                    aboutMe: `Hi, I am ${firstName}. I am looking for a life partner who shares similar values and interests.`,
                    hobbies: 'Reading, Traveling, Music, Sports',
                },
            });

            console.log(`Created user ${i + 1}/${count}: ${firstName} ${lastName}`);

        } catch (error) {
            console.error(`Error creating user ${i + 1}:`, error);
        }
    }
    
    console.log('Finished generating test users!');
}

// Generate 100 users
generateUsers(100)
    .then(() => prisma.$disconnect())
    .catch((error) => {
        console.error('Error:', error);
        prisma.$disconnect();
    }); 