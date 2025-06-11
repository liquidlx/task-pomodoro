"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type PomodoroMode = "idle" | "work" | "rest";

type PomodoroContextType = {
  mode: PomodoroMode;
  activeTaskId: string | null;
  timeLeft: number; // seconds
  isRunning: boolean;
  pomodoroDuration: number; // minutes
  restDuration: number; // minutes
  start: (taskId: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setDurations: (pomodoro: number, rest: number) => void;
};

const PomodoroContext = createContext<PomodoroContextType | undefined>(
  undefined
);

const SETTINGS_KEY = "pomodoro_settings";

export const PomodoroProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<PomodoroMode>("idle");
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [pomodoroDuration, setPomodoroDuration] = useState(45);
  const [restDuration, setRestDuration] = useState(5);

  // Load settings from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const { pomodoro, rest } = JSON.parse(stored);
      setPomodoroDuration(pomodoro ?? 45);
      setRestDuration(rest ?? 5);
    }
  }, []);

  // Timer logic
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Auto-switch modes
  useEffect(() => {
    if (isRunning && timeLeft === 0) {
      if (mode === "work") {
        setMode("rest");
        setTimeLeft(restDuration * 60);
      } else if (mode === "rest") {
        setMode("idle");
        setActiveTaskId(null);
        setIsRunning(false);
      }
    }
  }, [isRunning, timeLeft, mode, restDuration]);

  const start = (taskId: string) => {
    setActiveTaskId(taskId);
    setMode("work");
    setTimeLeft(pomodoroDuration * 60);
    setIsRunning(true);
  };

  const pause = () => setIsRunning(false);
  const resume = () => setIsRunning(true);
  const stop = () => {
    setIsRunning(false);
    setMode("idle");
    setActiveTaskId(null);
    setTimeLeft(0);
  };

  const setDurations = (pomodoro: number, rest: number) => {
    setPomodoroDuration(pomodoro);
    setRestDuration(rest);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ pomodoro, rest }));
  };

  return (
    <PomodoroContext.Provider
      value={{
        mode,
        activeTaskId,
        timeLeft,
        isRunning,
        pomodoroDuration,
        restDuration,
        start,
        pause,
        resume,
        stop,
        setDurations,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoro = () => {
  const context = useContext(PomodoroContext);
  if (!context)
    throw new Error("usePomodoro must be used within a PomodoroProvider");
  return context;
};
