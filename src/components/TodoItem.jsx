import React, { useState, useRef, useEffect } from 'react';

const SOURCE_BADGES = {
  gmail: { label: 'Gmail', color: '#ea4335' },
  whatsapp: { label: 'WhatsApp', color: '#25d366' },
  granola: { label: 'Granola', color: '#8b5cf6' },
};

export default function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  function saveEdit() {
    const text = editText.trim();
    if (!text) { onDelete(todo.id); }
    else { onUpdate(todo.id, text); }
    setEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') { setEditing(false); setEditText(todo.text); }
  }

  const badge = SOURCE_BADGES[todo.source];

  if (editing) {
    return (
      <li style={styles.item}>
        <div style={styles.editRow}>
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
            style={styles.editInput}
          />
        </div>
      </li>
    );
  }

  return (
    <li style={styles.item}>
      <div style={styles.row}>
        <label style={styles.label}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            style={styles.checkbox}
          />
          <span style={{ ...styles.text, ...(todo.completed ? styles.completed : {}) }}>
            {todo.text}
          </span>
          {badge && (
            <span style={{ ...styles.badge, background: badge.color }}>{badge.label}</span>
          )}
          {todo.attachments?.length > 0 && (
            <span style={styles.attachBadge}>{todo.attachments.length} file{todo.attachments.length > 1 ? 's' : ''}</span>
          )}
        </label>
        <div style={styles.actions}>
          <button onClick={() => { setEditText(todo.text); setEditing(true); }} style={styles.btn}>Edit</button>
          <button onClick={() => onDelete(todo.id)} style={{ ...styles.btn, ...styles.deleteBtn }}>Delete</button>
        </div>
      </div>
    </li>
  );
}

const styles = {
  item: { borderBottom: '1px solid #f0f0f0' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', gap: '8px' },
  label: { display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1, minWidth: 0 },
  checkbox: { width: '20px', height: '20px', cursor: 'pointer', flexShrink: 0, accentColor: '#667eea' },
  text: { fontSize: '1rem', color: '#333', wordBreak: 'break-word' },
  completed: { textDecoration: 'line-through', color: '#aaa' },
  badge: { fontSize: '0.65rem', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: '600', flexShrink: 0 },
  attachBadge: { fontSize: '0.65rem', color: '#667eea', padding: '2px 6px', border: '1px solid #667eea', borderRadius: '4px', flexShrink: 0 },
  actions: { display: 'flex', gap: '4px', flexShrink: 0 },
  btn: { padding: '4px 10px', fontSize: '0.8rem', background: 'transparent', color: '#888', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' },
  deleteBtn: { color: '#e74c3c', borderColor: '#f5c6cb' },
  editRow: { padding: '8px 0' },
  editInput: { width: '100%', padding: '10px 12px', fontSize: '1rem', border: '2px solid #667eea', borderRadius: '6px', outline: 'none' },
};
