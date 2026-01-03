import { useCallback, useEffect, useMemo, useState } from "react";
import { Task, TaskList, DEFAULT_LISTS } from "@/types/task";
import { api } from "@/lib/api";

const ACTIVE_LIST_KEY = "taskflow_active_list";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<TaskList[]>(DEFAULT_LISTS);
  const [activeListId, setActiveListIdState] = useState<string>(
    localStorage.getItem(ACTIVE_LIST_KEY) ?? "inbox"
  );
  const [loading, setLoading] = useState(true);

  const setActiveListId = useCallback((id: string) => {
    setActiveListIdState(id);
    localStorage.setItem(ACTIVE_LIST_KEY, id);
  }, []);

  // Initial load: lists + tasks
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [listRes, taskRes] = await Promise.all([
          api<{ lists: TaskList[] }>("/api/lists"),
          api<{ tasks: Task[] }>("/api/tasks")
        ]);

        setLists(listRes.lists.length ? listRes.lists : DEFAULT_LISTS);
        setTasks(taskRes.tasks ?? []);
      } finally {
        setLoading(false);
      }
    }

    load().catch(() => {
      setLoading(false);
    });
  }, []);

  const addTask = useCallback(
    async (title: string, notes?: string, dueDate?: string) => {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title,
        notes,
        dueDate,
        completed: false,
        listId: activeListId,
        createdAt: new Date().toISOString()
      };

      const res = await api<{ task: Task }>("/api/tasks", {
        method: "POST",
        body: newTask
      });

      setTasks((prev) => [res.task, ...prev]);
      return res.task;
    },
    [activeListId]
  );

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    const res = await api<{ task: Task }>(`/api/tasks/${id}`, {
      method: "PATCH",
      body: updates
    });

    setTasks((prev) => prev.map((t) => (t.id === id ? res.task : t)));
    return res.task;
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    await api<void>(`/api/tasks/${id}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleComplete = useCallback(
    async (id: string) => {
      const existing = tasks.find((t) => t.id === id);
      if (!existing) return;

      const res = await api<{ task: Task }>(`/api/tasks/${id}`, {
        method: "PATCH",
        body: { completed: !existing.completed }
      });

      setTasks((prev) => prev.map((t) => (t.id === id ? res.task : t)));
    },
    [tasks]
  );

  const addList = useCallback(async (name: string, icon: string = "list") => {
    const newList: TaskList = {
      id: crypto.randomUUID(),
      name,
      icon
    };

    const res = await api<{ list: TaskList }>("/api/lists", {
      method: "POST",
      body: newList
    });

    setLists((prev) => [...prev, res.list]);
    return res.list;
  }, []);

  const deleteList = useCallback(
    async (id: string) => {
      // keep same behavior: don't delete defaults
      if (DEFAULT_LISTS.some((l) => l.id === id)) return;

      await api<void>(`/api/lists/${id}`, { method: "DELETE" });

      setLists((prev) => prev.filter((l) => l.id !== id));
      setTasks((prev) => prev.filter((t) => t.listId !== id));
      if (activeListId === id) setActiveListId("inbox");
    },
    [activeListId, setActiveListId]
  );

  const getTasksByList = useCallback(
    (listId: string) => tasks.filter((t) => t.listId === listId),
    [tasks]
  );

  const getActiveList = useCallback(
    () => lists.find((l) => l.id === activeListId) ?? lists[0],
    [lists, activeListId]
  );

  const getTaskCount = useCallback(
    (listId: string) => tasks.filter((t) => t.listId === listId).length,
    [tasks]
  );

  const apiReady = useMemo(() => !loading, [loading]);

  return {
    tasks,
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
    apiReady
  };
}

