import express from 'express';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';

import todosRouter from './routes/todos.js';
import gmailRouter from './routes/gmail.js';
import driveRouter from './routes/drive.js';
import whatsappRouter from './routes/whatsapp.js';
import authGoogleRouter from './auth/google.js';
import gmailWebhookRouter from './webhooks/gmail.js';
import whatsappWebhookRouter from './webhooks/whatsapp.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
}));

// API routes
app.use('/api/todos', todosRouter);
app.use('/api/gmail', gmailRouter);
app.use('/api/drive', driveRouter);
app.use('/api/whatsapp', whatsappRouter);
app.use('/api/auth', authGoogleRouter);

// Webhook routes
app.use('/webhooks/gmail', gmailWebhookRouter);
app.use('/webhooks/whatsapp', whatsappWebhookRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Serve static frontend in production
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(config.port, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
