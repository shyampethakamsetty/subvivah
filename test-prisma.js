const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn', 'info'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function testLogin(email, password) {
    try {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
            include: { profile: true }
        });

        if (!user) {
            console.log('Login failed: User not found');
            return null;
        }

        // Compare password
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            console.log('Login failed: Invalid password');
            return null;
        }

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });

        console.log('Login successful!');
        return user;
    } catch (error) {
        console.error('Login error:', error);
        return null;
    }
}

async function testPrisma() {
    try {
        console.log('Testing Prisma MongoDB connection...');
        console.log('Connection URL:', process.env.DATABASE_URL);

        // First, test the connection
        await prisma.$connect();
        console.log('Successfully connected to MongoDB');

        // Try a simple query first
        const count = await prisma.user.count();
        console.log('Current user count:', count);

        // Create a test user with unique email using timestamp
        const timestamp = new Date().getTime();
        const testEmail = `test${timestamp}@subvivah.com`;
        const testPassword = 'test123';
        
        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(testPassword, 10);
        
        const user = await prisma.user.create({
            data: {
                email: testEmail,
                password: hashedPassword,
                firstName: 'Test',
                lastName: 'User',
                gender: 'male',
                dob: new Date('1990-01-01'),
            },
        });
        console.log('Created test user:', user);

        // Create a profile for the user
        const profile = await prisma.profile.create({
            data: {
                userId: user.id,
                height: '5\'10"',
                weight: '70kg',
                maritalStatus: 'Never Married',
                religion: 'Hindu',
                education: 'B.Tech',
                occupation: 'Software Engineer',
                annualIncome: '10-15 LPA',
                aboutMe: 'Test profile for Prisma MongoDB verification',
            },
        });
        console.log('Created user profile:', profile);

        // Test login with correct credentials
        console.log('\nTesting login with correct credentials:');
        const loginResult = await testLogin(testEmail, testPassword);
        console.log('Login result:', loginResult ? 'Success' : 'Failed');

        // Test login with incorrect password
        console.log('\nTesting login with incorrect password:');
        const wrongLoginResult = await testLogin(testEmail, 'wrongpassword');
        console.log('Login result:', wrongLoginResult ? 'Success' : 'Failed');

        // Test login with non-existent email
        console.log('\nTesting login with non-existent email:');
        const nonExistentLoginResult = await testLogin('nonexistent@subvivah.com', testPassword);
        console.log('Login result:', nonExistentLoginResult ? 'Success' : 'Failed');

    } catch (error) {
        console.error('Error during Prisma test:', error);
        if (error.code) {
            console.error('Error code:', error.code);
        }
        if (error.meta) {
            console.error('Error metadata:', error.meta);
        }
    } finally {
        await prisma.$disconnect();
    }
}

testPrisma(); 