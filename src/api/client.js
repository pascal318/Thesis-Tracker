const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    credentials: 'include',
    ...options,
  });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

// Todos
export const todosApi = {
  list: () => request('/todos'),
  create: (todo) => request('/todos', { method: 'POST', body: JSON.stringify(todo) }),
  update: (id, updates) => request(`/todos/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
  remove: (id) => request(`/todos/${id}`, { method: 'DELETE' }),
  toggleAll: (completed) => request('/todos/toggle-all', { method: 'POST', body: JSON.stringify({ completed }) }),
  clearCompleted: () => request('/todos/clear-completed', { method: 'POST' }),
};

// Auth
export const authApi = {
  googleStatus: () => request('/auth/google/status'),
  googleDisconnect: () => request('/auth/google/disconnect', { method: 'POST' }),
};

// Gmail
export const gmailApi = {
  messages: (q = '', maxResults = 10) => request(`/gmail/messages?q=${encodeURIComponent(q)}&maxResults=${maxResults}`),
  importEmail: (messageId, text) => request('/gmail/import', { method: 'POST', body: JSON.stringify({ messageId, text }) }),
};

// Drive
export const driveApi = {
  files: (q = '') => request(`/drive/files?q=${encodeURIComponent(q)}`),
  attach: (todoId, file) => request('/drive/attach', { method: 'POST', body: JSON.stringify({ todoId, file }) }),
  detach: (todoId, driveFileId) => request('/drive/detach', { method: 'POST', body: JSON.stringify({ todoId, driveFileId }) }),
};

// WhatsApp
export const whatsappApi = {
  status: () => request('/whatsapp/status'),
  send: (todoId, recipientPhone) => request('/whatsapp/send', { method: 'POST', body: JSON.stringify({ todoId, recipientPhone }) }),
};
