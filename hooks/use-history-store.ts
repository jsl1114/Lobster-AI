import { create } from "zustand";

interface HistoryStore {
  messages: any[];
  parentId?: string;
  setMessages: (messages: any[], parentId?: string) => void;
  clearMessages: () => void;
}

export const useHistoryStore = create<HistoryStore>((set) => ({
  messages: [],
  parentId: undefined,
  setMessages: (messages, parentId) => set({ messages, parentId }),
  clearMessages: () => set({ messages: [], parentId: undefined }),
}));
