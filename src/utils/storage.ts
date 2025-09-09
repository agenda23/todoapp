import { Todo } from '../types';

const STORAGE_KEY = 'todo-app-data';
const STORAGE_VERSION = '1.0';

export interface StorageData {
  version: string;
  todos: Todo[];
  lastUpdated: string;
}

export class TodoStorage {
  /**
   * データをLocalStorageに保存
   */
  static saveTodos(todos: Todo[]): boolean {
    try {
      const data: StorageData = {
        version: STORAGE_VERSION,
        todos: todos.map(todo => ({
          ...todo,
          createdAt: todo.createdAt instanceof Date ? todo.createdAt.toISOString() : todo.createdAt,
          dueDate: todo.dueDate instanceof Date ? todo.dueDate.toISOString() : todo.dueDate,
        })) as Todo[],
        lastUpdated: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Failed to save todos to localStorage:', error);
      return false;
    }
  }

  /**
   * LocalStorageからデータを読み込み
   */
  static loadTodos(): Todo[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return [];
      }

      const data: StorageData = JSON.parse(stored);
      
      // バージョンチェック
      if (data.version !== STORAGE_VERSION) {
        console.warn('Storage version mismatch, clearing old data');
        this.clearTodos();
        return [];
      }

      // Dateオブジェクトの復元
      return data.todos.map(todo => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
      }));
    } catch (error) {
      console.error('Failed to load todos from localStorage:', error);
      return [];
    }
  }

  /**
   * 保存されているデータをクリア
   */
  static clearTodos(): boolean {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear todos from localStorage:', error);
      return false;
    }
  }

  /**
   * LocalStorageが利用可能かチェック
   */
  static isStorageAvailable(): boolean {
    try {
      const test = 'storage-test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 保存されているデータの情報を取得
   */
  static getStorageInfo(): { hasData: boolean; lastUpdated?: Date; todoCount?: number } {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return { hasData: false };
      }

      const data: StorageData = JSON.parse(stored);
      return {
        hasData: true,
        lastUpdated: new Date(data.lastUpdated),
        todoCount: data.todos.length,
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { hasData: false };
    }
  }

  /**
   * データをJSONファイルとしてエクスポート
   */
  static exportTodos(todos: Todo[]): string {
    const data: StorageData = {
      version: STORAGE_VERSION,
      todos: todos.map(todo => ({
        ...todo,
        createdAt: todo.createdAt instanceof Date ? todo.createdAt.toISOString() : todo.createdAt,
        dueDate: todo.dueDate instanceof Date ? todo.dueDate.toISOString() : todo.dueDate,
      })) as Todo[],
      lastUpdated: new Date().toISOString(),
    };

    return JSON.stringify(data, null, 2);
  }

  /**
   * JSONファイルからデータをインポート
   */
  static importTodos(jsonString: string): Todo[] | null {
    try {
      const data: StorageData = JSON.parse(jsonString);
      
      // 基本的なバリデーション
      if (!data.todos || !Array.isArray(data.todos)) {
        throw new Error('Invalid data format');
      }

      return data.todos.map(todo => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
      }));
    } catch (error) {
      console.error('Failed to import todos:', error);
      return null;
    }
  }
}