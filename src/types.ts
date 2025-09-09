export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  priority: Priority;
}

export type FilterType = 'all' | 'active' | 'completed';