import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'data', 'todos.db');

// Ensure data directory exists
import fs from 'fs';
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    createdAt INTEGER NOT NULL,
    source TEXT DEFAULT 'manual',
    sourceRef TEXT,
    dueDate INTEGER,
    reminderSentAt INTEGER,
    attachments TEXT DEFAULT '[]'
  )
`);

export function getAllTodos() {
  return db.prepare('SELECT * FROM todos ORDER BY createdAt DESC').all().map(deserialize);
}

export function getTodoById(id) {
  const row = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  return row ? deserialize(row) : null;
}

export function createTodo({ id, text, source = 'manual', sourceRef = null, dueDate = null }) {
  const stmt = db.prepare(`
    INSERT INTO todos (id, text, completed, createdAt, source, sourceRef, dueDate, attachments)
    VALUES (?, ?, 0, ?, ?, ?, ?, '[]')
  `);
  stmt.run(id, text, Date.now(), source, sourceRef, dueDate);
  return getTodoById(id);
}

export function updateTodo(id, updates) {
  const todo = getTodoById(id);
  if (!todo) return null;

  const fields = [];
  const values = [];

  if (updates.text !== undefined) { fields.push('text = ?'); values.push(updates.text); }
  if (updates.completed !== undefined) { fields.push('completed = ?'); values.push(updates.completed ? 1 : 0); }
  if (updates.dueDate !== undefined) { fields.push('dueDate = ?'); values.push(updates.dueDate); }
  if (updates.attachments !== undefined) { fields.push('attachments = ?'); values.push(JSON.stringify(updates.attachments)); }
  if (updates.reminderSentAt !== undefined) { fields.push('reminderSentAt = ?'); values.push(updates.reminderSentAt); }

  if (fields.length === 0) return todo;

  values.push(id);
  db.prepare(`UPDATE todos SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  return getTodoById(id);
}

export function deleteTodo(id) {
  return db.prepare('DELETE FROM todos WHERE id = ?').run(id);
}

export function toggleAllTodos(completed) {
  db.prepare('UPDATE todos SET completed = ?').run(completed ? 1 : 0);
  return getAllTodos();
}

export function clearCompletedTodos() {
  db.prepare('DELETE FROM todos WHERE completed = 1').run();
  return getAllTodos();
}

function deserialize(row) {
  return {
    ...row,
    completed: !!row.completed,
    attachments: JSON.parse(row.attachments || '[]'),
  };
}

export default db;
