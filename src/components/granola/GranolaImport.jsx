import React, { useState } from 'react';
import { todosApi } from '../../api/client.js';

function parseActionItems(text) {
  const lines = text.split('\n');
  const items = [];
  for (const line of lines) {
    const trimmed = line.trim();
    // Match: - [ ] task, * [ ] task, TODO: task, Action: task, Action item: task
    const patterns = [
      /^[-*]\s*\[\s*\]\s+(.+)/,           // - [ ] task
      /^[-*]\s+(.+)/,                       // - task (bullet points)
      /^(?:TODO|Action(?:\s+item)?)\s*:\s*(.+)/i,  // TODO: task / Action: task
      /^\d+[.)]\s+(.+)/,                    // 1. task / 1) task
    ];
    for (const pattern of patterns) {
      const match = trimmed.match(pattern);
      if (match) {
        items.push({ text: match[1].trim(), selected: true });
        break;
      }
    }
  }
  return items;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default function GranolaImport({ onImported }) {
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([]);
  const [importing, setImporting] = useState(false);
  const [step, setStep] = useState('paste'); // 'paste' | 'review'

  function handleParse() {
    const parsed = parseActionItems(notes);
    if (parsed.length === 0) {
      alert('No action items found. Try pasting notes with bullet points, checkboxes, or lines starting with "TODO:" or "Action:".');
      return;
    }
    setItems(parsed);
    setStep('review');
  }

  function toggleItem(idx) {
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, selected: !item.selected } : item));
  }

  async function handleImport() {
    setImporting(true);
    const selected = items.filter(i => i.selected);
    for (const item of selected) {
      await todosApi.create({ id: generateId(), text: item.text, source: 'granola' });
    }
    setImporting(false);
    setNotes('');
    setItems([]);
    setStep('paste');
    onImported();
  }

  if (step === 'review') {
    return (
      <div>
        <p style={styles.label}>Found {items.length} action item{items.length !== 1 ? 's' : ''}. Select which to import:</p>
        {items.map((item, i) => (
          <label key={i} style={styles.itemRow}>
            <input type="checkbox" checked={item.selected} onChange={() => toggleItem(i)} style={styles.cb} />
            <span style={styles.itemText}>{item.text}</span>
          </label>
        ))}
        <div style={styles.btnRow}>
          <button onClick={() => setStep('paste')} style={styles.backBtn}>Back</button>
          <button
            onClick={handleImport}
            disabled={importing || !items.some(i => i.selected)}
            style={styles.importBtn}
          >
            {importing ? 'Importing...' : `Import ${items.filter(i => i.selected).length} item${items.filter(i => i.selected).length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p style={styles.label}>Paste your Granola meeting notes below. Action items (bullets, checkboxes, "TODO:", "Action:") will be extracted.</p>
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder={"- [ ] Follow up with team on proposal\n- Review Q4 budget numbers\nTODO: Schedule 1:1 with manager\nAction item: Send updated timeline"}
        style={styles.textarea}
        rows={8}
      />
      <button onClick={handleParse} disabled={!notes.trim()} style={styles.parseBtn}>
        Extract Action Items
      </button>
    </div>
  );
}

const styles = {
  label: { fontSize: '0.85rem', color: '#666', marginBottom: '8px' },
  textarea: {
    width: '100%', padding: '10px', fontSize: '0.85rem', fontFamily: 'monospace',
    border: '1px solid #ddd', borderRadius: '6px', outline: 'none', resize: 'vertical',
  },
  parseBtn: { marginTop: '8px', padding: '8px 16px', fontSize: '0.85rem', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  itemRow: { display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '6px 0', cursor: 'pointer' },
  cb: { marginTop: '3px', accentColor: '#8b5cf6' },
  itemText: { fontSize: '0.85rem', color: '#333' },
  btnRow: { display: 'flex', gap: '8px', marginTop: '12px' },
  backBtn: { padding: '8px 16px', fontSize: '0.85rem', background: 'transparent', color: '#888', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' },
  importBtn: { padding: '8px 16px', fontSize: '0.85rem', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};
