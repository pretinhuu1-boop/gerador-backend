import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import './../../src/config/passport.js';

const router = express.Router();

// ============================================
// GOOGLE OAUTH ROUTES
// ============================================

/**
 * GET /auth/google
 * Initiates Google OAuth flow
 */
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

/**
 * GET /auth/google/callback
 * Google OAuth callback URL
 * Handles the OAuth response and creates JWT token
 */
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login-failed' }),
  (req, res) => {
    try {
      // Create JWT token
      const token = jwt.sign(
        {
          id: req.user.id,
          email: req.user.email,
          name: req.user.name,
        },
        process.env.JWT_SECRET || 'your-jwt-secret-key',
        { expiresIn: process.env.JWT_EXPIRATION || '24h' }
      );

      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL_DEV || 'http://localhost:5173';
      res.redirect(`${frontendUrl}?token=${token}`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect('/auth/login-failed');
    }
  }
);

/**
 * GET /auth/me
 * Returns current authenticated user from JWT
 */
router.get('/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.slice(7);
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-jwt-secret-key'
    );

    res.json({
      user: {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
      },
    });
  } catch (error) {
    console.error('Token verification error:', error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
});

/**
 * GET /auth/logout
 * Logout endpoint (primarily for session-based auth)
 */
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

/**
 * GET /auth/login-failed
 * Fallback for failed authentication
 */
router.get('/login-failed', (req, res) => {
  res.status(401).json({ error: 'Authentication failed' });
});

export default router;
