import { useState, useCallback, useMemo, useEffect } from 'react';
import { Todo, FilterType, Priority } from '../types';
import { TodoStorage } from '../utils/storage';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [storageError, setStorageError] = useState<string | null>(null);

  // 初回ロード時にLocalStorageからデータを読み込み
  useEffect(() => {
    const loadStoredTodos = async () => {
      try {
        if (TodoStorage.isStorageAvailable()) {
          const storedTodos = TodoStorage.loadTodos();
          if (storedTodos.length > 0) {
            setTodos(storedTodos);
          }
        } else {
          setStorageError('LocalStorageが利用できません');
        }
      } catch (error) {
        console.error('Failed to load stored todos:', error);
        setStorageError('データの読み込みに失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredTodos();
  }, []);

  // todosが変更されるたびにLocalStorageに保存
  useEffect(() => {
    if (!isLoading && todos.length >= 0) {
      const success = TodoStorage.saveTodos(todos);
      if (!success) {
        setStorageError('データの保存に失敗しました');
      } else {
        setStorageError(null);
      }
    }
  }, [todos, isLoading]);

  const addTodo = useCallback((text: string, dueDate?: Date, priority: Priority = 'medium') => {
    if (text.trim() === '') return;
    
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
      dueDate,
      priority,
    };
    
    setTodos(prev => [...prev, newTodo]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  }, []);

  const updateTodo = useCallback((id: string, updates: Partial<Pick<Todo, 'text' | 'dueDate' | 'priority'>>) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id ? { ...todo, ...updates } : todo
      )
    );
  }, []);

  // データエクスポート機能
  const exportData = useCallback(() => {
    try {
      const jsonData = TodoStorage.exportTodos(todos);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `todo-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Export failed:', error);
      setStorageError('エクスポートに失敗しました');
      return false;
    }
  }, [todos]);

  // データインポート機能
  const importData = useCallback((file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonString = e.target?.result as string;
          const importedTodos = TodoStorage.importTodos(jsonString);
          if (importedTodos) {
            setTodos(importedTodos);
            setStorageError(null);
            resolve(true);
          } else {
            setStorageError('不正なファイル形式です');
            resolve(false);
          }
        } catch (error) {
          console.error('Import failed:', error);
          setStorageError('インポートに失敗しました');
          resolve(false);
        }
      };
      reader.onerror = () => {
        setStorageError('ファイルの読み込みに失敗しました');
        resolve(false);
      };
      reader.readAsText(file);
    });
  }, []);

  // 全データクリア
  const clearAllData = useCallback(() => {
    try {
      setTodos([]);
      TodoStorage.clearTodos();
      setStorageError(null);
      return true;
    } catch (error) {
      console.error('Clear failed:', error);
      setStorageError('データのクリアに失敗しました');
      return false;
    }
  }, []);

  // ストレージ情報取得
  const getStorageInfo = useCallback(() => {
    return TodoStorage.getStorageInfo();
  }, []);

  const filteredTodos = useMemo(() => {
    const filtered = todos.filter(todo => {
      switch (filter) {
        case 'active':
          return !todo.completed;
        case 'completed':
          return todo.completed;
        default:
          return true;
      }
    });

    // 優先度とステータスでソート
    return filtered.sort((a, b) => {
      // 未完了のタスクを上に
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // 優先度でソート (high > medium > low)
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (a.priority !== b.priority) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      
      // 期限でソート (期限が近いものを上に)
      if (a.dueDate && b.dueDate) {
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      
      // 作成日でソート (新しいものを上に)
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }, [todos, filter]);

  const stats = {
    total: todos.length,
    active: todos.filter(todo => !todo.completed).length,
    completed: todos.filter(todo => todo.completed).length,
  };

  return {
    todos: filteredTodos,
    allTodos: todos,
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
  };
};