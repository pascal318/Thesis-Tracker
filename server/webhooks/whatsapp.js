import { Router } from 'express';
import config from '../config.js';
import { createTodo } from '../db.js';

const router = Router();

// GET /webhooks/whatsapp — Meta webhook verification
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === config.whatsapp.verifyToken) {
    console.log('WhatsApp webhook verified');
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

// POST /webhooks/whatsapp — receive incoming WhatsApp messages
router.post('/', (req, res) => {
  try {
    const entry = req.body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const messages = changes?.value?.messages;

    if (messages?.length) {
      for (const msg of messages) {
        if (msg.type === 'text' && msg.text?.body) {
          const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
          createTodo({
            id,
            text: msg.text.body,
            source: 'whatsapp',
            sourceRef: msg.id,
          });
          console.log(`Todo created from WhatsApp: "${msg.text.body}"`);
        }
      }
    }

    res.status(200).end();
  } catch (err) {
    console.error('WhatsApp webhook error:', err.message);
    res.status(200).end();
  }
});

export default router;
