require('dotenv').config({ path: './docker.env' });
const jwt = require('jsonwebtoken');

console.log('🧪 Simple JWT Test...\n');

const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
console.log('Secret exists:', !!secret);
console.log('Secret length:', secret ? secret.length : 0);

if (!secret) {
  console.error('❌ No JWT secret found!');
  process.exit(1);
}

try {
  const token = jwt.sign({userId: 'test'}, secret, {algorithm: 'HS256'});
  console.log('Token created:', !!token);
  console.log('Token length:', token.length);
  
  const decoded = jwt.verify(token, secret, {algorithms: ['HS256']});
  console.log('Token verified:', !!decoded);
  console.log('Decoded payload:', decoded);
  
  console.log('\n✅ JWT test passed!');
} catch (error) {
  console.error('❌ JWT test failed:', error.message);
  process.exit(1);
} 