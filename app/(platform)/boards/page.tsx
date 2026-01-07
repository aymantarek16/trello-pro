export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Suspense } from "react";
import BoardsClient from "./BoardsClient";

function BoardsSkeleton() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex items-center justify-between">
        <div className="h-9 w-56 bg-slate-200/70 dark:bg-slate-800 rounded-lg animate-pulse" />
        <div className="h-10 w-44 bg-slate-200/70 dark:bg-slate-800 rounded-lg animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-48 rounded-2xl bg-slate-200/70 dark:bg-slate-800 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

export default function BoardsPage() {
  return (
    <Suspense fallback={<BoardsSkeleton />}>
      <BoardsClient />
    </Suspense>
  );
}
