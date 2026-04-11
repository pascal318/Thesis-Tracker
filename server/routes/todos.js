import { Router } from 'express';
import {
  getAllTodos, getTodoById, createTodo, updateTodo,
  deleteTodo, toggleAllTodos, clearCompletedTodos,
} from '../db.js';

const router = Router();

// GET /api/todos
router.get('/', (req, res) => {
  res.json(getAllTodos());
});

// GET /api/todos/:id
router.get('/:id', (req, res) => {
  const todo = getTodoById(req.params.id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  res.json(todo);
});

// POST /api/todos
router.post('/', (req, res) => {
  const { id, text, source, sourceRef, dueDate } = req.body;
  if (!id || !text?.trim()) {
    return res.status(400).json({ error: 'id and text are required' });
  }
  const todo = createTodo({ id, text: text.trim(), source, sourceRef, dueDate });
  res.status(201).json(todo);
});

// PATCH /api/todos/:id
router.patch('/:id', (req, res) => {
  const todo = updateTodo(req.params.id, req.body);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  res.json(todo);
});

// DELETE /api/todos/:id
router.delete('/:id', (req, res) => {
  deleteTodo(req.params.id);
  res.status(204).end();
});

// POST /api/todos/toggle-all
router.post('/toggle-all', (req, res) => {
  const { completed } = req.body;
  res.json(toggleAllTodos(completed));
});

// POST /api/todos/clear-completed
router.post('/clear-completed', (req, res) => {
  res.json(clearCompletedTodos());
});

export default router;
