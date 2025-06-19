const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  try {
    // Get all users with profiles
    const users = await prisma.user.findMany({
      include: {
        profile: true
      }
    });

    console.log('Total users:', users.length);
    console.log('Users with profiles:', users.filter(u => u.profile).length);

    if (users.length > 0) {
      const sampleUser = users[0];
      console.log('\nSample user data:');
      console.log('ID:', sampleUser.id);
      console.log('Name:', sampleUser.firstName, sampleUser.lastName);
      console.log('Profile:', sampleUser.profile);
    }

    // Test search query
    const searchResults = await prisma.user.findMany({
      where: {
        profile: {
          isNot: null
        }
      },
      include: {
        profile: true
      }
    });

    console.log('\nSearch test results:');
    console.log('Users found:', searchResults.length);
    
    if (searchResults.length > 0) {
      console.log('\nSample search result:');
      const sample = searchResults[0];
      console.log('ID:', sample.id);
      console.log('Name:', sample.firstName, sample.lastName);
      console.log('Profile:', sample.profile);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData(); 