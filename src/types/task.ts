export interface Task {
  id: string;
  title: string;
  notes?: string;
  completed: boolean;
  dueDate?: string;
  listId: string;
  createdAt: string;
}

export interface TaskList {
  id: string;
  name: string;
  icon: string;
  color?: string;
}

export const DEFAULT_LISTS: TaskList[] = [
  { id: 'inbox', name: 'Inbox', icon: 'inbox' },
  { id: 'personal', name: 'Personal', icon: 'user' },
  { id: 'work', name: 'Work', icon: 'briefcase' },
  { id: 'shopping', name: 'Shopping', icon: 'shopping-cart' },
];
