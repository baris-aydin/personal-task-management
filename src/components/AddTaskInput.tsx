import { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';

interface AddTaskInputProps {
  onAdd: (title: string, notes?: string, dueDate?: string) => void;
}

export function AddTaskInput({ onAdd }: AddTaskInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) return;
    
    onAdd(
      title.trim(), 
      notes.trim() || undefined, 
      dueDate ? dueDate.toISOString() : undefined
    );
    
    setTitle('');
    setNotes('');
    setDueDate(undefined);
    setIsExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      setIsExpanded(false);
      setTitle('');
      setNotes('');
      setDueDate(undefined);
    }
  };

  return (
    <div 
      className={cn(
        'bg-card rounded-xl task-transition shadow-soft',
        isExpanded && 'shadow-medium ring-1 ring-primary/20'
      )}
    >
      <div className="flex items-center gap-3 p-3">
        <div className={cn(
          'w-5 h-5 rounded-full border-2 border-dashed flex items-center justify-center task-transition',
          isExpanded ? 'border-primary' : 'border-muted-foreground/30'
        )}>
          <Plus className={cn(
            'w-3 h-3 task-transition',
            isExpanded ? 'text-primary' : 'text-muted-foreground/50'
          )} />
        </div>
        
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          onKeyDown={handleKeyDown}
          placeholder="Add a task..."
          className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/60"
        />
      </div>

      {isExpanded && (
        <div className="px-3 pb-3 space-y-3 fade-in">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add notes..."
            className="w-full bg-secondary/50 rounded-lg px-3 py-2 text-sm outline-none resize-none placeholder:text-muted-foreground/60 focus:bg-secondary"
            rows={2}
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs task-transition',
                      dueDate 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    {dueDate ? format(dueDate, 'MMM d') : 'Due date'}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dueDate}
                    onSelect={(date) => {
                      setDueDate(date);
                      setCalendarOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {dueDate && (
                <button
                  onClick={() => setDueDate(undefined)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsExpanded(false);
                  setTitle('');
                  setNotes('');
                  setDueDate(undefined);
                }}
                className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground task-transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!title.trim()}
                className={cn(
                  'px-4 py-1.5 text-xs rounded-md task-transition',
                  title.trim() 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                    : 'bg-secondary text-muted-foreground cursor-not-allowed'
                )}
              >
                Add task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
