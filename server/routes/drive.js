import { Router } from 'express';
import { google } from 'googleapis';
import { getAuthenticatedClient } from '../auth/google.js';
import { requireGoogleAuth } from '../middleware/requireAuth.js';
import { getTodoById, updateTodo } from '../db.js';

const router = Router();

router.use(requireGoogleAuth);

// GET /api/drive/files — search files in Google Drive
router.get('/files', async (req, res) => {
  try {
    const auth = getAuthenticatedClient(req.session);
    const drive = google.drive({ version: 'v3', auth });
    const { q = '', pageSize = 10 } = req.query;

    const query = q
      ? `name contains '${q.replace(/'/g, "\\'")}' and trashed = false`
      : 'trashed = false';

    const result = await drive.files.list({
      q: query,
      pageSize: parseInt(pageSize, 10),
      fields: 'files(id, name, mimeType, webViewLink, iconLink, modifiedTime)',
      orderBy: 'modifiedTime desc',
    });

    res.json(result.data.files || []);
  } catch (err) {
    console.error('Drive list error:', err.message);
    res.status(500).json({ error: 'Failed to list Drive files' });
  }
});

// POST /api/drive/attach — attach a Drive file to a todo
router.post('/attach', async (req, res) => {
  try {
    const { todoId, file } = req.body;
    if (!todoId || !file?.id) {
      return res.status(400).json({ error: 'todoId and file are required' });
    }

    const todo = getTodoById(todoId);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });

    const attachments = [
      ...todo.attachments,
      {
        driveFileId: file.id,
        name: file.name,
        mimeType: file.mimeType,
        url: file.webViewLink,
      },
    ];

    const updated = updateTodo(todoId, { attachments });
    res.json(updated);
  } catch (err) {
    console.error('Drive attach error:', err.message);
    res.status(500).json({ error: 'Failed to attach file' });
  }
});

// DELETE /api/drive/detach — remove an attachment from a todo
router.post('/detach', async (req, res) => {
  try {
    const { todoId, driveFileId } = req.body;
    const todo = getTodoById(todoId);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });

    const attachments = todo.attachments.filter(a => a.driveFileId !== driveFileId);
    const updated = updateTodo(todoId, { attachments });
    res.json(updated);
  } catch (err) {
    console.error('Drive detach error:', err.message);
    res.status(500).json({ error: 'Failed to detach file' });
  }
});

export default router;
