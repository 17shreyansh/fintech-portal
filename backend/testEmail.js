require('dotenv').config();
const { sendWelcomeEmail, sendPasswordResetEmail } = require('./services/emailService');

const testEmails = async () => {
  console.log('Testing email system...');
  
  // Test welcome email
  try {
    await sendWelcomeEmail('test@example.com', 'Test User');
    console.log('✅ Welcome email test completed');
  } catch (error) {
    console.log('❌ Welcome email test failed:', error.message);
  }
  
  // Test password reset email
  try {
    await sendPasswordResetEmail('test@example.com', 'Test User', 'sample-reset-token');
    console.log('✅ Password reset email test completed');
  } catch (error) {
    console.log('❌ Password reset email test failed:', error.message);
  }
};

testEmails();