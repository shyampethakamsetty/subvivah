const nodemailer = require('nodemailer');

async function testEmailConfig() {
  console.log('🧪 Testing Email Configuration');
  console.log('=============================\n');

  const emailUser = process.env.EMAIL_USER || 'subvivah.com@gmail.com';
  const emailPassword = process.env.EMAIL_PASSWORD || 'ndwn ldox ernk wigl';

  console.log('📧 Email Configuration:');
  console.log('User:', emailUser);
  console.log('Password:', emailPassword ? 'configured' : 'missing');
  console.log('');

  if (!emailUser || !emailPassword) {
    console.error('❌ Email configuration missing!');
    console.log('Please set EMAIL_USER and EMAIL_PASSWORD environment variables');
    return;
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });

  // Test connection
  console.log('🔗 Testing SMTP connection...');
  try {
    await new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) {
          console.error('❌ SMTP Connection Failed:', error.message);
          reject(error);
        } else {
          console.log('✅ SMTP Connection Successful');
          resolve(success);
        }
      });
    });
  } catch (error) {
    console.error('❌ Connection test failed');
    return;
  }

  // Test sending email
  console.log('\n📨 Testing email sending...');
  try {
    const testEmail = {
      from: emailUser,
      to: emailUser, // Send to self for testing
      subject: 'Test Email - शुभ विवाह',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">शुभ विवाह</h1>
            <p style="color: white; margin: 10px 0 0 0;">Email Configuration Test</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Email Test</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              This is a test email to verify that the email configuration is working correctly.
            </p>
            
            <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f0f0f0; border-radius: 10px;">
              <h3 style="color: #333; margin: 0 0 10px 0;">Test Results:</h3>
              <div style="font-size: 24px; font-weight: bold; color: #28a745;">
                ✅ Email Configuration Working
              </div>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              If you received this email, the forgot password functionality should work correctly.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              This is a test email from शुभ विवाह. Please do not reply to this email.
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(testEmail);
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Check your inbox for the test email');
    
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    
    // Common error solutions
    if (error.message.includes('Invalid login')) {
      console.log('\n💡 Solution: Check your Gmail app password');
      console.log('1. Go to Google Account settings');
      console.log('2. Security → 2-Step Verification → App passwords');
      console.log('3. Generate a new app password for "Mail"');
    } else if (error.message.includes('Less secure app')) {
      console.log('\n💡 Solution: Enable 2FA and use app password');
    } else if (error.message.includes('quota')) {
      console.log('\n💡 Solution: Gmail sending quota exceeded');
      console.log('Wait 24 hours or upgrade to Google Workspace');
    }
  }
}

// Run the test
testEmailConfig().catch(console.error); 