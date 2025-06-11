"use client";

import React, { useEffect, useRef } from "react";
import { usePomodoro } from "../context/PomodoroContext";
import { useTasks } from "../context/TaskContext";
import { FiPause, FiPlay, FiX, FiCheck } from "react-icons/fi";

function formatTime(secs: number) {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function PomodoroView({ mode }: { mode: "work" | "rest" }) {
  const { activeTaskId, timeLeft, isRunning, pause, stop, resume } =
    usePomodoro();
  const { tasks, incrementTaskTime, toggleTaskCompleted } = useTasks();
  const lastMinuteRef = useRef<number | null>(null);

  const task = tasks.find((t) => t.id === activeTaskId);

  // Track time spent per task (increment only after a full minute has passed)
  useEffect(() => {
    if (mode !== "work" || !activeTaskId || !isRunning) {
      lastMinuteRef.current = null;
      return;
    }
    const currentMinute = Math.floor(timeLeft / 60);
    if (lastMinuteRef.current === null) {
      lastMinuteRef.current = currentMinute;
    } else if (currentMinute < lastMinuteRef.current) {
      // Only increment if a full minute has passed
      if (lastMinuteRef.current - currentMinute === 1) {
        incrementTaskTime(activeTaskId, 1);
      }
      lastMinuteRef.current = currentMinute;
    }
  }, [timeLeft, mode, activeTaskId, isRunning, incrementTaskTime]);

  if (!task) return null;

  const handleFinish = () => {
    if (activeTaskId) toggleTaskCompleted(activeTaskId);
    stop();
  };

  const handleResume = () => {
    if (activeTaskId) resume();
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[60vh] w-full transition-colors duration-500 ${
        mode === "rest" ? "bg-[var(--rest-accent)]/60" : "bg-transparent"
      } rounded-soft soft-shadow`}
      style={{
        boxShadow: "var(--shadow)",
        borderRadius: "var(--radius)",
        background: mode === "rest" ? "var(--rest-accent)" : "transparent",
        transition: "background 0.5s",
      }}
    >
      <div className="mb-6 text-center">
        <h2
          className="text-2xl font-semibold mb-2"
          style={{ color: "var(--primary-text)" }}
        >
          {task.title}
        </h2>
        <p
          className="text-base max-w-md mx-auto"
          style={{ color: "var(--secondary-text)" }}
        >
          {task.description}
        </p>
      </div>
      <div
        className="mb-4 text-base font-medium"
        style={{ color: mode === "rest" ? "#4B7B2B" : "var(--accent)" }}
      >
        {mode === "work" ? "Pomodoro" : "Rest"}
      </div>
      <div
        className="text-7xl font-mono mb-8"
        style={{ color: "var(--primary-text)", letterSpacing: "0.04em" }}
      >
        {formatTime(timeLeft)}
      </div>
      <div className="flex gap-6 mt-2">
        {isRunning ? (
          <button
            className="flex items-center gap-2 p-3 rounded-full bg-[var(--bg-dark)] hover:bg-[var(--bg-color)] text-[var(--text-muted)] hover:text-white border border-[var(--border)] transition-all"
            onClick={pause}
            title="Pause"
          >
            <FiPause size={22} />{" "}
            <span className="hidden sm:inline">Pause</span>
          </button>
        ) : (
          <button
            className="flex items-center gap-2 p-3 rounded-full bg-[var(--bg-dark)] hover:bg-[var(--bg-color)] text-[var(--text-muted)] hover:text-white border border-[var(--border)] transition-all"
            onClick={handleResume}
            title="Resume"
          >
            <FiPlay size={22} />{" "}
            <span className="hidden sm:inline">Resume</span>
          </button>
        )}
        <button
          className="p-3 rounded-full bg-[var(--bg-dark)] hover:bg-[var(--bg-color)] text-[var(--color-pink)] border border-[var(--border)] transition-all"
          onClick={stop}
          title="Stop"
        >
          <FiX size={22} />
        </button>
        <button
          className="p-3 rounded-full bg-[var(--bg-dark)] hover:bg-[var(--bg-color)] text-[var(--color-green)] border border-[var(--border)] transition-all"
          onClick={handleFinish}
          title="Finish task"
        >
          <FiCheck size={22} />
        </button>
      </div>
    </div>
  );
}
