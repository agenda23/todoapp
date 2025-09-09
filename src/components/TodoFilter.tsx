import { FilterType } from '../types';

interface TodoFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const filterLabels: Record<FilterType, string> = {
  all: 'すべて',
  active: '未完了',
  completed: '完了済み',
};

export const TodoFilter: React.FC<TodoFilterProps> = ({ currentFilter, onFilterChange }) => {
  return (
    <div className="filter-section">
      {(Object.keys(filterLabels) as FilterType[]).map((filter) => (
        <button
          key={filter}
          className={`filter-btn ${currentFilter === filter ? 'active' : ''}`}
          onClick={() => onFilterChange(filter)}
        >
          {filterLabels[filter]}
        </button>
      ))}
    </div>
  );
};