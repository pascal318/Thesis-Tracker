import React, { useState } from 'react';
import { useTodos } from './hooks/useTodos.js';
import { useAuth } from './hooks/useAuth.js';
import TodoForm from './components/TodoForm.jsx';
import TodoList from './components/TodoList.jsx';
import Filters from './components/Filters.jsx';
import IntegrationPanel from './components/IntegrationPanel.jsx';

export default function App() {
  const {
    todos, loading, error,
    addTodo, toggleTodo, deleteTodo, updateTodoText,
    toggleAll, clearCompleted, refetch,
  } = useTodos();
  const auth = useAuth();
  const [filter, setFilter] = useState('all');

  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;

  return (
    <div style={styles.container}>
      <div style={styles.app}>
        <h1 style={styles.title}>Todo List</h1>

        <IntegrationPanel google={auth.google} todos={todos} onRefetch={refetch} />

        <TodoForm onAdd={addTodo} />

        {loading && <p style={styles.muted}>Loading...</p>}
        {error && <p style={styles.error}>Error: {error}</p>}

        {!loading && todos.length > 0 && (
          <>
            <Filters
              current={filter}
              onChange={setFilter}
              todos={todos}
              onToggleAll={toggleAll}
              onClearCompleted={clearCompleted}
            />
            <TodoList
              todos={filteredTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onUpdate={updateTodoText}
            />
            <div style={styles.footer}>
              <span>{activeCount} item{activeCount !== 1 ? 's' : ''} left</span>
            </div>
          </>
        )}

        {!loading && todos.length === 0 && (
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
    display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
    paddingTop: '60px', paddingBottom: '60px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  app: {
    width: '100%', maxWidth: '560px', margin: '0 16px',
    background: '#fff', borderRadius: '12px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.25)', padding: '32px',
  },
  title: { textAlign: 'center', fontSize: '2rem', fontWeight: '700', color: '#333', marginBottom: '24px' },
  muted: { textAlign: 'center', color: '#999', padding: '20px 0' },
  error: { textAlign: 'center', color: '#e74c3c', padding: '10px 0', fontSize: '0.85rem' },
  footer: { paddingTop: '12px', borderTop: '1px solid #eee', color: '#999', fontSize: '0.85rem' },
  empty: { textAlign: 'center', color: '#aaa', padding: '40px 0', fontSize: '1rem' },
};
