const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  console.log('🔍 Testing database connection...\n');
  
  try {
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Test if we can query the database
    const userCount = await prisma.user.count();
    console.log(`📊 Current user count: ${userCount}`);
    
    // Test if we can query profiles
    const profileCount = await prisma.profile.count();
    console.log(`📊 Current profile count: ${profileCount}`);
    
    // Test if we can query preferences
    const preferencesCount = await prisma.preferences.count();
    console.log(`📊 Current preferences count: ${preferencesCount}`);
    
    console.log('\n🎉 Database is ready for user generation!');
    console.log('💡 You can now run: node generate-indian-users.js');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure MongoDB is running');
    console.log('2. Check your DATABASE_URL environment variable');
    console.log('3. Run: npx prisma generate');
    console.log('4. Run: npx prisma db push');
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection(); 