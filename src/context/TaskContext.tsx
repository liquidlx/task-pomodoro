"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type Task = {
  id: string;
  title: string;
  description: string;
  totalTimeSpent: number; // in minutes
  completed?: boolean;
  pinned?: boolean;
  memo?: string;
};

type TaskContextType = {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "totalTimeSpent">) => void;
  editTask: (
    id: string,
    updates: Partial<Omit<Task, "id" | "totalTimeSpent">>
  ) => void;
  deleteTask: (id: string) => void;
  incrementTaskTime: (id: string, minutes: number) => void;
  toggleTaskCompleted: (id: string) => void;
  toggleTaskPinned: (id: string) => void;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const TASKS_STORAGE_KEY = "pomodoro_tasks";

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(TASKS_STORAGE_KEY);
    if (stored) setTasks(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Omit<Task, "id" | "totalTimeSpent">) => {
    setTasks((prev) => [
      {
        ...task,
        id: crypto.randomUUID(),
        totalTimeSpent: 0,
        completed: false,
        pinned: false,
        memo: "",
      },
      ...prev,
    ]);
  };

  const editTask = (
    id: string,
    updates: Partial<Omit<Task, "id" | "totalTimeSpent">>
  ) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const incrementTaskTime = (id: string, minutes: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, totalTimeSpent: task.totalTimeSpent + minutes }
          : task
      )
    );
  };

  const toggleTaskCompleted = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const toggleTaskPinned = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, pinned: !task.pinned } : task
      )
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        editTask,
        deleteTask,
        incrementTaskTime,
        toggleTaskCompleted,
        toggleTaskPinned,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within a TaskProvider");
  return context;
};
