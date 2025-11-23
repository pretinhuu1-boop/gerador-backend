import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// ============================================
// PASSPORT GOOGLE OAUTH 2.0 STRATEGY
// ============================================

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: false,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // In a real application, you would save the user to a database here
        const user = {
          id: profile.id,
          email: profile.emails?.[0]?.value,
          name: profile.displayName,
          picture: profile.photos?.[0]?.value,
          accessToken,
          refreshToken,
          profile,
        };

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// ============================================
// PASSPORT SERIALIZATION
// ============================================

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, JSON.stringify(user));
});

// Deserialize user from session
passport.deserializeUser((userData, done) => {
  try {
    const user = JSON.parse(userData);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
