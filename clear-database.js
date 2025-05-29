const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn', 'info'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function clearDatabase() {
    try {
        console.log('Starting database cleanup...');

        // Delete all records from each collection
        console.log('Deleting all users and related data...');
        
        // Delete all verification tokens
        await prisma.verificationToken.deleteMany({});
        console.log('✓ Verification tokens deleted');

        // Delete all notifications
        await prisma.notification.deleteMany({});
        console.log('✓ Notifications deleted');

        // Delete all verifications
        await prisma.verification.deleteMany({});
        console.log('✓ Verifications deleted');

        // Delete all preferences
        await prisma.preferences.deleteMany({});
        console.log('✓ Preferences deleted');

        // Delete all horoscopes
        await prisma.horoscope.deleteMany({});
        console.log('✓ Horoscopes deleted');

        // Delete all profiles
        await prisma.profile.deleteMany({});
        console.log('✓ Profiles deleted');

        // Finally, delete all users
        await prisma.user.deleteMany({});
        console.log('✓ Users deleted');

        console.log('\nDatabase cleanup completed successfully!');
    } catch (error) {
        console.error('Error during database cleanup:', error);
    } finally {
        await prisma.$disconnect();
    }
}

clearDatabase(); 