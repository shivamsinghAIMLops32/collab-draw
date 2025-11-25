import { 
  MousePointer2, Square, Circle, Type, MessageSquare, 
  Minus, ArrowRight, Pen, Image as ImageIcon, Eraser, 
  Diamond, Hand, Lock
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export function Toolbar() {
  const { tool, setTool } = useAppStore();

  const tools = [
    { id: "lock", icon: Lock, label: "Lock" },
    { id: "hand", icon: Hand, label: "Hand (Panning)" },
    { id: "cursor", icon: MousePointer2, label: "Selection" },
    { id: "rect", icon: Square, label: "Rectangle" },
    { id: "diamond", icon: Diamond, label: "Diamond" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "arrow", icon: ArrowRight, label: "Arrow" },
    { id: "line", icon: Minus, label: "Line" },
    { id: "draw", icon: Pen, label: "Draw" },
    { id: "text", icon: Type, label: "Text" },
    { id: "image", icon: ImageIcon, label: "Image" },
    { id: "eraser", icon: Eraser, label: "Eraser" },
  ];

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[var(--surface)] p-1.5 rounded-lg shadow-xl border border-[var(--border)] flex items-center gap-1">
      {tools.map((t) => (
        <button
          key={t.id}
          onClick={() => setTool(t.id as any)}
          className={`tool-btn ${tool === t.id ? "active" : ""}`}
          title={t.label}
        >
          <t.icon className="w-4 h-4" />
          {/* Number shortcut could go here */}
        </button>
      ))}
    </div>
  );
}
