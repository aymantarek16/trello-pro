"use client";

import { Draggable } from "@hello-pangea/dnd";
import { Ticket, useBoardStore } from "@/store/useBoardStore";
import { useModalStore } from "@/store/useModalStore";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToastStore } from "@/store/useToastStore";

interface CardProps {
  ticket: Ticket;
  index: number;
  columnId: string;
  boardId: string;
}

export function Card({ ticket, index, columnId, boardId }: CardProps) {
  const { updateTicket, deleteTicket } = useBoardStore();
  const { onOpen } = useModalStore();
  const { success, error } = useToastStore();
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(ticket.title);

  const handleSave = () => {
    if (newTitle.trim()) {
      updateTicket(boardId, columnId, ticket.id, { title: newTitle.trim() });
      setIsEditing(false);
      success("Card updated");
    } else {
      error("Card title cannot be empty");
      setNewTitle(ticket.title);
      setIsEditing(false);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${ticket.title}"?`)) {
      deleteTicket(boardId, columnId, ticket.id);
      success("Card deleted");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      setNewTitle(ticket.title);
      setIsEditing(false);
    }
  };

  return (
    <Draggable draggableId={ticket.id} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          onClick={() => {
            if (!isEditing) {
              // Get column title from store
              const { getColumns } = useBoardStore.getState();
              const columns = getColumns(boardId);
              const column = columns.find((c) => c.id === columnId);
              onOpen("card-details", {
                ticket,
                columnId,
                boardId,
                columnTitle: column?.title || "Unknown",
              });
            }
          }}
          className={`group relative p-3 rounded-lg bg-white dark:bg-slate-800 border-2 shadow-sm transition-all hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer
            ${
              snapshot.isDragging
                ? "shadow-2xl ring-2 ring-indigo-500 rotate-2 scale-105 z-50 border-indigo-500"
                : "border-transparent"
            }
          `}
          style={provided.draggableProps.style}
        >
          {isEditing ? (
            <div
              className="flex flex-col gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <textarea
                className="w-full text-sm bg-transparent outline-none resize-none h-auto p-1 rounded focus:bg-white dark:focus:bg-slate-700 focus:ring-2 ring-indigo-500"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                autoFocus
                rows={2}
              />
            </div>
          ) : (
            <div className="flex justify-between items-start gap-2">
              <div className="flex flex-col gap-2 w-full">
                {/* Labels */}
                {ticket.labels && ticket.labels.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {ticket.labels.map((label) => (
                      <span
                        key={label}
                        className="h-2 w-8 rounded-full bg-blue-400/20 ring-1 ring-blue-500/50"
                        title={label}
                      />
                    ))}
                  </div>
                )}
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {ticket.title}
                </span>
                {/* Due date indicator */}
                {ticket.dueDate && (
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    📅 Due: {new Date(ticket.dueDate).toLocaleDateString()}
                  </div>
                )}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-all"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}
