"use client";

import { Search, Bell, HelpCircle, Menu } from "lucide-react";
import { useState } from "react";
import { useBoardStore } from "@/store/useBoardStore";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { boards } = useBoardStore();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
  };

  const searchResults = searchQuery
    ? boards.flatMap((board) =>
        board.columns.flatMap((column) =>
          column.tickets
            .filter(
              (ticket) =>
                ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ticket.description?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((ticket) => ({
              boardId: board.id,
              boardTitle: board.title,
              columnTitle: column.title,
              ticket,
            }))
        )
      )
    : [];

  const handleResultClick = (boardId: string) => {
    router.push(`/board/${boardId}`);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  return (
    <header className="h-16 border-b border-white/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl px-6 flex items-center justify-between z-20 sticky top-0">
      {/* Mobile Menu Trigger Placeholder */}
      <div className="flex items-center gap-4 md:hidden">
        <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
      </div>

      {/* Global Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md relative">
        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search boards and cards..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setShowSearchResults(searchQuery.length > 0)}
            onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
            className="w-full pl-10 pr-4 py-2 bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-slate-800 transition-all placeholder:text-slate-400"
          />
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 max-h-96 overflow-y-auto z-50">
              {searchResults.map((result, idx) => (
                <button
                  key={`${result.boardId}-${result.ticket.id}-${idx}`}
                  onClick={() => handleResultClick(result.boardId)}
                  className="w-full px-4 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                >
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {result.ticket.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {result.boardTitle} • {result.columnTitle}
                  </p>
                </button>
              ))}
            </div>
          )}
          {showSearchResults && searchQuery && searchResults.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-4 z-50">
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                No results found
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
        </button>
        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 ring-2 ring-white dark:ring-slate-800 cursor-pointer shadow-md" />
      </div>
    </header>
  );
}
