import { useState } from 'react';
import { Todo, Priority } from '../types';

interface TodoEditProps {
  todo: Todo;
  onSave: (id: string, updates: Partial<Pick<Todo, 'text' | 'dueDate' | 'priority'>>) => void;
  onCancel: () => void;
}

export const TodoEdit: React.FC<TodoEditProps> = ({ todo, onSave, onCancel }) => {
  const [text, setText] = useState(todo.text);
  const [dueDate, setDueDate] = useState(
    todo.dueDate ? todo.dueDate.toISOString().split('T')[0] : ''
  );
  const [priority, setPriority] = useState<Priority>(todo.priority);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() === '') return;
    
    const dueDateObj = dueDate ? new Date(dueDate) : undefined;
    onSave(todo.id, {
      text: text.trim(),
      dueDate: dueDateObj,
      priority,
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="todo-edit-form">
      <div className="edit-input-group">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="edit-todo-input"
          required
          autoFocus
        />
        <div className="edit-input-row">
          <div className="edit-date-input-group">
            <label htmlFor={`edit-dueDate-${todo.id}`}>期限:</label>
            <input
              id={`edit-dueDate-${todo.id}`}
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={today}
              className="edit-date-input"
            />
          </div>
          <div className="edit-priority-input-group">
            <label htmlFor={`edit-priority-${todo.id}`}>優先度:</label>
            <select
              id={`edit-priority-${todo.id}`}
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="edit-priority-select"
            >
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>
          </div>
        </div>
      </div>
      <div className="edit-actions">
        <button type="submit" className="save-btn">
          保存
        </button>
        <button type="button" onClick={onCancel} className="cancel-btn">
          キャンセル
        </button>
      </div>
    </form>
  );
};