const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendWelcomeEmail = async (userEmail, userName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Welcome to Adhani Gold - Your Investment Journey Begins!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #fff; margin: 0; font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
            🏆 Welcome to Adhani Gold
          </h1>
          <p style="color: #fff; margin: 10px 0 0 0; font-size: 16px;">Your Premium Investment Platform</p>
        </div>
        
        <div style="background: #fff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${userName}! 👋</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Congratulations on joining <strong>Adhani Gold</strong>! You've taken the first step towards building your financial future with our premium investment platform.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">🚀 What's Next?</h3>
            <ul style="color: #666; line-height: 1.8; padding-left: 20px;">
              <li>Complete your profile setup</li>
              <li>Explore our investment plans</li>
              <li>Add funds to your wallet</li>
              <li>Start your investment journey</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/dashboard" 
               style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); 
                      color: #fff; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      font-weight: bold; 
                      display: inline-block;
                      box-shadow: 0 4px 12px rgba(255, 165, 0, 0.3);">
              Access Your Dashboard
            </a>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              Need help? Contact our support team at 
              <a href="mailto:support@adhanigold.com" style="color: #FFA500;">support@adhanigold.com</a>
            </p>
          </div>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully to:', userEmail);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

const sendPasswordResetEmail = async (userEmail, userName, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Reset Your Adhani Gold Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #fff; margin: 0; font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
            🔐 Password Reset Request
          </h1>
          <p style="color: #fff; margin: 10px 0 0 0; font-size: 16px;">Adhani Gold Security</p>
        </div>
        
        <div style="background: #fff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${userName},</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            We received a request to reset your password for your Adhani Gold account. If you didn't make this request, please ignore this email.
          </p>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              ⚠️ This reset link will expire in 1 hour for security reasons.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%); 
                      color: #fff; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      font-weight: bold; 
                      display: inline-block;
                      box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);">
              Reset My Password
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${resetUrl}" style="color: #FF6B6B; word-break: break-all;">${resetUrl}</a>
          </p>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              For security questions, contact us at 
              <a href="mailto:security@adhanigold.com" style="color: #FF6B6B;">security@adhanigold.com</a>
            </p>
          </div>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully to:', userEmail);
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail
};