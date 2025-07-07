# Forgot Password Setup Guide

## Overview

The forgot password functionality has been implemented with secure email-based password reset. The system works even without email configuration (for development), but for production use, you should configure email settings.

## Features

- ✅ Secure JWT-based reset tokens
- ✅ Email-based password reset links
- ✅ Token expiration (1 hour)
- ✅ Password validation with requirements
- ✅ Graceful handling of missing email configuration
- ✅ User-friendly error messages
- ✅ Security best practices (no user enumeration)

## API Endpoints

### 1. Request Password Reset
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "If an account with this email exists, a password reset link has been sent."
}
```

### 2. Reset Password
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "jwt_token_here",
  "newPassword": "newSecurePassword123!"
}
```

**Response:**
```json
{
  "message": "Password reset successful"
}
```

## Pages

### 1. Forgot Password Page
- **URL:** `/forgot-password`
- **Purpose:** Request password reset
- **Features:** Email input, success confirmation

### 2. Reset Password Page
- **URL:** `/reset-password?token=jwt_token`
- **Purpose:** Set new password
- **Features:** Password validation, confirmation

### 3. Login Page
- **URL:** `/login`
- **Purpose:** User login
- **Features:** Forgot password link

## Email Configuration (Optional)

For production use, configure email settings in your `.env` file:

```env
# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# App URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Gmail Setup

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Use the generated password as `EMAIL_PASSWORD`

### Development Mode

Without email configuration, the system will:
- ✅ Still generate reset tokens
- ✅ Save tokens to database
- ✅ Log tokens to console for testing
- ✅ Return success responses
- ✅ Allow password reset via direct URL

## Password Requirements

New passwords must meet these criteria:
- At least 8 characters long
- At least one letter (a-z, A-Z)
- At least one number (0-9)
- At least one special character (!@#$%^&*(),.?":{}|<>)

## Security Features

1. **No User Enumeration:** Always returns the same message regardless of whether the email exists
2. **Token Expiration:** Reset tokens expire after 1 hour
3. **Single Use:** Tokens are deleted after successful password reset
4. **JWT Security:** Tokens are signed with your JWT secret
5. **Password Validation:** Enforces strong password requirements

## Testing

### Manual Testing

1. **Request Reset:**
   ```bash
   curl -X POST http://localhost:3004/api/auth/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com"}'
   ```

2. **Check Console:** Look for reset token in server logs
3. **Visit Reset URL:** `http://localhost:3004/reset-password?token=TOKEN_HERE`
4. **Set New Password:** Enter new password and confirm

### Automated Testing

Run the test script:
```bash
node test-forgot-password.js
```

## Troubleshooting

### Common Issues

1. **500 Error on Forgot Password:**
   - Check JWT_SECRET is set
   - Verify database connection
   - Check server logs for specific errors

2. **Email Not Sending:**
   - Verify EMAIL_USER and EMAIL_PASSWORD are set
   - Check Gmail app password is correct
   - Ensure 2FA is enabled on Gmail account

3. **Reset Link Not Working:**
   - Check token expiration (1 hour)
   - Verify token format in URL
   - Check server logs for JWT errors

### Development Tips

1. **Without Email Setup:** Check server console for reset tokens
2. **Testing:** Use the test script to verify functionality
3. **Debugging:** Check browser network tab for API responses

## Database Schema

The system uses the existing `VerificationToken` model:

```prisma
model VerificationToken {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  token     String   @unique
  email     String
  expiresAt DateTime
  createdAt DateTime @default(now())
}
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET` | Yes | JWT signing secret |
| `DATABASE_URL` | Yes | MongoDB connection string |
| `EMAIL_USER` | No | Gmail username |
| `EMAIL_PASSWORD` | No | Gmail app password |
| `NEXT_PUBLIC_APP_URL` | No | App URL for reset links |

## Files Modified/Created

### New Files
- `src/app/api/auth/forgot-password/route.ts`
- `src/app/api/auth/reset-password/route.ts`
- `src/app/forgot-password/page.tsx`
- `src/app/reset-password/page.tsx`
- `src/app/login/page.tsx`
- `test-forgot-password.js`
- `FORGOT_PASSWORD_SETUP.md`

### Modified Files
- `src/components/LoginModal.tsx` (already had forgot password link)

### Deleted Files
- `src/app/api/auth/direct-reset-password/route.ts` (insecure implementation) 