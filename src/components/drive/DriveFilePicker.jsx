import React, { useState } from 'react';
import { driveApi } from '../../api/client.js';

export default function DriveFilePicker({ google, todos, onAttached }) {
  const [query, setQuery] = useState('');
  const [files, setFiles] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!google.configured) {
    return <p style={styles.muted}>Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.</p>;
  }

  if (!google.connected) {
    return (
      <div>
        <p style={styles.muted}>Connect your Google account to attach Drive files to todos.</p>
        <a href="/api/auth/google" style={styles.connectBtn}>Connect Google Account</a>
      </div>
    );
  }

  async function search() {
    setLoading(true);
    setError(null);
    try {
      const results = await driveApi.files(query);
      setFiles(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function attachFile(file) {
    if (!selectedTodo) {
      alert('Select a todo first');
      return;
    }
    try {
      await driveApi.attach(selectedTodo, file);
      onAttached();
    } catch (err) {
      setError(err.message);
    }
  }

  const activeTodos = todos.filter(t => !t.completed);

  return (
    <div>
      <div style={styles.field}>
        <label style={styles.label}>Attach to todo:</label>
        <select value={selectedTodo} onChange={e => setSelectedTodo(e.target.value)} style={styles.select}>
          <option value="">Select a todo...</option>
          {activeTodos.map(t => (
            <option key={t.id} value={t.id}>{t.text}</option>
          ))}
        </select>
      </div>

      <div style={styles.searchRow}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          placeholder="Search Drive files..."
          style={styles.input}
        />
        <button onClick={search} disabled={loading} style={styles.btn}>
          {loading ? 'Loading...' : 'Search'}
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {files.map(file => (
        <div key={file.id} style={styles.fileRow}>
          <div style={styles.fileInfo}>
            <strong style={styles.fileName}>{file.name}</strong>
            <span style={styles.fileMeta}>{file.mimeType?.split('/').pop()}</span>
          </div>
          <button onClick={() => attachFile(file)} style={styles.attachBtn}>Attach</button>
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
  field: { marginBottom: '12px' },
  label: { display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '4px' },
  select: { width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' },
  searchRow: { display: 'flex', gap: '8px', marginBottom: '12px' },
  input: { flex: 1, padding: '8px 12px', fontSize: '0.85rem', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' },
  btn: { padding: '8px 14px', fontSize: '0.85rem', background: '#4285f4', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  error: { color: '#e74c3c', fontSize: '0.8rem', marginBottom: '8px' },
  fileRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0', gap: '8px' },
  fileInfo: { flex: 1, minWidth: 0 },
  fileName: { display: 'block', fontSize: '0.85rem', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  fileMeta: { fontSize: '0.7rem', color: '#999' },
  attachBtn: { padding: '4px 10px', fontSize: '0.75rem', background: '#4285f4', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', flexShrink: 0 },
};
