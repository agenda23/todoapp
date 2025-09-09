import { useState } from 'react';
import { useTodos } from './hooks/useTodos';
import { TodoInput } from './components/TodoInput';
import { TodoFilter } from './components/TodoFilter';
import { TodoItem } from './components/TodoItem';
import { TodoStats } from './components/TodoStats';
import { DisplayView } from './components/DisplayView';
import { DataManager } from './components/DataManager';
import './App.css';

type View = 'manage' | 'display';

function App() {
  const [currentView, setCurrentView] = useState<View>('manage');
  
  const {
    todos,
    allTodos,
    filter,
    stats,
    isLoading,
    storageError,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    updateTodo,
    setFilter,
    exportData,
    importData,
    clearAllData,
    getStorageInfo,
  } = useTodos();

  if (currentView === 'display') {
    return <DisplayView todos={allTodos} onBack={() => setCurrentView('manage')} />;
  }

  if (isLoading) {
    return (
      <div className="container loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>データを読み込み中...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="main-header">
        <h1>Todo List</h1>
        <button
          className="view-switch-btn"
          onClick={() => setCurrentView('display')}
          title="表示画面に切り替え"
        >
          📺 表示画面
        </button>
      </div>
      
      {storageError && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <span className="error-message">{storageError}</span>
          <button 
            className="error-dismiss"
            onClick={() => window.location.reload()}
            title="ページを再読み込み"
          >
            🔄
          </button>
        </div>
      )}
      
      <TodoInput onAdd={addTodo} />
      
      <TodoFilter 
        currentFilter={filter}
        onFilterChange={setFilter}
      />
      
      {todos.length === 0 ? (
        <div className="empty-state">
          タスクがありません
        </div>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
            />
          ))}
        </ul>
      )}
      
      {stats.total > 0 && (
        <TodoStats 
          stats={stats}
          onClearCompleted={clearCompleted}
        />
      )}

      <DataManager
        onExport={exportData}
        onImport={importData}
        onClearAll={clearAllData}
        getStorageInfo={getStorageInfo}
      />
    </div>
  );
}

export default App;