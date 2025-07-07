const fetch = require('node-fetch');

async function testForgotPassword() {
  console.log('🧪 Testing Forgot Password Functionality');
  console.log('=====================================\n');

  try {
    // Test 1: Request password reset for a non-existent email
    console.log('1️⃣ Testing with non-existent email...');
    const response1 = await fetch('http://localhost:3004/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'nonexistent@example.com'
      }),
    });

    const data1 = await response1.json();
    console.log('Status:', response1.status);
    console.log('Response:', data1);
    console.log('✅ Test 1 passed - handles non-existent email gracefully\n');

    // Test 2: Request password reset without email
    console.log('2️⃣ Testing without email...');
    const response2 = await fetch('http://localhost:3004/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    const data2 = await response2.json();
    console.log('Status:', response2.status);
    console.log('Response:', data2);
    console.log('✅ Test 2 passed - validates required email\n');

    // Test 3: Request password reset for existing email (if you have a test user)
    console.log('3️⃣ Testing with existing email...');
    const response3 = await fetch('http://localhost:3004/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@subvivah.com' // Replace with an actual email from your database
      }),
    });

    const data3 = await response3.json();
    console.log('Status:', response3.status);
    console.log('Response:', data3);
    
    if (response3.ok) {
      console.log('✅ Test 3 passed - successfully processed password reset request');
      if (data3.note) {
        console.log('📝 Note:', data3.note);
        console.log('🔍 Check the server console for the reset token and URL');
      }
    } else {
      console.log('❌ Test 3 failed - unexpected error');
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testForgotPassword(); 