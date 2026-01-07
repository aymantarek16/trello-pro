"use client";

import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Column } from "@/store/useBoardStore";
import { Card } from "./Card";
import { MoreHorizontal, Plus, Pencil, Trash2 } from "lucide-react";
import { useBoardStore } from "@/store/useBoardStore";
import { useToastStore } from "@/store/useToastStore";
import { useState } from "react";

interface ListProps {
  column: Column;
  index: number;
  boardId: string;
}

export function List({ column, index, boardId }: ListProps) {
  const { addTicket, updateColumn, deleteColumn } = useBoardStore();
  const { success, error } = useToastStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);
  const [showMenu, setShowMenu] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");

  const handleAddCard = () => {
    if (!newCardTitle.trim()) {
      error("Card title cannot be empty");
      return;
    }
    addTicket(boardId, column.id, newCardTitle.trim());
    setNewCardTitle("");
    setIsAddingCard(false);
    success("Card added successfully");
  };

  const handleUpdateTitle = () => {
    if (!newTitle.trim()) {
      error("List title cannot be empty");
      setNewTitle(column.title);
      setIsEditingTitle(false);
      return;
    }
    updateColumn(boardId, column.id, newTitle.trim());
    setIsEditingTitle(false);
    success("List renamed");
  };

  const handleDeleteList = () => {
    if (confirm(`Are you sure you want to delete "${column.title}"? This will delete all cards in this list.`)) {
      deleteColumn(boardId, column.id);
      success("List deleted");
      setShowMenu(false);
    }
  };

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="shrink-0 w-80 h-full max-h-full flex flex-col rounded-xl bg-slate-100/80 dark:bg-slate-900/50 backdrop-blur-md shadow-sm border border-white/20 dark:border-white/5"
        >
          {/* List Header */}
          <div
            {...provided.dragHandleProps}
            className="p-3 flex items-center justify-between group"
          >
            {isEditingTitle ? (
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onBlur={handleUpdateTitle}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleUpdateTitle();
                  if (e.key === "Escape") {
                    setNewTitle(column.title);
                    setIsEditingTitle(false);
                  }
                }}
                autoFocus
                className="flex-1 text-sm font-bold text-slate-700 dark:text-slate-200 bg-transparent border-none outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 -ml-2"
              />
            ) : (
              <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 px-2 flex-1">
                {column.title}
              </h2>
            )}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all text-slate-500"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-10 min-w-[140px]">
                  <button
                    onClick={() => {
                      setIsEditingTitle(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <Pencil className="w-4 h-4" />
                    Rename
                  </button>
                  <button
                    onClick={handleDeleteList}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Cards Area */}
          <Droppable droppableId={column.id} type="CARD">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`flex-1 overflow-y-auto overflow-x-hidden p-2 mx-1 rounded-lg transition-colors min-h-[100px] ${
                  snapshot.isDraggingOver
                    ? "bg-indigo-50/50 dark:bg-indigo-900/10"
                    : ""
                }`}
              >
                <div className="flex flex-col gap-2">
                  {column.tickets.length === 0 && (
                    <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
                      No cards yet
                    </div>
                  )}
                  {column.tickets.map((ticket, index) => (
                    <Card
                      key={ticket.id}
                      ticket={ticket}
                      index={index}
                      columnId={column.id}
                      boardId={boardId}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>

          {/* Footer / Add Card */}
          <div className="p-3">
            {isAddingCard ? (
              <div className="space-y-2">
                <textarea
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddCard();
                    }
                    if (e.key === "Escape") {
                      setIsAddingCard(false);
                      setNewCardTitle("");
                    }
                  }}
                  placeholder="Enter a title for this card..."
                  autoFocus
                  className="w-full p-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddCard}
                    className="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add Card
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingCard(false);
                      setNewCardTitle("");
                    }}
                    className="px-4 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingCard(true)}
                className="flex items-center gap-2 w-full p-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add a card
              </button>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
