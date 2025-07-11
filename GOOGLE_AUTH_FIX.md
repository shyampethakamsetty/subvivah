# Google Authentication Fix

## Issue
The error "Wrong recipient, payload audience != requiredAudience" occurs when there's a mismatch between the client ID used on the frontend and the one expected by the server for token verification.

## Solution

1. **Update Google Cloud Console Configuration**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to your project → APIs & Services → Credentials
   - Find your OAuth 2.0 Client ID
   - Add **ALL** domains where your application is deployed to "Authorized JavaScript origins":
     - https://subvivah.com
     - https://www.subvivah.com
     - (Add any other domains where your app is accessible)

2. **Environment Variables**:
   - Ensure both `GOOGLE_CLIENT_ID` and `NEXT_PUBLIC_GOOGLE_CLIENT_ID` are set to the same value in your production environment
   - The value should match exactly what's configured in Google Cloud Console

3. **Deployment**:
   - After updating the code and environment variables, redeploy your application
   - Clear browser cache and cookies before testing

## Verification
- Visit the debug endpoint at `/api/debug` (only works in development or if `ENABLE_DEBUG_ENDPOINT=true`)
- Check the server logs for Google authentication process details
- Test the Google login flow

## Common Issues
- Multiple domains not authorized in Google Cloud Console
- Mismatch between server-side and client-side client IDs
- Environment variables not properly set in production

## Additional Notes
- The code has been updated to try both client IDs for verification
- Added more detailed logging to help diagnose issues
- Created a debug endpoint for environment configuration checks 