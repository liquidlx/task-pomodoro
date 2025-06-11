"use client";

import React, { useState, useEffect } from "react";
import { usePomodoro } from "../context/PomodoroContext";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SettingsModal({ open, onClose }: Props) {
  const { pomodoroDuration, restDuration, setDurations } = usePomodoro();
  const [pomodoro, setPomodoro] = useState(pomodoroDuration);
  const [rest, setRest] = useState(restDuration);

  useEffect(() => {
    setPomodoro(pomodoroDuration);
    setRest(restDuration);
  }, [pomodoroDuration, restDuration, open]);

  const handleSave = () => {
    setDurations(pomodoro, rest);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 transition-all">
      <div className="bg-[var(--bg-color)] rounded-soft soft-shadow border border-[var(--border)] p-8 w-full max-w-xs flex flex-col gap-6">
        <h3
          className="text-xl font-medium mb-2"
          style={{ color: "var(--color-pink)" }}
        >
          Settings
        </h3>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              Pomodoro duration (minutes)
            </span>
            <input
              type="number"
              min={1}
              max={120}
              className="p-3 rounded-soft border border-[var(--border)] bg-[var(--bg-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-pink)] soft-shadow text-white placeholder-[var(--text-muted)]"
              value={pomodoro}
              onChange={(e) => setPomodoro(Number(e.target.value))}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              Rest duration (minutes)
            </span>
            <input
              type="number"
              min={1}
              max={60}
              className="p-3 rounded-soft border border-[var(--border)] bg-[var(--bg-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-pink)] soft-shadow text-white placeholder-[var(--text-muted)]"
              value={rest}
              onChange={(e) => setRest(Number(e.target.value))}
            />
          </label>
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <button
            className="px-4 py-2 rounded-soft bg-[var(--bg-dark)] text-[var(--text-muted)] hover:bg-[var(--bg-color)] border border-[var(--border)] transition-all"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-soft bg-[var(--color-pink)] text-white font-medium hover:bg-[var(--accent-alt)] soft-shadow border border-[var(--border)] transition-all"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
