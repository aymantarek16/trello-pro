"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Layout,
  Star,
  Settings,
  Plus,
  Activity,
  Trello,
  X,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { icon: Layout, label: "Boards", href: "/boards" },
  { icon: Star, label: "Starred", href: "/boards?filter=starred" },
  { icon: Activity, label: "Activity", href: "/activity" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2 px-4 py-4 mb-8">
        <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/30">
          <Trello className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
          Trello Pro
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href.split("?")[0];
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group text-sm font-medium",
                isActive
                  ? "bg-indigo-50/80 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 transition-colors",
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-slate-500 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 mt-4 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Workspaces
        </div>
        <button className="flex items-center w-full gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold">W</span>
          </div>
          <span>My Workspace</span>
          <Plus className="w-4 h-4 ml-auto" />
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-30 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700"
      >
        <Menu className="w-6 h-6 text-slate-600 dark:text-slate-400" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "md:hidden fixed left-0 top-0 h-full w-64 border-r border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-4 z-50 transform transition-transform duration-300",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/30">
              <Trello className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
              Trello Pro
            </span>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-full border-r border-white/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-4">
        <SidebarContent />
      </aside>
    </>
  );
}
