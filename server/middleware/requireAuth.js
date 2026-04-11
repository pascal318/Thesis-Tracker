export function requireGoogleAuth(req, res, next) {
  if (!req.session.googleTokens) {
    return res.status(401).json({ error: 'Google authentication required. Visit /api/auth/google to connect.' });
  }
  next();
}
