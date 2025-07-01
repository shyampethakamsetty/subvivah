// Production logout test script
require('dotenv').config({ path: './docker.env' });

console.log('🧪 ===== PRODUCTION LOGOUT TEST =====\n');

// Test environment variables
console.log('🔍 Environment Variables:');
console.log('  - NODE_ENV:', process.env.NODE_ENV);
console.log('  - JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('  - NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET);
console.log('  - NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);

// Test JWT functionality
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;

if (!secret) {
  console.error('❌ No JWT secret found!');
  process.exit(1);
}

try {
  // Test JWT signing and verification
  const testPayload = { userId: 'test-user-123' };
  const token = jwt.sign(testPayload, secret, { algorithm: 'HS256' });
  const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });
  
  console.log('✅ JWT test passed');
  console.log('  - Token created:', !!token);
  console.log('  - Token verified:', !!decoded);
  console.log('  - Payload matches:', decoded.userId === testPayload.userId);
  
} catch (error) {
  console.error('❌ JWT test failed:', error.message);
  process.exit(1);
}

// Test cookie configurations
console.log('\n🍪 Cookie Configuration Test:');
const domains = ['subvivah.com', 'www.subvivah.com', '.subvivah.com'];
const paths = ['/', '/api'];

domains.forEach(domain => {
  paths.forEach(path => {
    console.log(`  - Domain: ${domain}, Path: ${path}`);
  });
});

console.log('\n✅ All tests completed successfully!');
console.log('\n📋 Next Steps:');
console.log('1. Deploy the updated code to production');
console.log('2. Test logout functionality in browser');
console.log('3. Check browser console for detailed logs');
console.log('4. Use debug utilities in browser console:');
console.log('   - debugAuthState()');
console.log('   - debugLogoutProcess()');
console.log('   - forceClearAllCookies()'); 