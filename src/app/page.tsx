"use client";

import React, { useState } from "react";
import TaskList from "../components/TaskList";
import SettingsModal from "../components/SettingsModal";
import { FiPlus, FiSettings } from "react-icons/fi";
import { useTasks } from "../context/TaskContext";
import PomodoroView from "../components/PomodoroView";
import { usePomodoro } from "../context/PomodoroContext";

export default function Home() {
  const { addTask } = useTasks();
  const { mode, start } = usePomodoro();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [inputDesc, setInputDesc] = useState("");
  const [inputError, setInputError] = useState("");

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      setInputError("Task title is required");
      return;
    }
    addTask({ title: input.trim(), description: inputDesc.trim() });
    setInput("");
    setInputDesc("");
    setInputError("");
  };

  return (
    <>
      <button
        className="absolute top-4 right-4 p-2 rounded-full bg-[var(--bg-dark)] hover:bg-[var(--bg-color)] text-[var(--text-muted)] hover:text-white border border-[var(--border)] transition-all z-10"
        onClick={() => setSettingsOpen(true)}
        title="Settings"
      >
        <FiSettings size={20} />
      </button>
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div
          className="w-full max-w-md bg-[#23242a] rounded-2xl shadow-2xl px-0 py-0 flex flex-col relative"
          style={{ boxShadow: "0 8px 32px 0 rgba(0,0,0,0.18)" }}
        >
          {mode !== "idle" ? (
            <div className="p-6">
              <PomodoroView mode={mode} />
            </div>
          ) : (
            <>
              <form
                onSubmit={handleAddTask}
                className="flex items-center gap-2 px-8 mt-4 mb-2"
              >
                <input
                  className="flex-1 bg-[#292a30] text-white placeholder-[#B8B8C6] rounded-lg px-4 py-2 border border-transparent focus:border-[#F25F8B] focus:outline-none text-base transition-all"
                  placeholder="Add a task..."
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setInputError("");
                  }}
                  maxLength={60}
                />
                <button className="text-[#B8B8C6]">
                  <FiPlus size={18} />
                </button>
              </form>
              {inputError && (
                <div className="text-[#F25F8B] text-xs px-8 pb-1">
                  {inputError}
                </div>
              )}
              {/* Task List */}
              <div className="px-2 pb-6 pt-2">
                <TaskList onStart={start} />
              </div>
            </>
          )}
        </div>
        <SettingsModal
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        />
      </div>
    </>
  );
}
