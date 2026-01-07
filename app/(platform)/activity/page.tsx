"use client";

import { useBoardStore } from "@/store/useBoardStore";
import { Activity, Clock } from "lucide-react";

function formatDistanceToNow(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return then.toLocaleDateString();
}

export default function ActivityPage() {
  const { boards } = useBoardStore();

  // Generate activity log from boards
  const activities = boards.flatMap((board) => {
    const boardActivities: Array<{
      id: string;
      type: string;
      message: string;
      timestamp: string;
      boardTitle: string;
    }> = [];

    // Board creation
    boardActivities.push({
      id: `board-${board.id}-created`,
      type: "board-created",
      message: `Board "${board.title}" was created`,
      timestamp: board.createdAt,
      boardTitle: board.title,
    });

    // Board updates
    if (board.updatedAt !== board.createdAt) {
      boardActivities.push({
        id: `board-${board.id}-updated`,
        type: "board-updated",
        message: `Board "${board.title}" was updated`,
        timestamp: board.updatedAt,
        boardTitle: board.title,
      });
    }

    // Column activities
    board.columns.forEach((column) => {
      column.tickets.forEach((ticket) => {
        if (ticket.updatedAt !== ticket.createdAt) {
          boardActivities.push({
            id: `ticket-${ticket.id}-updated`,
            type: "ticket-updated",
            message: `Card "${ticket.title}" was updated in "${column.title}"`,
            timestamp: ticket.updatedAt,
            boardTitle: board.title,
          });
        }
      });
    });

    return boardActivities;
  });

  // Sort by timestamp (newest first)
  activities.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          <Activity className="w-12 h-12 text-slate-400" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          No activity yet
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Activity from your boards will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
          Activity
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Recent activity across all your boards
        </p>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex gap-4 p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
          >
            <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg shrink-0">
              <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {activity.message}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {formatDistanceToNow(activity.timestamp)}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {activity.boardTitle}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

