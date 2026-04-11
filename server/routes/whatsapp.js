import { Router } from 'express';
import axios from 'axios';
import config from '../config.js';
import { getTodoById } from '../db.js';

const router = Router();

const GRAPH_API = 'https://graph.facebook.com/v18.0';

// POST /api/whatsapp/send — send a todo as a WhatsApp message
router.post('/send', async (req, res) => {
  try {
    const { todoId, recipientPhone } = req.body;
    if (!todoId || !recipientPhone) {
      return res.status(400).json({ error: 'todoId and recipientPhone are required' });
    }
    if (!config.whatsapp.accessToken) {
      return res.status(503).json({ error: 'WhatsApp Business API not configured' });
    }

    const todo = getTodoById(todoId);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });

    const response = await axios.post(
      `${GRAPH_API}/${config.whatsapp.phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: recipientPhone,
        type: 'text',
        text: {
          body: `Todo: ${todo.text}${todo.completed ? ' (completed)' : ''}`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${config.whatsapp.accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ success: true, messageId: response.data.messages?.[0]?.id });
  } catch (err) {
    console.error('WhatsApp send error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to send WhatsApp message' });
  }
});

// GET /api/whatsapp/status — check if WhatsApp is configured
router.get('/status', (req, res) => {
  res.json({
    configured: !!(config.whatsapp.accessToken && config.whatsapp.phoneNumberId),
  });
});

export default router;
