import React, { useState } from 'react';
import GmailImport from './gmail/GmailImport.jsx';
import GranolaImport from './granola/GranolaImport.jsx';
import WhatsAppShare from './whatsapp/WhatsAppShare.jsx';
import DriveFilePicker from './drive/DriveFilePicker.jsx';

const TABS = [
  { id: 'gmail', label: 'Gmail', color: '#ea4335' },
  { id: 'granola', label: 'Granola', color: '#8b5cf6' },
  { id: 'whatsapp', label: 'WhatsApp', color: '#25d366' },
  { id: 'drive', label: 'Drive', color: '#4285f4' },
];

export default function IntegrationPanel({ google, todos, onRefetch }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('gmail');

  return (
    <div style={styles.wrapper}>
      <button onClick={() => setOpen(!open)} style={styles.toggle}>
        {open ? 'Hide' : 'Show'} Integrations
      </button>

      {open && (
        <div style={styles.panel}>
          <div style={styles.tabs}>
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  ...styles.tab,
                  ...(tab === t.id ? { borderBottomColor: t.color, color: t.color, fontWeight: '600' } : {}),
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div style={styles.content}>
            {tab === 'gmail' && <GmailImport google={google} onImported={onRefetch} />}
            {tab === 'granola' && <GranolaImport onImported={onRefetch} />}
            {tab === 'whatsapp' && <WhatsAppShare todos={todos} />}
            {tab === 'drive' && <DriveFilePicker google={google} todos={todos} onAttached={onRefetch} />}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: { marginBottom: '16px' },
  toggle: {
    width: '100%', padding: '10px', fontSize: '0.9rem', fontWeight: '500',
    background: '#f8f9fa', color: '#555', border: '1px solid #e0e0e0',
    borderRadius: '8px', cursor: 'pointer',
  },
  panel: { marginTop: '8px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' },
  tabs: { display: 'flex', borderBottom: '1px solid #e0e0e0' },
  tab: {
    flex: 1, padding: '10px 8px', fontSize: '0.8rem', background: '#fff',
    color: '#888', border: 'none', borderBottom: '2px solid transparent',
    cursor: 'pointer', transition: 'all 0.2s',
  },
  content: { padding: '16px' },
};
