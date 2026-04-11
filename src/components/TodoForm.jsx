import React, { useState, useRef } from 'react';

export default function TodoForm({ onAdd }) {
  const [input, setInput] = useState('');
  const ref = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    onAdd(text);
    setInput('');
    ref.current?.focus();
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        ref={ref}
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="What needs to be done?"
        style={styles.input}
        autoFocus
      />
      <button type="submit" style={styles.button}>Add</button>
    </form>
  );
}

const styles = {
  form: { display: 'flex', gap: '8px', marginBottom: '16px' },
  input: {
    flex: 1, padding: '12px 16px', fontSize: '1rem',
    border: '2px solid #e0e0e0', borderRadius: '8px', outline: 'none',
  },
  button: {
    padding: '12px 24px', fontSize: '1rem', fontWeight: '600',
    background: '#667eea', color: '#fff', border: 'none',
    borderRadius: '8px', cursor: 'pointer',
  },
};
