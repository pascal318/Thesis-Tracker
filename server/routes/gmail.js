import { Router } from 'express';
import { google } from 'googleapis';
import { getAuthenticatedClient } from '../auth/google.js';
import { requireGoogleAuth } from '../middleware/requireAuth.js';
import { createTodo } from '../db.js';

const router = Router();

router.use(requireGoogleAuth);

// GET /api/gmail/messages — list recent emails
router.get('/messages', async (req, res) => {
  try {
    const auth = getAuthenticatedClient(req.session);
    const gmail = google.gmail({ version: 'v1', auth });
    const { q = '', maxResults = 10 } = req.query;

    const list = await gmail.users.messages.list({
      userId: 'me',
      q,
      maxResults: parseInt(maxResults, 10),
    });

    if (!list.data.messages?.length) {
      return res.json([]);
    }

    const messages = await Promise.all(
      list.data.messages.map(async (m) => {
        const msg = await gmail.users.messages.get({
          userId: 'me',
          id: m.id,
          format: 'metadata',
          metadataHeaders: ['Subject', 'From', 'Date'],
        });
        const headers = msg.data.payload.headers;
        return {
          id: m.id,
          threadId: m.threadId,
          subject: headers.find(h => h.name === 'Subject')?.value || '(no subject)',
          from: headers.find(h => h.name === 'From')?.value || '',
          date: headers.find(h => h.name === 'Date')?.value || '',
          snippet: msg.data.snippet,
        };
      })
    );

    res.json(messages);
  } catch (err) {
    console.error('Gmail list error:', err.message);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

// POST /api/gmail/import — create a todo from an email
router.post('/import', async (req, res) => {
  try {
    const { messageId, text } = req.body;
    if (!messageId || !text?.trim()) {
      return res.status(400).json({ error: 'messageId and text are required' });
    }

    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const todo = createTodo({
      id,
      text: text.trim(),
      source: 'gmail',
      sourceRef: messageId,
    });
    res.status(201).json(todo);
  } catch (err) {
    console.error('Gmail import error:', err.message);
    res.status(500).json({ error: 'Failed to import email as todo' });
  }
});

export default router;
