const prisma = require('./lib/prisma').default;

async function deleteTestUsers() {
    console.log('Starting to delete test users...');
    
    try {
        // First, find all test users
        const testUsers = await prisma.user.findMany({
            where: {
                email: {
                    contains: '@subvivah.com'
                }
            },
            select: {
                id: true
            }
        });

        // Delete profiles for these users
        for (const user of testUsers) {
            await prisma.profile.deleteMany({
                where: {
                    userId: user.id
                }
            });
        }

        // Now delete the users
        const result = await prisma.user.deleteMany({
            where: {
                email: {
                    contains: '@subvivah.com'
                }
            }
        });
        
        console.log(`Successfully deleted ${result.count} test users`);
    } catch (error) {
        console.error('Error deleting test users:', error);
    } finally {
        await prisma.$disconnect();
    }
}

deleteTestUsers(); 