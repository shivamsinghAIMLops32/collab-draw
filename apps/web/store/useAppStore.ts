import { create } from 'zustand';

type Tool = "cursor" | "rect" | "circle" | "text" | "comment";

interface AppState {
  tool: Tool;
  setTool: (tool: Tool) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  tool: 'cursor',
  setTool: (tool) => set({ tool }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));
