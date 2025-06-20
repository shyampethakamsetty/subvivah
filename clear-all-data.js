const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn', 'info'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function clearAllData() {
    try {
        console.log('🧹 Starting complete database cleanup...');
        console.log('This will delete ALL user data while preserving the schema structure.\n');

        // Count total records before deletion
        const counts = await Promise.all([
            prisma.user.count(),
            prisma.profile.count(),
            prisma.membership.count(),
            prisma.message.count(),
            prisma.interest.count(),
            prisma.photo.count(),
            prisma.horoscope.count(),
            prisma.preferences.count(),
            prisma.shortlist.count(),
            prisma.blockedUser.count(),
            prisma.notification.count(),
            prisma.verification.count(),
            prisma.verificationToken.count(),
            prisma.profileView.count(),
            prisma.spotlightMatch.count()
        ]);

        const totalRecords = counts.reduce((sum, count) => sum + count, 0);
        console.log(`📊 Found ${totalRecords} total records to delete\n`);

        // Delete all records in the correct order to avoid foreign key constraint issues
        // Start with dependent records first, then parent records

        console.log('🗑️  Deleting dependent records...');
        
        // Delete SpotlightMatch records
        const deletedSpotlightMatches = await prisma.spotlightMatch.deleteMany({});
        console.log(`   ✓ Deleted ${deletedSpotlightMatches.count} spotlight matches`);

        // Delete ProfileView records
        const deletedProfileViews = await prisma.profileView.deleteMany({});
        console.log(`   ✓ Deleted ${deletedProfileViews.count} profile views`);

        // Delete VerificationToken records
        const deletedVerificationTokens = await prisma.verificationToken.deleteMany({});
        console.log(`   ✓ Deleted ${deletedVerificationTokens.count} verification tokens`);

        // Delete Verification records
        const deletedVerifications = await prisma.verification.deleteMany({});
        console.log(`   ✓ Deleted ${deletedVerifications.count} verifications`);

        // Delete Notification records
        const deletedNotifications = await prisma.notification.deleteMany({});
        console.log(`   ✓ Deleted ${deletedNotifications.count} notifications`);

        // Delete BlockedUser records
        const deletedBlockedUsers = await prisma.blockedUser.deleteMany({});
        console.log(`   ✓ Deleted ${deletedBlockedUsers.count} blocked user relationships`);

        // Delete Shortlist records
        const deletedShortlists = await prisma.shortlist.deleteMany({});
        console.log(`   ✓ Deleted ${deletedShortlists.count} shortlist entries`);

        // Delete Preferences records
        const deletedPreferences = await prisma.preferences.deleteMany({});
        console.log(`   ✓ Deleted ${deletedPreferences.count} user preferences`);

        // Delete Horoscope records
        const deletedHoroscopes = await prisma.horoscope.deleteMany({});
        console.log(`   ✓ Deleted ${deletedHoroscopes.count} horoscopes`);

        // Delete Photo records
        const deletedPhotos = await prisma.photo.deleteMany({});
        console.log(`   ✓ Deleted ${deletedPhotos.count} photos`);

        // Delete Interest records
        const deletedInterests = await prisma.interest.deleteMany({});
        console.log(`   ✓ Deleted ${deletedInterests.count} interests`);

        // Delete Message records
        const deletedMessages = await prisma.message.deleteMany({});
        console.log(`   ✓ Deleted ${deletedMessages.count} messages`);

        // Delete Membership records
        const deletedMemberships = await prisma.membership.deleteMany({});
        console.log(`   ✓ Deleted ${deletedMemberships.count} memberships`);

        // Delete Profile records
        const deletedProfiles = await prisma.profile.deleteMany({});
        console.log(`   ✓ Deleted ${deletedProfiles.count} profiles`);

        console.log('\n🗑️  Deleting main records...');

        // Finally, delete all User records
        const deletedUsers = await prisma.user.deleteMany({});
        console.log(`   ✓ Deleted ${deletedUsers.count} users`);

        console.log('\n✅ Database cleanup completed successfully!');
        console.log('📋 Summary:');
        console.log(`   • Users: ${deletedUsers.count}`);
        console.log(`   • Profiles: ${deletedProfiles.count}`);
        console.log(`   • Memberships: ${deletedMemberships.count}`);
        console.log(`   • Messages: ${deletedMessages.count}`);
        console.log(`   • Interests: ${deletedInterests.count}`);
        console.log(`   • Photos: ${deletedPhotos.count}`);
        console.log(`   • Horoscopes: ${deletedHoroscopes.count}`);
        console.log(`   • Preferences: ${deletedPreferences.count}`);
        console.log(`   • Shortlists: ${deletedShortlists.count}`);
        console.log(`   • Blocked users: ${deletedBlockedUsers.count}`);
        console.log(`   • Notifications: ${deletedNotifications.count}`);
        console.log(`   • Verifications: ${deletedVerifications.count}`);
        console.log(`   • Verification tokens: ${deletedVerificationTokens.count}`);
        console.log(`   • Profile views: ${deletedProfileViews.count}`);
        console.log(`   • Spotlight matches: ${deletedSpotlightMatches.count}`);
        
        const totalDeleted = deletedUsers.count + deletedProfiles.count + deletedMemberships.count + 
                           deletedMessages.count + deletedInterests.count + deletedPhotos.count + 
                           deletedHoroscopes.count + deletedPreferences.count + deletedShortlists.count + 
                           deletedBlockedUsers.count + deletedNotifications.count + deletedVerifications.count + 
                           deletedVerificationTokens.count + deletedProfileViews.count + deletedSpotlightMatches.count;
        
        console.log(`\n🎉 Total records deleted: ${totalDeleted}`);
        console.log('🏗️  Database schema structure preserved - ready for new users!');

    } catch (error) {
        console.error('❌ Error during database cleanup:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
        console.log('\n🔌 Database connection closed.');
    }
}

// Add confirmation prompt for safety
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('⚠️  WARNING: This will delete ALL user data from your database!');
console.log('⚠️  This action cannot be undone!');
console.log('⚠️  Only the schema structure will be preserved.\n');

rl.question('Are you sure you want to proceed? Type "YES DELETE ALL" to confirm: ', (answer) => {
    if (answer === 'YES DELETE ALL') {
        rl.close();
        clearAllData();
    } else {
        console.log('❌ Operation cancelled. No data was deleted.');
        rl.close();
        process.exit(0);
    }
}); 