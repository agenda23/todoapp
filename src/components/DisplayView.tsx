import { useState } from 'react';
import { Todo, Priority } from '../types';

interface DisplayViewProps {
  todos: Todo[];
  onBack: () => void;
}

type FontSize = 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';

const fontSizeMap: Record<FontSize, string> = {
  small: '1rem',
  medium: '1.5rem',
  large: '2rem',
  xlarge: '3rem',
  xxlarge: '4rem',
};

const fontSizeLabels: Record<FontSize, string> = {
  small: '小',
  medium: '中',
  large: '大',
  xlarge: '特大',
  xxlarge: '巨大',
};

export const DisplayView: React.FC<DisplayViewProps> = ({ todos, onBack }) => {
  const [fontSize, setFontSize] = useState<FontSize>('large');
  const [showCompleted, setShowCompleted] = useState(false);

  const displayTodos = showCompleted ? todos : todos.filter(todo => !todo.completed);
  const activeTodos = displayTodos.filter(todo => !todo.completed);
  const overdueTodos = activeTodos.filter(todo => 
    todo.dueDate && new Date() > todo.dueDate
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    });
  };

  const getPriorityEmoji = (priority: Priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
    }
  };

  const isOverdue = (todo: Todo) => {
    return todo.dueDate && new Date() > todo.dueDate && !todo.completed;
  };

  const isDueSoon = (todo: Todo) => {
    return todo.dueDate && !todo.completed && 
      new Date(todo.dueDate.getTime() - Date.now()) < 24 * 60 * 60 * 1000;
  };

  return (
    <div className="display-view">
      {/* Fixed Header */}
      <div className="display-header-fixed">
        <div className="display-header-content">
          <div className="display-header-left">
            <button onClick={onBack} className="back-btn">
              ← 戻る
            </button>
            <h1>タスク表示</h1>
          </div>
          
          <div className="display-controls">
            <div className="font-size-control">
              <label>文字サイズ:</label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value as FontSize)}
                className="font-size-select"
              >
                {Object.entries(fontSizeLabels).map(([size, label]) => (
                  <option key={size} value={size}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="show-completed-control">
              <label>
                <input
                  type="checkbox"
                  checked={showCompleted}
                  onChange={(e) => setShowCompleted(e.target.checked)}
                />
                完了済みも表示
              </label>
            </div>
          </div>
          
          <div className="display-stats-inline">
            <div className="stat-item-inline">
              <span className="stat-value">{todos.length}</span>
              <span className="stat-label">総数</span>
            </div>
            <div className="stat-item-inline">
              <span className="stat-value">{activeTodos.length}</span>
              <span className="stat-label">未完了</span>
            </div>
            {overdueTodos.length > 0 && (
              <div className="stat-item-inline urgent">
                <span className="stat-value">{overdueTodos.length}</span>
                <span className="stat-label">期限切れ</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Screen Content */}
      <div 
        className="display-content-fullscreen"
        style={{ fontSize: fontSizeMap[fontSize] }}
      >
        {displayTodos.length === 0 ? (
          <div className="no-tasks-fullscreen">
            <div className="no-tasks-icon">📝</div>
            <div className="no-tasks-text">表示するタスクがありません</div>
          </div>
        ) : (
          <ul className="display-todo-list-fullscreen">
            {displayTodos.map((todo) => (
              <li
                key={todo.id}
                className={`display-todo-item-fullscreen ${todo.completed ? 'completed' : ''} ${
                  isOverdue(todo) ? 'overdue' : isDueSoon(todo) ? 'due-soon' : ''
                } priority-${todo.priority}`}
              >
                <div className="display-todo-content-fullscreen">
                  <div className="display-todo-main-fullscreen">
                    <span className="display-checkbox-fullscreen">
                      {todo.completed ? '✅' : '⬜'}
                    </span>
                    <span className={`display-todo-text-fullscreen ${todo.completed ? 'completed' : ''}`}>
                      {todo.text}
                    </span>
                  </div>
                  {(todo.dueDate || todo.priority !== 'medium') && (
                    <div className="display-todo-meta-fullscreen">
                      {todo.priority !== 'medium' && (
                        <span className="display-priority-fullscreen">
                          {getPriorityEmoji(todo.priority)}
                        </span>
                      )}
                      {todo.dueDate && (
                        <span className={`display-due-date-fullscreen ${
                          isOverdue(todo) ? 'overdue' : isDueSoon(todo) ? 'due-soon' : ''
                        }`}>
                          📅 {formatDate(todo.dueDate)}
                          {isOverdue(todo) && ' ⚠️'}
                          {isDueSoon(todo) && !isOverdue(todo) && ' ⏰'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};