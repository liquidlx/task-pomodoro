"use client";

import React from "react";
import { useTasks } from "../context/TaskContext";
import {
  FiTrash2,
  FiCheckSquare,
  FiSquare,
  FiStar as FiStarFilled,
  FiPlay,
} from "react-icons/fi";

export default function TaskList({
  onStart,
}: {
  onStart: (taskId: string) => void;
}) {
  const { tasks, deleteTask, toggleTaskCompleted, toggleTaskPinned } =
    useTasks();

  // Sort: pinned first, then incomplete, then completed
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return 0;
  });

  if (tasks.length === 0) {
    return (
      <span className="block text-center text-[#B8B8C6] py-8">
        No tasks yet. Add your first task!
      </span>
    );
  }

  return (
    <ul className="w-full flex flex-col divide-y divide-[#2D2E36]">
      {sortedTasks.map((task) => (
        <li
          key={task.id}
          className={`group flex items-start px-2 py-4 relative bg-transparent transition-colors duration-150 ${
            task.completed ? "opacity-60" : ""
          }`}
        >
          {/* Pin icon */}
          <button
            className={`mr-3 mt-1 text-lg transition-colors ${
              task.pinned
                ? "text-[#F25F8B]"
                : "text-[#B8B8C6] hover:text-[#F25F8B]"
            }`}
            onClick={() => toggleTaskPinned(task.id)}
            title={task.pinned ? "Unpin" : "Pin"}
          >
            <FiStarFilled />
          </button>
          {/* Checkbox */}
          <button
            className={`mr-4 mt-1 text-xl transition-colors ${
              task.completed
                ? "text-[#F25F8B]"
                : "text-[#B8B8C6] hover:text-white"
            }`}
            onClick={() => toggleTaskCompleted(task.id)}
            title={task.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {task.completed ? <FiCheckSquare /> : <FiSquare />}
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`text-base font-medium ${
                  task.completed ? "line-through text-[#B8B8C6]" : "text-white"
                }`}
              >
                {task.title}
              </span>
            </div>
            {task.description && (
              <p className="text-xs mt-1 text-[#B8B8C6]">{task.description}</p>
            )}
            {task.memo && (
              <p className="text-xs mt-1 italic text-[#F25F8B]">{task.memo}</p>
            )}
          </div>
          {/* Start and Delete buttons */}
          <div className="flex gap-2 ml-4 items-center">
            <button
              className="text-[#B8B8C6] hover:text-[#F25F8B] p-1 rounded transition-colors"
              onClick={() => onStart(task.id)}
              title="Start timer"
            >
              <FiPlay size={18} />
            </button>
            <button
              className="text-[#B8B8C6] hover:text-[#F25F8B] p-1 rounded transition-colors"
              onClick={() => deleteTask(task.id)}
              title="Delete"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
