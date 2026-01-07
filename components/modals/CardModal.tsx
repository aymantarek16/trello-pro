/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useModalStore } from "@/store/useModalStore";
import { useBoardStore } from "@/store/useBoardStore";
import {
  X,
  Layout,
  AlignLeft,
  Tag,
  Calendar,
  CheckSquare,
  Plus,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToastStore } from "@/store/useToastStore";

const labelColors = [
  { name: "Red", class: "bg-red-500 text-white" },
  { name: "Orange", class: "bg-orange-500 text-white" },
  { name: "Yellow", class: "bg-yellow-500 text-white" },
  { name: "Green", class: "bg-green-500 text-white" },
  { name: "Blue", class: "bg-blue-500 text-white" },
  { name: "Purple", class: "bg-purple-500 text-white" },
  { name: "Pink", class: "bg-pink-500 text-white" },
];

const availableLabels = ["Strategy", "Design", "UI", "Dev", "Meeting", "Bug", "Feature"];

export function CardModal() {
  const { isOpen, onClose, type, data } = useModalStore();
  const {
    updateTicket,
    addChecklist,
    addChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
    deleteChecklist,
    addLabel,
    removeLabel,
  } = useBoardStore();
  const { success, error } = useToastStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [showLabelMenu, setShowLabelMenu] = useState(false);
  const [showChecklistMenu, setShowChecklistMenu] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState("");
  const [newChecklistItemText, setNewChecklistItemText] = useState<{ [key: string]: string }>({});
  const [dueDate, setDueDate] = useState("");

  // Sync data to local state
  useEffect(() => {
    if (data?.ticket) {
      setTitle(data.ticket.title || "");
      setDescription(data.ticket.description || "");
      setDueDate(data.ticket.dueDate || "");
    }
  }, [data]);

  if (!isOpen || type !== "card-details") return null;

  const { ticket, columnId, boardId } = data;

  const handleClose = () => {
    // Save any pending changes
    if (title !== ticket.title || description !== ticket.description || dueDate !== ticket.dueDate) {
      updateTicket(boardId, columnId, ticket.id, {
        title: title.trim() || ticket.title,
        description: description.trim(),
        dueDate: dueDate || undefined,
      });
    }
    onClose();
  };

  const handleTitleBlur = () => {
    if (title.trim() && title !== ticket.title) {
      updateTicket(boardId, columnId, ticket.id, { title: title.trim() });
      success("Card title updated");
    } else if (!title.trim()) {
      setTitle(ticket.title);
      error("Title cannot be empty");
    }
  };

  const handleDescriptionBlur = () => {
    updateTicket(boardId, columnId, ticket.id, { description: description.trim() });
    setIsEditingDescription(false);
    if (description !== ticket.description) {
      success("Description updated");
    }
  };

  const handleAddChecklist = () => {
    if (!newChecklistTitle.trim()) {
      error("Checklist title cannot be empty");
      return;
    }
    addChecklist(boardId, columnId, ticket.id, newChecklistTitle.trim());
    setNewChecklistTitle("");
    setShowChecklistMenu(false);
    success("Checklist added");
  };

  const handleAddChecklistItem = (checklistId: string) => {
    const text = newChecklistItemText[checklistId];
    if (!text?.trim()) {
      error("Item text cannot be empty");
      return;
    }
    addChecklistItem(boardId, columnId, ticket.id, checklistId, text.trim());
    setNewChecklistItemText({ ...newChecklistItemText, [checklistId]: "" });
    success("Item added");
  };

  const handleToggleChecklistItem = (
    checklistId: string,
    itemId: string,
    completed: boolean
  ) => {
    updateChecklistItem(boardId, columnId, ticket.id, checklistId, itemId, {
      completed: !completed,
    });
  };

  const handleDeleteChecklistItem = (checklistId: string, itemId: string) => {
    deleteChecklistItem(boardId, columnId, ticket.id, checklistId, itemId);
    success("Item deleted");
  };

  const handleDeleteChecklist = (checklistId: string) => {
    if (confirm("Are you sure you want to delete this checklist?")) {
      deleteChecklist(boardId, columnId, ticket.id, checklistId);
      success("Checklist deleted");
    }
  };

  const handleAddLabel = (label: string) => {
    if (ticket.labels?.includes(label)) {
      removeLabel(boardId, columnId, ticket.id, label);
      success("Label removed");
    } else {
      addLabel(boardId, columnId, ticket.id, label);
      success("Label added");
    }
    setShowLabelMenu(false);
  };

  const handleSetDueDate = () => {
    if (dueDate) {
      updateTicket(boardId, columnId, ticket.id, { dueDate });
      success("Due date set");
    }
  };

  const handleRemoveDueDate = () => {
    updateTicket(boardId, columnId, ticket.id, { dueDate: undefined });
    setDueDate("");
    success("Due date removed");
  };

  const getChecklistProgress = (checklist: any) => {
    if (!checklist.items || checklist.items.length === 0) return 0;
    const completed = checklist.items.filter((item: any) => item.completed).length;
    return Math.round((completed / checklist.items.length) * 100);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-10 duration-300 ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover Image Placeholder */}
        <div className="h-32 gradient-to-r from-indigo-500 to-purple-500 w-full shrink-0" />

        <div className="flex flex-col relative p-8 gap-8 overflow-y-auto">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 transition-colors text-white z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex gap-4">
            <Layout className="w-6 h-6 mt-1 text-slate-500 shrink-0" />
            <div className="flex-1">
              <input
                className="text-2xl font-bold text-slate-900 dark:text-white bg-transparent border-none focus:ring-2 focus:ring-indigo-500 rounded p-1 -ml-1 w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                placeholder="Card title..."
              />
              <p className="text-sm text-slate-500 mt-1">
                in list{" "}
                <span className="underline decoration-indigo-400 font-medium">
                  {data.columnTitle || columnId || "Unknown"}
                </span>
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column */}
            <div className="flex-1 space-y-6">
              {/* Labels */}
              <div className="flex flex-wrap gap-2">
                {ticket.labels?.map((label: string) => (
                  <button
                    key={label}
                    onClick={() => handleAddLabel(label)}
                    className="px-3 py-1 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-500/30 transition-colors flex items-center gap-1"
                  >
                    {label}
                    <X className="w-3 h-3" />
                  </button>
                ))}
                <div className="relative">
                  <button
                    onClick={() => setShowLabelMenu(!showLabelMenu)}
                    className="px-3 py-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 text-sm transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Labels
                  </button>
                  {showLabelMenu && (
                    <div className="absolute top-full left-0 mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-2 z-20 min-w-50">
                      <div className="text-xs font-semibold text-slate-400 mb-2 px-2">
                        Available Labels
                      </div>
                      {availableLabels.map((label) => (
                        <button
                          key={label}
                          onClick={() => handleAddLabel(label)}
                          className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                            ticket.labels?.includes(label)
                              ? "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300"
                              : "text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="flex gap-4">
                <AlignLeft className="w-6 h-6 mt-1 text-slate-500 shrink-0" />
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Description</h3>
                  {isEditingDescription ? (
                    <div className="space-y-2">
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onBlur={handleDescriptionBlur}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") {
                            setDescription(ticket.description || "");
                            setIsEditingDescription(false);
                          }
                        }}
                        placeholder="Add a more detailed description..."
                        className="w-full min-h-25 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleDescriptionBlur}
                          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setDescription(ticket.description || "");
                            setIsEditingDescription(false);
                          }}
                          className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => setIsEditingDescription(true)}
                      className="min-h-25 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-sm cursor-text hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      {description || (
                        <span className="text-slate-400">Add a more detailed description...</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Due Date */}
              {dueDate && (
                <div className="flex gap-4">
                  <Calendar className="w-6 h-6 mt-1 text-slate-500 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Due Date</h3>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        onBlur={handleSetDueDate}
                        className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm"
                      />
                      <button
                        onClick={handleRemoveDueDate}
                        className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Checklists */}
              {ticket.checklists?.map((checklist: any) => (
                <div key={checklist.id} className="flex gap-4">
                  <CheckSquare className="w-6 h-6 mt-1 text-slate-500 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {checklist.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">
                          {getChecklistProgress(checklist)}%
                        </span>
                        <button
                          onClick={() => handleDeleteChecklist(checklist.id)}
                          className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${getChecklistProgress(checklist)}%` }}
                      />
                    </div>
                    <div className="space-y-2">
                      {checklist.items.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 group"
                        >
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() =>
                              handleToggleChecklistItem(checklist.id, item.id, item.completed)
                            }
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          <span
                            className={`flex-1 text-sm ${
                              item.completed
                                ? "line-through text-slate-400 dark:text-slate-500"
                                : "text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {item.text}
                          </span>
                          <button
                            onClick={() => handleDeleteChecklistItem(checklist.id, item.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newChecklistItemText[checklist.id] || ""}
                          onChange={(e) =>
                            setNewChecklistItemText({
                              ...newChecklistItemText,
                              [checklist.id]: e.target.value,
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddChecklistItem(checklist.id);
                            }
                          }}
                          placeholder="Add an item..."
                          className="flex-1 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        <button
                          onClick={() => handleAddChecklistItem(checklist.id)}
                          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column (Actions) */}
            <div className="w-full md:w-48 space-y-3 shrink-0">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Add to card
              </span>
              <div className="relative">
                <button
                  onClick={() => setShowLabelMenu(!showLabelMenu)}
                  className="flex items-center gap-2 w-full p-2 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm transition-colors text-left"
                >
                  <Tag className="w-4 h-4" /> Labels
                </button>
              </div>
              <button
                onClick={() => setShowChecklistMenu(!showChecklistMenu)}
                className="flex items-center gap-2 w-full p-2 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm transition-colors text-left"
              >
                <CheckSquare className="w-4 h-4" /> Checklist
              </button>
              {showChecklistMenu && (
                <div className="absolute right-0 mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-3 z-20 min-w-62.5">
                  <input
                    type="text"
                    value={newChecklistTitle}
                    onChange={(e) => setNewChecklistTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddChecklist();
                      }
                      if (e.key === "Escape") {
                        setShowChecklistMenu(false);
                        setNewChecklistTitle("");
                      }
                    }}
                    placeholder="Checklist title..."
                    autoFocus
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddChecklist}
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowChecklistMenu(false);
                        setNewChecklistTitle("");
                      }}
                      className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              <div className="relative">
                <button
                  onClick={() => {
                    if (!dueDate) {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      setDueDate(tomorrow.toISOString().split("T")[0]);
                    }
                  }}
                  className="flex items-center gap-2 w-full p-2 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm transition-colors text-left"
                >
                  <Calendar className="w-4 h-4" /> Dates
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
