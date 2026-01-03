import { useState } from 'react';
import { Task } from '@/types/task';
import { Check, Trash2, Calendar, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
}

export function TaskItem({ task, onToggle, onDelete, onUpdate }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editNotes, setEditNotes] = useState(task.notes || '');

  const formatDueDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !task.completed;

  const handleSave = () => {
    onUpdate(task.id, { title: editTitle, notes: editNotes });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setEditTitle(task.title);
      setEditNotes(task.notes || '');
      setIsEditing(false);
    }
  };

  return (
    <div
      className={cn(
        'group relative bg-card rounded-lg task-transition slide-in',
        'hover:bg-task-hover hover:shadow-soft',
        task.completed && 'opacity-60'
      )}
    >
      <div className="flex items-start gap-3 p-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={cn(
            'mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center task-transition flex-shrink-0',
            task.completed 
              ? 'bg-checkbox-checked border-checkbox-checked checkbox-pop' 
              : 'border-muted-foreground/40 hover:border-primary'
          )}
        >
          {task.completed && <Check className="w-3 h-3 text-primary-foreground" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0" onClick={() => !isEditing && setIsExpanded(!isExpanded)}>
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-b border-primary/30 focus:border-primary outline-none py-1 text-foreground"
                autoFocus
              />
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add notes..."
                className="w-full bg-transparent border-b border-border focus:border-primary/50 outline-none py-1 text-sm text-muted-foreground resize-none"
                rows={2}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="text-xs px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 task-transition"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditTitle(task.title);
                    setEditNotes(task.notes || '');
                    setIsEditing(false);
                  }}
                  className="text-xs px-3 py-1 text-muted-foreground hover:text-foreground task-transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="cursor-pointer">
              <p className={cn(
                'text-sm font-medium text-foreground task-transition',
                task.completed && 'line-through text-task-completed'
              )}>
                {task.title}
              </p>
              
              {/* Due date badge */}
              {task.dueDate && (
                <div className={cn(
                  'flex items-center gap-1 mt-1',
                  isOverdue ? 'text-destructive' : 'text-muted-foreground'
                )}>
                  <Calendar className="w-3 h-3" />
                  <span className="text-xs">{formatDueDate(task.dueDate)}</span>
                </div>
              )}

              {/* Notes preview */}
              {task.notes && !isExpanded && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                  {task.notes}
                </p>
              )}

              {/* Expanded notes */}
              {task.notes && isExpanded && (
                <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">
                  {task.notes}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 task-transition">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground task-transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive task-transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
