import { Router } from 'express';
import { createTodo } from '../db.js';

const router = Router();

// POST /webhooks/gmail — Google Pub/Sub push notification
// When a user labels an email with the watched label, Google sends a notification here
router.post('/', (req, res) => {
  try {
    const message = req.body?.message;
    if (!message?.data) {
      return res.status(400).json({ error: 'Invalid Pub/Sub message' });
    }

    const data = JSON.parse(Buffer.from(message.data, 'base64').toString());
    console.log('Gmail webhook received:', data);

    // data contains { emailAddress, historyId }
    // In production, use historyId to fetch new messages and auto-create todos
    // For now, acknowledge receipt
    res.status(200).end();
  } catch (err) {
    console.error('Gmail webhook error:', err.message);
    res.status(200).end(); // Always 200 to avoid Pub/Sub retries
  }
});

export default router;
