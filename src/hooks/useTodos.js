import { useState, useEffect, useCallback } from 'react';
import { todosApi } from '../api/client.js';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodos = useCallback(async () => {
    try {
      setError(null);
      const data = await todosApi.list();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTodos(); }, [fetchTodos]);

  async function addTodo(text) {
    const id = generateId();
    const optimistic = { id, text, completed: false, createdAt: Date.now(), source: 'manual', attachments: [] };
    setTodos(prev => [optimistic, ...prev]);
    try {
      await todosApi.create({ id, text });
    } catch {
      setTodos(prev => prev.filter(t => t.id !== id));
    }
  }

  async function toggleTodo(id) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    const todo = todos.find(t => t.id === id);
    try {
      await todosApi.update(id, { completed: !todo.completed });
    } catch {
      setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: todo.completed } : t));
    }
  }

  async function deleteTodo(id) {
    const prev = todos;
    setTodos(t => t.filter(x => x.id !== id));
    try {
      await todosApi.remove(id);
    } catch {
      setTodos(prev);
    }
  }

  async function updateTodoText(id, text) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, text } : t));
    try {
      await todosApi.update(id, { text });
    } catch {
      fetchTodos();
    }
  }

  async function toggleAll() {
    const allCompleted = todos.every(t => t.completed);
    const newVal = !allCompleted;
    setTodos(prev => prev.map(t => ({ ...t, completed: newVal })));
    try {
      await todosApi.toggleAll(newVal);
    } catch {
      fetchTodos();
    }
  }

  async function clearCompleted() {
    const prev = todos;
    setTodos(t => t.filter(x => !x.completed));
    try {
      await todosApi.clearCompleted();
    } catch {
      setTodos(prev);
    }
  }

  return {
    todos, loading, error,
    addTodo, toggleTodo, deleteTodo, updateTodoText,
    toggleAll, clearCompleted, refetch: fetchTodos,
  };
}
