import { useState } from 'react';
import { Priority } from '../types';

interface TodoInputProps {
  onAdd: (text: string, dueDate?: Date, priority?: Priority) => void;
}

export const TodoInput: React.FC<TodoInputProps> = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() === '') return;
    
    const dueDateObj = dueDate ? new Date(dueDate) : undefined;
    onAdd(text, dueDateObj, priority);
    setText('');
    setDueDate('');
    setPriority('medium');
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="input-section">
      <div className="input-group">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="新しいタスクを入力してください..."
          className="todo-input"
          required
        />
        <div className="input-row">
          <div className="date-input-group">
            <label htmlFor="dueDate">期限:</label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={today}
              className="date-input"
            />
          </div>
          <div className="priority-input-group">
            <label htmlFor="priority">優先度:</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="priority-select"
            >
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>
          </div>
        </div>
      </div>
      <button type="submit" className="add-btn">
        追加
      </button>
    </form>
  );
};