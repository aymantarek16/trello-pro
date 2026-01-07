"use client";

import { BoardCanvas } from "@/components/board/BoardCanvas";
import { CardModal } from "@/components/modals/CardModal";
import { useParams } from "next/navigation";
import { useBoardStore } from "@/store/useBoardStore";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BoardPage() {
  const params = useParams();
  const boardId = params.id as string;
  const { boards, setCurrentBoard, updateBoard } = useBoardStore();
  const board = boards.find((b) => b.id === boardId);

  useEffect(() => {
    if (boardId) {
      setCurrentBoard(boardId);
    }
  }, [boardId, setCurrentBoard]);

  if (!board) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Board not found
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          The board you&rsquo;re looking for doesn&rsquo;t exist or has been deleted.
        </p>
        <Link
          href="/boards"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go to Boards
        </Link>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="h-14 border-b border-black/5 dark:border-white/5 bg-white/30 dark:bg-black/30 backdrop-blur-md px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/boards"
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </Link>
          <input
            value={board.title}
            onChange={(e) => {
              if (e.target.value.trim()) {
                updateBoard(boardId, { title: e.target.value.trim() });
              }
            }}
            onBlur={(e) => {
              if (!e.target.value.trim()) {
                e.target.value = board.title;
              }
            }}
            className="text-xl font-bold text-slate-900 dark:text-white bg-transparent border-none focus:ring-2 focus:ring-indigo-500 rounded px-2 -ml-2 outline-none"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-300"
              />
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs text-slate-500 font-medium">
              +5
            </div>
          </div>
        </div>
      </div>

      <BoardCanvas boardId={boardId} />
      <CardModal />
    </div>
  );
}
