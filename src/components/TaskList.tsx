import { Task } from '@/types/task';
import { TaskItem } from './TaskItem';
import { CheckCircle2 } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
}

export function TaskList({ tasks, onToggle, onDelete, onUpdate }: TaskListProps) {
  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center fade-in">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">No tasks yet</h3>
        <p className="text-sm text-muted-foreground">Add a task to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <div className="space-y-2">
          {activeTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 py-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground font-medium px-2">
              Completed ({completedTasks.length})
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
          {completedTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
