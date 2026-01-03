import { TaskList } from '@/types/task';
import { Menu, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TaskHeaderProps {
  list: TaskList | undefined;
  taskCount: number;
  completedCount: number;
  onOpenSidebar: () => void;
}

export function TaskHeader({ list, taskCount, completedCount, onOpenSidebar }: TaskHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between px-4 py-4 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-secondary task-transition"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          
          <div>
            <h1 className="text-xl lg:text-2xl font-semibold text-foreground">
              {list?.name || 'Tasks'}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
              {completedCount > 0 && ` · ${completedCount} completed`}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-lg hover:bg-secondary task-transition">
              <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Sort by date</DropdownMenuItem>
            <DropdownMenuItem>Sort by name</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Clear completed
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
