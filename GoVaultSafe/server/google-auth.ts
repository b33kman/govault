import { google } from 'googleapis';
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import session from 'express-session';
import type { Express } from 'express';
import type { VerifyCallback } from 'passport-oauth2';

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'demo-client-id';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'demo-client-secret';
const CALLBACK_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.com/auth/google/callback'
  : 'http://localhost:5000/auth/google/callback';

// Required Google API scopes for GoVault
const SCOPES = [
  'openid',
  'profile', 
  'email',
  'https://www.googleapis.com/auth/drive', // Full Drive access
  'https://www.googleapis.com/auth/spreadsheets', // Sheets access
  'https://www.googleapis.com/auth/gmail.send', // Email sending
  'https://www.googleapis.com/auth/calendar', // Calendar integration
];

export interface AuthenticatedUser {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
  accessToken: string;
  refreshToken: string;
  role?: string;
}

// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID!,
  clientSecret: GOOGLE_CLIENT_SECRET!,
  callbackURL: CALLBACK_URL
}, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
  try {
    const user: AuthenticatedUser = {
      googleId: profile.id,
      email: profile.emails?.[0]?.value || '',
      name: profile.displayName || '',
      picture: profile.photos?.[0]?.value,
      accessToken,
      refreshToken: refreshToken || '',
    };
    
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

// Setup authentication middleware
export function setupAuth(app: Express) {
  app.use(session({
    secret: process.env.SESSION_SECRET || 'govault-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  // Demo mode for development without Google credentials
  if (!process.env.GOOGLE_CLIENT_ID) {
    console.log('Running in demo mode - Google OAuth disabled');
    return;
  }

  // Auth routes
  app.get('/auth/google', passport.authenticate('google', { 
    scope: SCOPES,
    accessType: 'offline',
    prompt: 'consent'
  }));

  app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/dashboard');
    }
  );

  app.get('/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) console.error('Logout error:', err);
      res.redirect('/');
    });
  });
}

// Create authenticated Google client
export function createGoogleClient(user: AuthenticatedUser) {
  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    CALLBACK_URL
  );

  oauth2Client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
  });

  return oauth2Client;
}

// Middleware to ensure user is authenticated
export function requireAuth(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
}