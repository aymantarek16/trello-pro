import { create } from 'zustand';

interface ModalState {
  isOpen: boolean;
  type: 'card-details' | null;
  data: any;
  onOpen: (type: 'card-details', data: any) => void;
  onClose: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  type: null,
  data: {},
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null, data: {} }),
}));
