"use client";

import { Settings, Moon, Sun, Palette, Bell, User, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useBoardStore } from "@/store/useBoardStore";
import { useToastStore } from "@/store/useToastStore";

export default function SettingsPage() {
  const { boards, deleteBoard } = useBoardStore();
  const { success, error } = useToastStore();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        setTheme("dark");
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    success("Theme updated");
  };

  const handleClearAllData = () => {
    if (
      confirm(
        "Are you sure you want to clear all data? This will delete all boards and cannot be undone."
      )
    ) {
      boards.forEach((board) => deleteBoard(board.id));
      localStorage.removeItem("board-storage");
      success("All data cleared");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage your preferences and account settings
        </p>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Appearance</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
              Theme
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => handleThemeChange("light")}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  theme === "light"
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/20"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <Sun className="w-5 h-5" />
                <span className="font-medium">Light</span>
              </button>
              <button
                onClick={() => handleThemeChange("dark")}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  theme === "dark"
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/20"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <Moon className="w-5 h-5" />
                <span className="font-medium">Dark</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Notifications
          </h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                Email notifications
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Receive email updates about your boards
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                Browser notifications
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Get notified in your browser
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Trash2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Data Management
          </h2>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
              Clear all boards and data. This action cannot be undone.
            </p>
            <button
              onClick={handleClearAllData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Clear All Data
            </button>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">About</h2>
        </div>
        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <p>Trello Pro v1.0.0</p>
          <p>Built with Next.js, React, and Zustand</p>
        </div>
      </div>
    </div>
  );
}

