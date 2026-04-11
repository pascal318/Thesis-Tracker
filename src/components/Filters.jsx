import React from 'react';

const FILTERS = ['all', 'active', 'completed'];

export default function Filters({ current, onChange, todos, onToggleAll, onClearCompleted }) {
  const completedCount = todos.filter(t => t.completed).length;
  const allCompleted = todos.length > 0 && todos.every(t => t.completed);

  return (
    <div style={styles.bar}>
      <button onClick={onToggleAll} style={styles.ctrl}>
        {allCompleted ? 'Uncheck All' : 'Check All'}
      </button>
      <div style={styles.filters}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => onChange(f)}
            style={{ ...styles.filterBtn, ...(current === f ? styles.active : {}) }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      {completedCount > 0 && (
        <button onClick={onClearCompleted} style={styles.ctrl}>Clear Completed</button>
      )}
    </div>
  );
}

const styles = {
  bar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #eee' },
  ctrl: { padding: '6px 12px', fontSize: '0.8rem', background: 'transparent', color: '#888', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' },
  filters: { display: 'flex', gap: '4px' },
  filterBtn: { padding: '6px 12px', fontSize: '0.8rem', background: 'transparent', color: '#888', border: '1px solid transparent', borderRadius: '6px', cursor: 'pointer' },
  active: { border: '1px solid #667eea', color: '#667eea', fontWeight: '600' },
};
