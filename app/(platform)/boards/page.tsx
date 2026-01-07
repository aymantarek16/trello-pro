"use client";

import Link from "next/link";
import { Plus, MoreHorizontal, Star, Trash2 } from "lucide-react";
import { useBoardStore } from "@/store/useBoardStore";
import { useToastStore } from "@/store/useToastStore";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

const boardColors = [
  "from-pink-500 to-rose-500",
  "from-blue-500 to-indigo-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-cyan-400 to-blue-500",
  "from-green-400 to-emerald-500",
  "from-red-400 to-pink-500",
];

export default function BoardsPage() {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");
  const { boards, createBoard, deleteBoard, toggleStarBoard } = useBoardStore();
  const { success, error } = useToastStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [showDeleteMenu, setShowDeleteMenu] = useState<string | null>(null);

  const filteredBoards = filter === "starred" 
    ? boards.filter((b) => b.starred)
    : boards;

  const handleCreateBoard = () => {
    if (!newBoardTitle.trim()) {
      error("Board title cannot be empty");
      return;
    }
    const color = boardColors[Math.floor(Math.random() * boardColors.length)];
    createBoard(newBoardTitle.trim(), color);
    setNewBoardTitle("");
    setIsCreating(false);
    success("Board created successfully");
  };

  const handleDeleteBoard = (boardId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this board? This action cannot be undone.")) {
      deleteBoard(boardId);
      success("Board deleted successfully");
      setShowDeleteMenu(null);
    }
  };

  const handleToggleStar = (boardId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleStarBoard(boardId);
    const board = boards.find((b) => b.id === boardId);
    if (board?.starred) {
      success("Board starred");
    } else {
      success("Board unstarred");
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {filter === "starred" ? "Starred Boards" : "Your Boards"}
        </h1>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Board</span>
        </button>
      </div>

      {filteredBoards.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <Star className="w-12 h-12 text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            {filter === "starred" ? "No starred boards" : "No boards yet"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            {filter === "starred"
              ? "Star boards to see them here"
              : "Create your first board to get started"}
          </p>
          {filter !== "starred" && (
            <button
              onClick={() => setIsCreating(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Board
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Create Board Card */}
        {isCreating ? (
          <div className="group relative h-48 rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border-2 border-indigo-500 p-4 flex flex-col">
            <input
              type="text"
              placeholder="Board title..."
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateBoard();
                if (e.key === "Escape") {
                  setIsCreating(false);
                  setNewBoardTitle("");
                }
              }}
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-lg font-bold text-slate-900 dark:text-white placeholder:text-slate-400"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateBoard}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewBoardTitle("");
                }}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="group relative flex flex-col items-center justify-center p-6 h-48 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 transition-all duration-300"
          >
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors">
              <Plus className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
            </div>
            <span className="mt-4 font-medium text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              Create Board
            </span>
          </button>
        )}

        {/* Existing Boards */}
        {filteredBoards.map((board) => (
          <div key={board.id} className="group relative h-48 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 transform hover:-translate-y-1">
            <Link
              href={`/board/${board.id}`}
              className="block h-full"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${board.color} opacity-90 group-hover:opacity-100 transition-opacity`} />

              {/* Pattern Overlay */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

              {/* Content */}
              <div className="absolute inset-0 p-5 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-white tracking-wide shadow-sm pr-2">
                    {board.title}
                  </h3>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleToggleStar(board.id, e)}
                      className={`p-1.5 rounded-full transition-colors ${
                        board.starred
                          ? "text-yellow-400 bg-yellow-400/20"
                          : "text-white/70 hover:text-yellow-400 hover:bg-yellow-400/20 opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <Star className={`w-4 h-4 ${board.starred ? "fill-current" : ""}`} />
                    </button>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowDeleteMenu(showDeleteMenu === board.id ? null : board.id);
                        }}
                        className="p-1.5 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {showDeleteMenu === board.id && (
                        <div className="absolute right-0 top-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-10 min-w-[120px]">
                          <button
                            onClick={(e) => handleDeleteBoard(board.id, e)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 text-white/90 text-sm">
                  <span>View Board &rarr;</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
