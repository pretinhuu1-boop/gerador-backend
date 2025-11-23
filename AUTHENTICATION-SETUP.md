# Google OAuth 2.0 Authentication Setup Guide

## Overview

This guide explains how to set up and use Google OAuth 2.0 authentication in the Gerador Backend API.

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Google Cloud Console account
- Frontend running on http://localhost:5173 (or configured URL)

## Step 1: Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
BACKEND_URL=http://localhost:3000

# Frontend URLs
FRONTEND_URL_DEV=http://localhost:5173
FRONTEND_URL_PROD=https://yourdomain.com

# Google OAuth 2.0 Credentials
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=24h

# Session Configuration
SESSION_SECRET=your-session-secret-change-in-production

# Gemini API (for later phases)
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-pro
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will start on http://localhost:3000

## Step 4: Authentication Flow

### Client-Side Login

1. Frontend sends user to `/auth/google` endpoint
   ```javascript
   window.location.href = 'http://localhost:3000/auth/google';
   ```

2. User is redirected to Google login page

3. After authentication, Google redirects to `/auth/google/callback`

4. Backend validates the OAuth token and creates JWT

5. User is redirected back to frontend with JWT token in URL
   ```
   http://localhost:5173?token=YOUR_JWT_TOKEN
   ```

### API Endpoints

#### 1. Initiate Google OAuth
```
GET /auth/google
```
Redirects user to Google login. No parameters needed.

#### 2. OAuth Callback (Automatic)
```
GET /auth/google/callback?code=GOOGLE_AUTH_CODE
```
Google redirects here automatically after user authentication.
This endpoint:
- Validates Google auth code
- Creates JWT token
- Redirects to frontend with token

#### 3. Get Current User
```
GET /auth/me
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN
```
Returns authenticated user information.

Response:
```json
{
  "user": {
    "id": "google_user_id",
    "email": "user@gmail.com",
    "name": "User Name"
  }
}
```

#### 4. Logout
```
GET /auth/logout
```
Clears session and logs out user.

## Step 5: Frontend Integration

### Login Button
```html
<a href="http://localhost:3000/auth/google">
  Login with Google
</a>
```

### Token Handling
```javascript
// After redirect from OAuth callback
const params = new URLSearchParams(window.location.search);
const token = params.get('token');

if (token) {
  // Store token
  localStorage.setItem('authToken', token);
  // Redirect to dashboard or home
  window.location.href = '/dashboard';
}
```

### API Requests with Token
```javascript
const token = localStorage.getItem('authToken');

fetch('http://localhost:3000/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
  .then(res => res.json())
  .then(data => console.log('User:', data.user));
```

## File Structure

```
src/
├── config/
│   └── passport.js          # Passport.js Google OAuth strategy
├── routes/
│   └── auth.js              # Authentication routes
├── middleware/
│   └── errorHandler.js      # Error handling middleware
server.js                      # Main Express server
```

## Troubleshooting

### OAuth Token Validation Fails
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Check `GOOGLE_CALLBACK_URL` matches Google Cloud Console settings
- Ensure callback URL is registered in Google Cloud Console

### JWT Token Expired
- Check `JWT_EXPIRATION` setting (default: 24h)
- Frontend should handle token refresh or re-authentication

### CORS Errors
- Verify `FRONTEND_URL_DEV` is correctly configured
- Check frontend origin matches allowed CORS origins

### Session Cookie Issues
- Ensure `SESSION_SECRET` is set in `.env`
- For production, use secure cookies (https only)

## Security Notes

1. **Never commit `.env` file** - Add to `.gitignore`
2. **Change JWT_SECRET in production** - Use strong random key
3. **Use HTTPS in production** - Required for secure cookie transmission
4. **Rotate Google credentials** - Periodically update OAuth credentials
5. **Store tokens securely** - Use secure, httpOnly cookies or secure storage

## Next Steps

Once authentication is working:
1. Implement Puppeteer for browser automation
2. Integrate Gemini API for content generation
3. Create flow-generation endpoints
4. Setup deployment to Railway or Render

## Resources

- [Passport.js Documentation](http://www.passportjs.org/)
- [Google OAuth 2.0 Setup](https://developers.google.com/identity/protocols/oauth2)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)
