"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { useBoardStore } from "@/store/useBoardStore";
import { useToastStore } from "@/store/useToastStore";
import { List } from "./List";
import { Plus } from "lucide-react";

interface BoardCanvasProps {
  boardId: string;
}

export function BoardCanvas({ boardId }: BoardCanvasProps) {
  const { getColumns, moveColumn, moveTicket, addColumn } = useBoardStore();
  const { success, error } = useToastStore();
  const [isMounted, setIsMounted] = useState(false);
  const columns = getColumns(boardId);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    try {
      // Move Column
      if (type === "COLUMN") {
        moveColumn(boardId, source.index, destination.index);
        return;
      }

      // Move Ticket
      moveTicket(
        boardId,
        source.droppableId,
        destination.droppableId,
        source.index,
        destination.index
      );
    } catch (err) {
      error("Failed to move item");
    }
  };

  const handleAddList = () => {
    const title = prompt("Enter list title:");
    if (title?.trim()) {
      addColumn(boardId, title.trim());
      success("List created successfully");
    }
  };

  if (!isMounted) return null; // Avoid hydration mismatch

  if (columns.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            No lists yet
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            Create your first list to get started
          </p>
          <button
            onClick={handleAddList}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" type="COLUMN" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex h-full gap-6 p-6"
            >
              {columns.map((column, index) => (
                <List key={column.id} column={column} index={index} boardId={boardId} />
              ))}
              {provided.placeholder}

              {/* Add List Button */}
              <div className="shrink-0 w-80">
                <button
                  onClick={handleAddList}
                  className="w-full rounded-xl bg-white/40 dark:bg-black/40 backdrop-blur-md p-4 flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-black/60 transition-colors font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Add another list
                </button>
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
