import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { AppSidebar } from '@/components/AppSidebar';
import { TaskHeader } from '@/components/TaskHeader';
import { AddTaskInput } from '@/components/AddTaskInput';
import { TaskList } from '@/components/TaskList';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const {
    lists,
    activeListId,
    setActiveListId,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    addList,
    deleteList,
    getTasksByList,
    getActiveList,
    getTaskCount,
  } = useTasks();

  const currentTasks = getTasksByList(activeListId);
  const activeList = getActiveList();
  const activeTasks = currentTasks.filter(t => !t.completed);
  const completedTasks = currentTasks.filter(t => t.completed);

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar
        lists={lists}
        activeListId={activeListId}
        onSelectList={setActiveListId}
        onAddList={addList}
        onDeleteList={deleteList}
        getTaskCount={getTaskCount}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col min-h-screen lg:ml-0">
        <TaskHeader
          list={activeList}
          taskCount={activeTasks.length}
          completedCount={completedTasks.length}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <div className="flex-1 px-4 py-6 lg:px-8 max-w-3xl w-full mx-auto">
          <div className="mb-6">
            <AddTaskInput onAdd={addTask} />
          </div>

          <TaskList
            tasks={currentTasks}
            onToggle={toggleComplete}
            onDelete={deleteTask}
            onUpdate={updateTask}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
