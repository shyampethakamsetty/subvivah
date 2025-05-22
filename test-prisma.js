const prisma = require('./lib/prisma').default;

async function testPrisma() {
    try {
        console.log('Testing Prisma MongoDB connection...');

        // Create a test user
        const user = await prisma.user.create({
            data: {
                email: 'test@subvivah.com',
                password: 'test123',
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

        // Query user with profile
        const userWithProfile = await prisma.user.findUnique({
            where: { id: user.id },
            include: { profile: true },
        });
        console.log('Retrieved user with profile:', userWithProfile);

    } catch (error) {
        console.error('Error during Prisma test:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testPrisma(); 