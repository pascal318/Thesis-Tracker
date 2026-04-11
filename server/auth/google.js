import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import config from '../config.js';

const router = Router();

function getOAuth2Client() {
  return new OAuth2Client(
    config.google.clientId,
    config.google.clientSecret,
    config.google.redirectUri
  );
}

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
];

// GET /api/auth/google — redirect to Google consent screen
router.get('/google', (req, res) => {
  if (!config.google.clientId) {
    return res.status(503).json({ error: 'Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.' });
  }
  const oauth2Client = getOAuth2Client();
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });
  res.redirect(url);
});

// GET /api/auth/google/callback — handle OAuth callback
router.get('/google/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: 'Missing authorization code' });

  try {
    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    req.session.googleTokens = tokens;
    res.redirect('/?auth=success');
  } catch (err) {
    console.error('Google OAuth error:', err.message);
    res.redirect('/?auth=error');
  }
});

// GET /api/auth/google/status — check if authenticated
router.get('/google/status', (req, res) => {
  const connected = !!req.session.googleTokens;
  res.json({
    connected,
    configured: !!config.google.clientId,
  });
});

// POST /api/auth/google/disconnect
router.post('/google/disconnect', (req, res) => {
  delete req.session.googleTokens;
  res.json({ connected: false });
});

// Helper: get an authenticated OAuth2Client for the current session
export function getAuthenticatedClient(session) {
  if (!session.googleTokens) return null;
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials(session.googleTokens);
  oauth2Client.on('tokens', (tokens) => {
    // Auto-refresh: update stored tokens when they're refreshed
    session.googleTokens = { ...session.googleTokens, ...tokens };
  });
  return oauth2Client;
}

export default router;
