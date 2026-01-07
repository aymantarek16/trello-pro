import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface Ticket {
  id: string;
  title: string;
  description?: string;
  labels?: string[];
  checklists?: Checklist[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  tickets: Ticket[];
}

export interface Board {
  id: string;
  title: string;
  color: string;
  starred: boolean;
  columns: Column[];
  createdAt: string;
  updatedAt: string;
}

interface BoardState {
  boards: Board[];
  currentBoardId: string | null;
  
  // Board operations
  setCurrentBoard: (boardId: string) => void;
  getCurrentBoard: () => Board | null;
  createBoard: (title: string, color?: string) => string;
  updateBoard: (boardId: string, updates: Partial<Pick<Board, 'title' | 'color'>>) => void;
  deleteBoard: (boardId: string) => void;
  toggleStarBoard: (boardId: string) => void;
  getStarredBoards: () => Board[];
  
  // Column operations
  getColumns: (boardId: string) => Column[];
  setColumns: (boardId: string, columns: Column[]) => void;
  moveColumn: (boardId: string, fromIndex: number, toIndex: number) => void;
  addColumn: (boardId: string, title: string) => void;
  updateColumn: (boardId: string, columnId: string, title: string) => void;
  deleteColumn: (boardId: string, columnId: string) => void;
  
  // Ticket operations
  moveTicket: (
    boardId: string,
    sourceColId: string,
    destColId: string,
    sourceIndex: number,
    destIndex: number
  ) => void;
  addTicket: (boardId: string, columnId: string, title: string) => void;
  updateTicket: (boardId: string, columnId: string, ticketId: string, updates: Partial<Ticket>) => void;
  deleteTicket: (boardId: string, columnId: string, ticketId: string) => void;
  
  // Ticket detail operations
  addChecklist: (boardId: string, columnId: string, ticketId: string, title: string) => void;
  updateChecklistItem: (
    boardId: string,
    columnId: string,
    ticketId: string,
    checklistId: string,
    itemId: string,
    updates: Partial<ChecklistItem>
  ) => void;
  addChecklistItem: (
    boardId: string,
    columnId: string,
    ticketId: string,
    checklistId: string,
    text: string
  ) => void;
  deleteChecklistItem: (
    boardId: string,
    columnId: string,
    ticketId: string,
    checklistId: string,
    itemId: string
  ) => void;
  deleteChecklist: (
    boardId: string,
    columnId: string,
    ticketId: string,
    checklistId: string
  ) => void;
  addLabel: (boardId: string, columnId: string, ticketId: string, label: string) => void;
  removeLabel: (boardId: string, columnId: string, ticketId: string, label: string) => void;
}

// Initial Mock Data
const createInitialBoard = (id: string, title: string, color: string, starred = false): Board => {
  const now = new Date().toISOString();
  return {
    id,
    title,
    color,
    starred,
    createdAt: now,
    updatedAt: now,
    columns: [
      {
        id: `${id}-col-1`,
        title: "To Do",
        tickets: [
          {
            id: `${id}-tick-1`,
            title: "Research Competitors",
            labels: ["Strategy"],
            description: "",
            createdAt: now,
            updatedAt: now,
          },
          {
            id: `${id}-tick-2`,
            title: "Design System Draft",
            labels: ["Design", "UI"],
            description: "",
            createdAt: now,
            updatedAt: now,
          },
        ],
      },
      {
        id: `${id}-col-2`,
        title: "In Progress",
        tickets: [
          {
            id: `${id}-tick-3`,
            title: "Setup Next.js Repo",
            labels: ["Dev"],
            description: "",
            createdAt: now,
            updatedAt: now,
          },
        ],
      },
      {
        id: `${id}-col-3`,
        title: "Done",
        tickets: [
          {
            id: `${id}-tick-4`,
            title: "Project Kickoff",
            labels: ["Meeting"],
            description: "",
            createdAt: now,
            updatedAt: now,
          },
        ],
      },
    ],
  };
};

const initialBoards: Board[] = [
  createInitialBoard("1", "Product Launch", "from-pink-500 to-rose-500", false),
  createInitialBoard("2", "Engineering", "from-blue-500 to-indigo-500", true),
  createInitialBoard("3", "Marketing Campaign", "from-amber-400 to-orange-500", false),
  createInitialBoard("4", "Design Systems", "from-emerald-400 to-cyan-500", false),
];

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      boards: initialBoards,
      currentBoardId: initialBoards[0]?.id || null,

      setCurrentBoard: (boardId) => set({ currentBoardId: boardId }),

      getCurrentBoard: () => {
        const state = get();
        return state.boards.find((b) => b.id === state.currentBoardId) || null;
      },

      createBoard: (title, color = "from-indigo-500 to-purple-500") => {
        const boardId = `board-${Date.now()}`;
        const newBoard = createInitialBoard(boardId, title, color, false);
        set((state) => ({
          boards: [...state.boards, newBoard],
          currentBoardId: boardId,
        }));
        return boardId;
      },

      updateBoard: (boardId, updates) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId
              ? { ...b, ...updates, updatedAt: new Date().toISOString() }
              : b
          ),
        })),

      deleteBoard: (boardId) =>
        set((state) => {
          const filtered = state.boards.filter((b) => b.id !== boardId);
          return {
            boards: filtered,
            currentBoardId: filtered.length > 0 ? filtered[0].id : null,
          };
        }),

      toggleStarBoard: (boardId) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId ? { ...b, starred: !b.starred } : b
          ),
        })),

      getStarredBoards: () => get().boards.filter((b) => b.starred),

      getColumns: (boardId) => {
        const board = get().boards.find((b) => b.id === boardId);
        return board?.columns || [];
      },

      setColumns: (boardId, columns) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId
              ? { ...b, columns, updatedAt: new Date().toISOString() }
              : b
          ),
        })),

      moveColumn: (boardId, fromIndex, toIndex) =>
        set((state) => {
          const board = state.boards.find((b) => b.id === boardId);
          if (!board) return state;

          const newColumns = [...board.columns];
          const [removed] = newColumns.splice(fromIndex, 1);
          newColumns.splice(toIndex, 0, removed);

          return {
            boards: state.boards.map((b) =>
              b.id === boardId
                ? { ...b, columns: newColumns, updatedAt: new Date().toISOString() }
                : b
            ),
          };
        }),

      addColumn: (boardId, title) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId
              ? {
                  ...b,
                  columns: [
                    ...b.columns,
                    { id: `col-${Date.now()}`, title, tickets: [] },
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : b
          ),
        })),

      updateColumn: (boardId, columnId, title) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId
              ? {
                  ...b,
                  columns: b.columns.map((c) =>
                    c.id === columnId ? { ...c, title } : c
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : b
          ),
        })),

      deleteColumn: (boardId, columnId) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId
              ? {
                  ...b,
                  columns: b.columns.filter((c) => c.id !== columnId),
                  updatedAt: new Date().toISOString(),
                }
              : b
          ),
        })),

      moveTicket: (boardId, sourceColId, destColId, sourceIndex, destIndex) =>
        set((state) => {
          const board = state.boards.find((b) => b.id === boardId);
          if (!board) return state;

          const newColumns = [...board.columns];
          const sourceCol = newColumns.find((c) => c.id === sourceColId);
          const destCol = newColumns.find((c) => c.id === destColId);

          if (!sourceCol || !destCol) return state;

          if (sourceColId !== destColId) {
            const [movedTicket] = sourceCol.tickets.splice(sourceIndex, 1);
            destCol.tickets.splice(destIndex, 0, movedTicket);
          } else {
            const [movedTicket] = sourceCol.tickets.splice(sourceIndex, 1);
            sourceCol.tickets.splice(destIndex, 0, movedTicket);
          }

          return {
            boards: state.boards.map((b) =>
              b.id === boardId
                ? { ...b, columns: newColumns, updatedAt: new Date().toISOString() }
                : b
            ),
          };
        }),

      addTicket: (boardId, columnId, title) =>
        set((state) => {
          const now = new Date().toISOString();
          return {
            boards: state.boards.map((b) =>
              b.id === boardId
                ? {
                    ...b,
                    columns: b.columns.map((col) =>
                      col.id === columnId
                        ? {
                            ...col,
                            tickets: [
                              ...col.tickets,
                              {
                                id: `tick-${Date.now()}`,
                                title,
                                description: "",
                                createdAt: now,
                                updatedAt: now,
                              },
                            ],
                          }
                        : col
                    ),
                    updatedAt: now,
                  }
                : b
            ),
          };
        }),

      updateTicket: (boardId, columnId, ticketId, updates) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId
              ? {
                  ...b,
                  columns: b.columns.map((col) =>
                    col.id === columnId
                      ? {
                          ...col,
                          tickets: col.tickets.map((t) =>
                            t.id === ticketId
                              ? { ...t, ...updates, updatedAt: new Date().toISOString() }
                              : t
                          ),
                        }
                      : col
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : b
          ),
        })),

      deleteTicket: (boardId, columnId, ticketId) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId
              ? {
                  ...b,
                  columns: b.columns.map((col) =>
                    col.id === columnId
                      ? { ...col, tickets: col.tickets.filter((t) => t.id !== ticketId) }
                      : col
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : b
          ),
        })),

      addChecklist: (boardId, columnId, ticketId, title) =>
        set((state) => {
          const checklistId = `checklist-${Date.now()}`;
          return {
            boards: state.boards.map((b) =>
              b.id === boardId
                ? {
                    ...b,
                    columns: b.columns.map((col) =>
                      col.id === columnId
                        ? {
                            ...col,
                            tickets: col.tickets.map((t) =>
                              t.id === ticketId
                                ? {
                                    ...t,
                                    checklists: [
                                      ...(t.checklists || []),
                                      { id: checklistId, title, items: [] },
                                    ],
                                    updatedAt: new Date().toISOString(),
                                  }
                                : t
                            ),
                          }
                        : col
                    ),
                    updatedAt: new Date().toISOString(),
                  }
                : b
            ),
          };
        }),

      updateChecklistItem: (boardId, columnId, ticketId, checklistId, itemId, updates) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId
              ? {
                  ...b,
                  columns: b.columns.map((col) =>
                    col.id === columnId
                      ? {
                          ...col,
                          tickets: col.tickets.map((t) =>
                            t.id === ticketId
                              ? {
                                  ...t,
                                  checklists: (t.checklists || []).map((ch) =>
                                    ch.id === checklistId
                                      ? {
                                          ...ch,
                                          items: ch.items.map((item) =>
                                            item.id === itemId ? { ...item, ...updates } : item
                                          ),
                                        }
                                      : ch
                                  ),
                                  updatedAt: new Date().toISOString(),
                                }
                              : t
                          ),
                        }
                      : col
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : b
          ),
        })),

      addChecklistItem: (boardId, columnId, ticketId, checklistId, text) =>
        set((state) => {
          const itemId = `item-${Date.now()}`;
          return {
            boards: state.boards.map((b) =>
              b.id === boardId
                ? {
                    ...b,
                    columns: b.columns.map((col) =>
                      col.id === columnId
                        ? {
                            ...col,
                            tickets: col.tickets.map((t) =>
                              t.id === ticketId
                                ? {
                                    ...t,
                                    checklists: (t.checklists || []).map((ch) =>
                                      ch.id === checklistId
                                        ? {
                                            ...ch,
                                            items: [
                                              ...ch.items,
                                              { id: itemId, text, completed: false },
                                            ],
                                          }
                                        : ch
                                    ),
                                    updatedAt: new Date().toISOString(),
                                  }
                                : t
                            ),
                          }
                        : col
                    ),
                    updatedAt: new Date().toISOString(),
                  }
                : b
            ),
          };
        }),

      deleteChecklistItem: (boardId, columnId, ticketId, checklistId, itemId) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId
              ? {
                  ...b,
                  columns: b.columns.map((col) =>
                    col.id === columnId
                      ? {
                          ...col,
                          tickets: col.tickets.map((t) =>
                            t.id === ticketId
                              ? {
                                  ...t,
                                  checklists: (t.checklists || []).map((ch) =>
                                    ch.id === checklistId
                                      ? {
                                          ...ch,
                                          items: ch.items.filter((item) => item.id !== itemId),
                                        }
                                      : ch
                                  ),
                                  updatedAt: new Date().toISOString(),
                                }
                              : t
                          ),
                        }
                      : col
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : b
          ),
        })),

      deleteChecklist: (boardId, columnId, ticketId, checklistId) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId
              ? {
                  ...b,
                  columns: b.columns.map((col) =>
                    col.id === columnId
                      ? {
                          ...col,
                          tickets: col.tickets.map((t) =>
                            t.id === ticketId
                              ? {
                                  ...t,
                                  checklists: (t.checklists || []).filter(
                                    (ch) => ch.id !== checklistId
                                  ),
                                  updatedAt: new Date().toISOString(),
                                }
                              : t
                          ),
                        }
                      : col
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : b
          ),
        })),

      addLabel: (boardId, columnId, ticketId, label) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId
              ? {
                  ...b,
                  columns: b.columns.map((col) =>
                    col.id === columnId
                      ? {
                          ...col,
                          tickets: col.tickets.map((t) =>
                            t.id === ticketId
                              ? {
                                  ...t,
                                  labels: [...(t.labels || []), label],
                                  updatedAt: new Date().toISOString(),
                                }
                              : t
                          ),
                        }
                      : col
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : b
          ),
        })),

      removeLabel: (boardId, columnId, ticketId, label) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId
              ? {
                  ...b,
                  columns: b.columns.map((col) =>
                    col.id === columnId
                      ? {
                          ...col,
                          tickets: col.tickets.map((t) =>
                            t.id === ticketId
                              ? {
                                  ...t,
                                  labels: (t.labels || []).filter((l) => l !== label),
                                  updatedAt: new Date().toISOString(),
                                }
                              : t
                          ),
                        }
                      : col
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : b
          ),
        })),
    }),
    {
      name: 'board-storage',
    }
  )
);
