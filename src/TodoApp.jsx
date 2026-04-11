import React, { useState, useEffect, useRef } from 'react';

const FILTERS = { ALL: 'all', ACTIVE: 'active', COMPLETED: 'completed' };

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function loadTodos() {
  try {
    const stored = localStorage.getItem('todos');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveTodos(todos) {
  localStorage.setItem('todos', JSON.stringify(todos));
}

export default function TodoApp() {
  const [todos, setTodos] = useState(loadTodos);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const editInputRef = useRef(null);
  const addInputRef = useRef(null);

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  function addTodo(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setTodos(prev => [...prev, { id: generateId(), text, completed: false, createdAt: Date.now() }]);
    setInput('');
    addInputRef.current?.focus();
  }

  function toggleTodo(id) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }

  function deleteTodo(id) {
    setTodos(prev => prev.filter(t => t.id !== id));
  }

  function startEditing(todo) {
    setEditingId(todo.id);
    setEditText(todo.text);
  }

  function saveEdit(id) {
    const text = editText.trim();
    if (!text) {
      deleteTodo(id);
    } else {
      setTodos(prev => prev.map(t => t.id === id ? { ...t, text } : t));
    }
    setEditingId(null);
    setEditText('');
  }

  function handleEditKeyDown(e, id) {
    if (e.key === 'Enter') saveEdit(id);
    if (e.key === 'Escape') {
      setEditingId(null);
      setEditText('');
    }
  }

  function toggleAll() {
    const allCompleted = todos.every(t => t.completed);
    setTodos(prev => prev.map(t => ({ ...t, completed: !allCompleted })));
  }

  function clearCompleted() {
    setTodos(prev => prev.filter(t => !t.completed));
  }

  const filteredTodos = todos.filter(t => {
    if (filter === FILTERS.ACTIVE) return !t.completed;
    if (filter === FILTERS.COMPLETED) return t.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div style={styles.container}>
      <div style={styles.app}>
        <h1 style={styles.title}>Todo List</h1>

        <form onSubmit={addTodo} style={styles.form}>
          <input
            ref={addInputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="What needs to be done?"
            style={styles.input}
            autoFocus
          />
          <button type="submit" style={styles.addButton}>Add</button>
        </form>

        {todos.length > 0 && (
          <>
            <div style={styles.controls}>
              <button onClick={toggleAll} style={styles.controlButton}>
                {todos.every(t => t.completed) ? 'Uncheck All' : 'Check All'}
              </button>
              <div style={styles.filters}>
                {Object.values(FILTERS).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      ...styles.filterButton,
                      ...(filter === f ? styles.filterButtonActive : {}),
                    }}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              {completedCount > 0 && (
                <button onClick={clearCompleted} style={styles.controlButton}>
                  Clear Completed
                </button>
              )}
            </div>

            <ul style={styles.list}>
              {filteredTodos.map(todo => (
                <li key={todo.id} style={styles.item}>
                  {editingId === todo.id ? (
                    <div style={styles.editRow}>
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        onBlur={() => saveEdit(todo.id)}
                        onKeyDown={e => handleEditKeyDown(e, todo.id)}
                        style={styles.editInput}
                      />
                    </div>
                  ) : (
                    <div style={styles.itemRow}>
                      <label style={styles.label}>
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => toggleTodo(todo.id)}
                          style={styles.checkbox}
                        />
                        <span style={{
                          ...styles.text,
                          ...(todo.completed ? styles.textCompleted : {}),
                        }}>
                          {todo.text}
                        </span>
                      </label>
                      <div style={styles.actions}>
                        <button
                          onClick={() => startEditing(todo)}
                          style={styles.actionButton}
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          style={{ ...styles.actionButton, ...styles.deleteButton }}
                          title="Delete"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <div style={styles.footer}>
              <span>{activeCount} item{activeCount !== 1 ? 's' : ''} left</span>
            </div>
          </>
        )}

        {todos.length === 0 && (
          <p style={styles.empty}>No todos yet. Add one above!</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: '60px',
    paddingBottom: '60px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  app: {
    width: '100%',
    maxWidth: '560px',
    margin: '0 16px',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
    padding: '32px',
  },
  title: {
    textAlign: 'center',
    fontSize: '2rem',
    fontWeight: '700',
    color: '#333',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    fontSize: '1rem',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  addButton: {
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: '600',
    background: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid #eee',
  },
  controlButton: {
    padding: '6px 12px',
    fontSize: '0.8rem',
    background: 'transparent',
    color: '#888',
    border: '1px solid #ddd',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  filters: {
    display: 'flex',
    gap: '4px',
  },
  filterButton: {
    padding: '6px 12px',
    fontSize: '0.8rem',
    background: 'transparent',
    color: '#888',
    border: '1px solid transparent',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  filterButtonActive: {
    border: '1px solid #667eea',
    color: '#667eea',
    fontWeight: '600',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  item: {
    borderBottom: '1px solid #f0f0f0',
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    gap: '8px',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    flex: 1,
    minWidth: 0,
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    flexShrink: 0,
    accentColor: '#667eea',
  },
  text: {
    fontSize: '1rem',
    color: '#333',
    wordBreak: 'break-word',
  },
  textCompleted: {
    textDecoration: 'line-through',
    color: '#aaa',
  },
  actions: {
    display: 'flex',
    gap: '4px',
    flexShrink: 0,
  },
  actionButton: {
    padding: '4px 10px',
    fontSize: '0.8rem',
    background: 'transparent',
    color: '#888',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    color: '#e74c3c',
    borderColor: '#f5c6cb',
  },
  editRow: {
    padding: '8px 0',
  },
  editInput: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '1rem',
    border: '2px solid #667eea',
    borderRadius: '6px',
    outline: 'none',
  },
  footer: {
    paddingTop: '12px',
    borderTop: '1px solid #eee',
    color: '#999',
    fontSize: '0.85rem',
  },
  empty: {
    textAlign: 'center',
    color: '#aaa',
    padding: '40px 0',
    fontSize: '1rem',
  },
};
