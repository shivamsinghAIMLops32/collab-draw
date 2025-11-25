import { 
  Menu, FolderOpen, Save, Download, Users, 
  Command, Search, HelpCircle, Trash2, Github,
  Twitter, MessageCircle
} from "lucide-react";
import { useState } from "react";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 left-4 z-50 flex flex-col gap-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[var(--surface)] p-2.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute top-14 left-0 w-64 bg-[var(--surface)] rounded-lg border border-[var(--border)] shadow-2xl p-2 flex flex-col gap-1 text-sm animate-in fade-in slide-in-from-left-5 duration-200">
          <div className="p-2 hover:bg-[var(--surface-hover)] rounded flex items-center gap-3 cursor-pointer">
            <FolderOpen className="w-4 h-4" /> Open <span className="ml-auto text-xs text-[var(--muted)]">Ctrl+O</span>
          </div>
          <div className="p-2 hover:bg-[var(--surface-hover)] rounded flex items-center gap-3 cursor-pointer">
            <Save className="w-4 h-4" /> Save to...
          </div>
          <div className="p-2 hover:bg-[var(--surface-hover)] rounded flex items-center gap-3 cursor-pointer">
            <Download className="w-4 h-4" /> Export image... <span className="ml-auto text-xs text-[var(--muted)]">Ctrl+Shift+E</span>
          </div>
          <div className="p-2 hover:bg-[var(--surface-hover)] rounded flex items-center gap-3 cursor-pointer">
            <Users className="w-4 h-4" /> Live collaboration...
          </div>
          <div className="h-px bg-[var(--border)] my-1" />
          <div className="p-2 hover:bg-[var(--surface-hover)] rounded flex items-center gap-3 cursor-pointer">
            <Command className="w-4 h-4" /> Command palette <span className="ml-auto text-xs text-[var(--muted)]">Ctrl+/</span>
          </div>
          <div className="p-2 hover:bg-[var(--surface-hover)] rounded flex items-center gap-3 cursor-pointer">
            <Search className="w-4 h-4" /> Find on canvas <span className="ml-auto text-xs text-[var(--muted)]">Ctrl+F</span>
          </div>
          <div className="p-2 hover:bg-[var(--surface-hover)] rounded flex items-center gap-3 cursor-pointer">
            <HelpCircle className="w-4 h-4" /> Help <span className="ml-auto text-xs text-[var(--muted)]">?</span>
          </div>
          <div className="p-2 hover:bg-[var(--surface-hover)] rounded flex items-center gap-3 cursor-pointer text-red-400 hover:text-red-300">
            <Trash2 className="w-4 h-4" /> Reset the canvas
          </div>
          <div className="h-px bg-[var(--border)] my-1" />
          <div className="p-2 flex gap-4 text-[var(--muted)]">
             <Github className="w-4 h-4 hover:text-white cursor-pointer" />
             <Twitter className="w-4 h-4 hover:text-white cursor-pointer" />
             <MessageCircle className="w-4 h-4 hover:text-white cursor-pointer" />
          </div>
        </div>
      )}
    </div>
  );
}
