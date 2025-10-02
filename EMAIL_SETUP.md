# Email System Setup for Adhani Gold

## Overview
The email system has been implemented with the following features:
- Welcome email sent automatically on user registration
- Password reset functionality via email
- Adhani Gold branded email templates

## Backend Changes Made

### 1. Email Service (`backend/services/emailService.js`)
- Welcome email template with Adhani Gold branding
- Password reset email template
- Uses nodemailer with Gmail SMTP

### 2. Updated User Model (`backend/models/User.js`)
- Added `resetPasswordToken` field
- Added `resetPasswordExpires` field

### 3. Updated Auth Routes (`backend/routes/auth.js`)
- Added welcome email sending on registration
- Added `/forgot-password` endpoint
- Added `/reset-password` endpoint

### 4. Updated Dependencies (`backend/package.json`)
- Added `nodemailer` for email functionality

## Frontend Changes Made

### 1. New Components
- `ForgotPassword.jsx` - Forgot password form
- `ResetPassword.jsx` - Reset password form with token validation

### 2. Updated Components
- `Login.jsx` - Added "Forgot Password?" link
- `Register.jsx` - Updated branding to "Adhani Gold"
- `Settings.jsx` - Added password reset via email option

### 3. Updated Routes (`App.jsx`)
- Added `/forgot-password` route
- Added `/reset-password` route

## Environment Setup

### Required Environment Variables
Add these to your `backend/.env` file:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:5173
```

### Gmail Setup Instructions

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `EMAIL_PASS`

3. **Update Environment Variables**:
   ```env
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```

## Testing the Email System

### 1. Test Email Service
```bash
cd backend
node testEmail.js
```

### 2. Test Registration Flow
1. Register a new user
2. Check email for welcome message

### 3. Test Password Reset Flow
1. Go to `/forgot-password`
2. Enter email address
3. Check email for reset link
4. Click link to reset password

## Email Templates

### Welcome Email Features
- Adhani Gold branding with gold gradient
- Welcome message with user's name
- Dashboard access button
- Support contact information

### Password Reset Email Features
- Security-focused design with red gradient
- Reset link with 1-hour expiration
- Clear instructions and warnings
- Security contact information

## Security Features

- Reset tokens expire after 1 hour
- Tokens are cryptographically secure (32 bytes)
- Email validation on all endpoints
- Password strength requirements maintained

## Troubleshooting

### Common Issues
1. **Email not sending**: Check Gmail app password setup
2. **Invalid credentials**: Verify EMAIL_USER and EMAIL_PASS
3. **Reset link not working**: Check FRONTEND_URL configuration
4. **Token expired**: Reset tokens expire after 1 hour

### Error Logs
Check console for email sending errors:
- Welcome email: "Welcome email sent successfully"
- Reset email: "Password reset email sent successfully"