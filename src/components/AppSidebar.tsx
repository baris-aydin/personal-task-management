import { useState } from 'react';
import { TaskList } from '@/types/task';
import { 
  Inbox, 
  User, 
  Briefcase, 
  ShoppingCart, 
  List, 
  Plus,
  X,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  inbox: Inbox,
  user: User,
  briefcase: Briefcase,
  'shopping-cart': ShoppingCart,
  list: List,
};

interface AppSidebarProps {
  lists: TaskList[];
  activeListId: string;
  onSelectList: (id: string) => void;
  onAddList: (name: string) => void;
  onDeleteList: (id: string) => void;
  getTaskCount: (listId: string) => number;
  isOpen: boolean;
  onClose: () => void;
}

export function AppSidebar({
  lists,
  activeListId,
  onSelectList,
  onAddList,
  onDeleteList,
  getTaskCount,
  isOpen,
  onClose,
}: AppSidebarProps) {
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListName, setNewListName] = useState('');

  const handleAddList = () => {
    if (newListName.trim()) {
      onAddList(newListName.trim());
      setNewListName('');
      setIsAddingList(false);
    }
  };

  const defaultListIds = ['inbox', 'personal', 'work', 'shopping'];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-sidebar border-r border-sidebar-border',
          'flex flex-col task-transition',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <h1 className="text-xl font-semibold text-sidebar-foreground">TaskFlow</h1>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-sidebar-accent task-transition"
          >
            <ChevronLeft className="w-5 h-5 text-sidebar-foreground" />
          </button>
        </div>

        {/* Lists */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {lists.map(list => {
            const Icon = iconMap[list.icon] || List;
            const count = getTaskCount(list.id);
            const isActive = list.id === activeListId;
            const isDefault = defaultListIds.includes(list.id);

            return (
              <div
                key={list.id}
                className={cn(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer task-transition',
                  isActive 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
                onClick={() => {
                  onSelectList(list.id);
                  onClose();
                }}
              >
                <Icon className={cn(
                  'w-5 h-5 flex-shrink-0',
                  isActive ? 'text-sidebar-primary' : 'text-sidebar-foreground/70'
                )} />
                <span className="flex-1 text-sm font-medium truncate">{list.name}</span>
                {count > 0 && (
                  <span className={cn(
                    'text-xs font-medium px-1.5 py-0.5 rounded-full',
                    isActive ? 'bg-sidebar-primary/20 text-sidebar-primary' : 'text-sidebar-foreground/50'
                  )}>
                    {count}
                  </span>
                )}
                {!isDefault && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteList(list.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 hover:text-destructive task-transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Add List */}
          {isAddingList ? (
            <div className="px-3 py-2">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddList();
                  if (e.key === 'Escape') {
                    setIsAddingList(false);
                    setNewListName('');
                  }
                }}
                placeholder="List name..."
                className="w-full bg-sidebar-accent/50 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-sidebar-ring"
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleAddList}
                  className="flex-1 px-3 py-1.5 bg-sidebar-primary text-sidebar-primary-foreground text-xs rounded-md hover:bg-sidebar-primary/90 task-transition"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setIsAddingList(false);
                    setNewListName('');
                  }}
                  className="px-3 py-1.5 text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground task-transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingList(true)}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 task-transition"
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm font-medium">New list</span>
            </button>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/50 text-center">
            Organize your tasks efficiently
          </p>
        </div>
      </aside>
    </>
  );
}
