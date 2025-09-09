import { useState } from 'react';
import { Todo, Priority } from '../types';
import { TodoEdit } from './TodoEdit';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Pick<Todo, 'text' | 'dueDate' | 'priority'>>) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const isOverdue = todo.dueDate && new Date() > todo.dueDate && !todo.completed;
  const isDueSoon = todo.dueDate && !todo.completed && 
    new Date(todo.dueDate.getTime() - Date.now()) < 24 * 60 * 60 * 1000;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    });
  };

  const getPriorityLabel = (priority: Priority) => {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
    }
  };

  const getPriorityEmoji = (priority: Priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
    }
  };

  const handleSave = (id: string, updates: Partial<Pick<Todo, 'text' | 'dueDate' | 'priority'>>) => {
    onUpdate(id, updates);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li className={`todo-item editing priority-${todo.priority}`}>
        <TodoEdit
          todo={todo}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </li>
    );
  }

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''} ${isDueSoon ? 'due-soon' : ''} priority-${todo.priority}`}>
      <div
        className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
        onClick={() => onToggle(todo.id)}
      />
      <div className="todo-content">
        <span className="todo-text" onDoubleClick={() => setIsEditing(true)}>
          {todo.text}
        </span>
        <div className="todo-meta">
          <span className="priority-badge">
            {getPriorityEmoji(todo.priority)} {getPriorityLabel(todo.priority)}
          </span>
          {todo.dueDate && (
            <span className={`due-date ${isOverdue ? 'overdue' : isDueSoon ? 'due-soon' : ''}`}>
              📅 {formatDate(todo.dueDate)}
              {isOverdue && ' (期限切れ)'}
              {isDueSoon && !isOverdue && ' (明日まで)'}
            </span>
          )}
        </div>
      </div>
      <div className="todo-actions">
        <button
          className="edit-btn"
          onClick={() => setIsEditing(true)}
          title="編集"
        >
          ✏️
        </button>
        <button
          className="delete-btn"
          onClick={() => onDelete(todo.id)}
          title="削除"
        >
          🗑️
        </button>
      </div>
    </li>
  );
};