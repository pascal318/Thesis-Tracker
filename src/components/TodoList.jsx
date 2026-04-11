import React from 'react';
import TodoItem from './TodoItem.jsx';

export default function TodoList({ todos, onToggle, onDelete, onUpdate }) {
  if (!todos.length) return null;
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  );
}
