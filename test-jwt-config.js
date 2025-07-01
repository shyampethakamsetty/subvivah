// Test script to verify JWT configuration
require('dotenv').config({ path: './docker.env' });

const { signJwt, verifyJwt, debugJwtConfig } = require('./src/lib/jwt.ts');

console.log('🧪 Testing JWT Configuration...\n');

// Debug current configuration
debugJwtConfig();

try {
  // Test JWT signing
  const testPayload = { userId: 'test-user-123', email: 'test@example.com' };
  console.log('\n📝 Testing JWT signing...');
  const token = signJwt(testPayload);
  console.log('✅ JWT token created successfully');
  console.log('   Token length:', token.length);
  console.log('   Token preview:', token.substring(0, 50) + '...');

  // Test JWT verification
  console.log('\n🔍 Testing JWT verification...');
  const decoded = verifyJwt(token);
  console.log('✅ JWT token verified successfully');
  console.log('   Decoded payload:', decoded);

  // Test with invalid token
  console.log('\n❌ Testing invalid token...');
  try {
    verifyJwt('invalid-token');
    console.log('❌ Should have failed with invalid token');
  } catch (error) {
    console.log('✅ Correctly rejected invalid token');
  }

  console.log('\n🎉 All JWT tests passed!');
} catch (error) {
  console.error('\n❌ JWT test failed:', error.message);
  process.exit(1);
} 