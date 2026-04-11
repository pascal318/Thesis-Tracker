import React, { useState } from 'react';
import { gmailApi } from '../../api/client.js';

export default function GmailImport({ google, onImported }) {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!google.configured) {
    return <p style={styles.muted}>Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.</p>;
  }

  if (!google.connected) {
    return (
      <div>
        <p style={styles.muted}>Connect your Google account to import todos from Gmail.</p>
        <a href="/api/auth/google" style={styles.connectBtn}>Connect Google Account</a>
      </div>
    );
  }

  async function search() {
    setLoading(true);
    setError(null);
    try {
      const msgs = await gmailApi.messages(query);
      setMessages(msgs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function importEmail(msg) {
    try {
      await gmailApi.importEmail(msg.id, msg.subject);
      onImported();
      setMessages(prev => prev.filter(m => m.id !== msg.id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div style={styles.searchRow}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          placeholder="Search emails..."
          style={styles.input}
        />
        <button onClick={search} disabled={loading} style={styles.btn}>
          {loading ? 'Loading...' : 'Search'}
        </button>
      </div>
      {error && <p style={styles.error}>{error}</p>}
      {messages.map(msg => (
        <div key={msg.id} style={styles.msgRow}>
          <div style={styles.msgInfo}>
            <strong style={styles.subject}>{msg.subject}</strong>
            <span style={styles.from}>{msg.from}</span>
          </div>
          <button onClick={() => importEmail(msg)} style={styles.importBtn}>Add as Todo</button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  muted: { color: '#999', fontSize: '0.85rem' },
  connectBtn: {
    display: 'inline-block', marginTop: '8px', padding: '8px 16px',
    background: '#4285f4', color: '#fff', textDecoration: 'none',
    borderRadius: '6px', fontSize: '0.85rem',
  },
  searchRow: { display: 'flex', gap: '8px', marginBottom: '12px' },
  input: { flex: 1, padding: '8px 12px', fontSize: '0.85rem', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' },
  btn: { padding: '8px 14px', fontSize: '0.85rem', background: '#ea4335', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  error: { color: '#e74c3c', fontSize: '0.8rem', marginBottom: '8px' },
  msgRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0', gap: '8px' },
  msgInfo: { flex: 1, minWidth: 0 },
  subject: { display: 'block', fontSize: '0.85rem', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  from: { fontSize: '0.75rem', color: '#999' },
  importBtn: { padding: '4px 10px', fontSize: '0.75rem', background: '#ea4335', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', flexShrink: 0 },
};
