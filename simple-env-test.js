// Simple environment test
require('dotenv').config({ path: './docker.env' });

console.log('🧪 ===== SIMPLE ENVIRONMENT TEST =====\n');

// Check critical variables
const criticalVars = [
  'JWT_SECRET',
  'NEXTAUTH_SECRET', 
  'DATABASE_URL',
  'NEXT_PUBLIC_APP_URL',
  'GOOGLE_CLIENT_ID',
  'NEXT_PUBLIC_GOOGLE_CLIENT_ID'
];

console.log('🔍 Checking critical environment variables:');
let allValid = true;

criticalVars.forEach(varName => {
  const value = process.env[varName];
  const isValid = value && value.trim() !== '';
  
  console.log(`  ${isValid ? '✅' : '❌'} ${varName}: ${isValid ? 'SET' : 'NOT SET'}`);
  
  if (!isValid) {
    allValid = false;
  }
});

// Check JWT secrets specifically
console.log('\n🔑 JWT Secrets check:');
const jwtSecret = process.env.JWT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

if (jwtSecret) {
  console.log(`  ✅ JWT_SECRET: SET (${jwtSecret.length} characters)`);
  if (jwtSecret.length < 32) {
    console.log(`  ⚠️ Warning: JWT_SECRET is shorter than recommended (32+ chars)`);
  }
} else {
  console.log('  ❌ JWT_SECRET: NOT SET');
  allValid = false;
}

if (nextAuthSecret) {
  console.log(`  ✅ NEXTAUTH_SECRET: SET (${nextAuthSecret.length} characters)`);
  if (nextAuthSecret.length < 32) {
    console.log(`  ⚠️ Warning: NEXTAUTH_SECRET is shorter than recommended (32+ chars)`);
  }
} else {
  console.log('  ❌ NEXTAUTH_SECRET: NOT SET');
  allValid = false;
}

// Check database URL
console.log('\n🔗 Database URL check:');
const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
  console.log('  ✅ DATABASE_URL: SET');
  if (dbUrl.includes('mongodb')) {
    console.log('  📊 Database type: MongoDB');
  } else if (dbUrl.includes('postgresql')) {
    console.log('  📊 Database type: PostgreSQL');
  } else {
    console.log('  📊 Database type: Unknown');
  }
} else {
  console.log('  ❌ DATABASE_URL: NOT SET');
  allValid = false;
}

// Check app URL
console.log('\n🌐 App URL check:');
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
if (appUrl) {
  console.log(`  ✅ NEXT_PUBLIC_APP_URL: ${appUrl}`);
  if (appUrl.startsWith('https://')) {
    console.log('  🔒 Protocol: HTTPS (secure)');
  } else if (appUrl.startsWith('http://')) {
    console.log('  ⚠️ Protocol: HTTP (not secure)');
  }
} else {
  console.log('  ❌ NEXT_PUBLIC_APP_URL: NOT SET');
  allValid = false;
}

// Final result
console.log('\n📊 ===== FINAL RESULT =====');
if (allValid) {
  console.log('🎉 ✅ ALL CRITICAL ENVIRONMENT VARIABLES ARE PROPERLY SET!');
  console.log('✅ Ready for production deployment');
} else {
  console.log('❌ SOME CRITICAL ENVIRONMENT VARIABLES ARE MISSING!');
  console.log('❌ Please fix the issues above before deploying to production');
  process.exit(1);
} 