import { create } from 'zustand';

type Tool = "cursor" | "rect" | "circle" | "text" | "comment" | "diamond" | "arrow" | "line" | "draw" | "image" | "eraser" | "hand" | "lock";

interface AppState {
  tool: Tool;
  setTool: (tool: Tool) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  tool: 'cursor',
  setTool: (tool) => set({ tool }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  zoom: 1,
  setZoom: (zoom) => set({ zoom }),
}));
