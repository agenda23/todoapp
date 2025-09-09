
interface TodoStatsProps {
  stats: {
    total: number;
    active: number;
    completed: number;
  };
  onClearCompleted: () => void;
}

export const TodoStats: React.FC<TodoStatsProps> = ({ stats, onClearCompleted }) => {
  return (
    <div className="stats">
      <span className="todo-count">
        {stats.active} 個のタスク
      </span>
      {stats.completed > 0 && (
        <button
          className="clear-completed"
          onClick={onClearCompleted}
        >
          完了済みを削除
        </button>
      )}
    </div>
  );
};