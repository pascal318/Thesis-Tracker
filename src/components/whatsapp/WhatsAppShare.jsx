import React, { useState, useEffect } from 'react';
import { whatsappApi } from '../../api/client.js';

export default function WhatsAppShare({ todos }) {
  const [configured, setConfigured] = useState(false);
  const activeTodos = todos.filter(t => !t.completed);

  useEffect(() => {
    whatsappApi.status().then(s => setConfigured(s.configured)).catch(() => {});
  }, []);

  function shareViaLink(todo) {
    const text = `Todo: ${todo.text}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }

  function shareSummary() {
    const summary = activeTodos.map((t, i) => `${i + 1}. ${t.text}`).join('\n');
    const text = `My Todo List:\n${summary}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }

  return (
    <div>
      <p style={styles.label}>Share todos via WhatsApp</p>

      {activeTodos.length > 0 && (
        <button onClick={shareSummary} style={styles.summaryBtn}>
          Share All Active ({activeTodos.length}) via WhatsApp
        </button>
      )}

      <div style={styles.list}>
        {todos.slice(0, 10).map(todo => (
          <div key={todo.id} style={styles.row}>
            <span style={{
              ...styles.text,
              ...(todo.completed ? styles.completed : {}),
            }}>
              {todo.text}
            </span>
            <button onClick={() => shareViaLink(todo)} style={styles.shareBtn}>Share</button>
          </div>
        ))}
      </div>

      {configured && (
        <p style={styles.hint}>WhatsApp Business API is connected. Incoming messages will auto-create todos.</p>
      )}
      {!configured && (
        <p style={styles.hint}>Using WhatsApp deep links. Configure WhatsApp Business API in .env for two-way messaging.</p>
      )}
    </div>
  );
}

const styles = {
  label: { fontSize: '0.85rem', color: '#666', marginBottom: '10px' },
  summaryBtn: {
    width: '100%', padding: '10px', fontSize: '0.85rem', fontWeight: '500',
    background: '#25d366', color: '#fff', border: 'none', borderRadius: '6px',
    cursor: 'pointer', marginBottom: '12px',
  },
  list: { maxHeight: '200px', overflowY: 'auto' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #f0f0f0', gap: '8px' },
  text: { fontSize: '0.8rem', color: '#333', flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  completed: { textDecoration: 'line-through', color: '#aaa' },
  shareBtn: { padding: '3px 8px', fontSize: '0.7rem', background: '#25d366', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', flexShrink: 0 },
  hint: { fontSize: '0.75rem', color: '#999', marginTop: '12px' },
};
