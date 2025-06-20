// Test script for gender update API
const jwt = require('jsonwebtoken');

// Test the gender update API
async function testGenderUpdate() {
  try {
    // You would need a real user ID and JWT secret from your environment
    const testUserId = 'your-test-user-id';
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    
    // Create a test token
    const token = jwt.sign({ userId: testUserId }, jwtSecret, { expiresIn: '1h' });
    
    const response = await fetch('http://localhost:3002/api/auth/update-gender', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`
      },
      body: JSON.stringify({
        gender: 'male',
        confidence: 85
      })
    });
    
    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response body:', result);
    
    if (response.ok) {
      console.log('✅ Gender update successful!');
    } else {
      console.log('❌ Gender update failed:', result.error);
    }
    
  } catch (error) {
    console.error('Error testing gender update:', error);
  }
}

// Uncomment to run test
// testGenderUpdate();

console.log('Gender update API test script created. Update with real user ID and run to test.'); 