"use client";

import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MousePointer2, Square, Circle, MessageSquare, Download, Trash2 } from "lucide-react";

interface RoomCanvasProps {
  roomId: string;
}

type Tool = "cursor" | "rect" | "circle" | "text" | "comment";

export function RoomCanvas({ roomId }: RoomCanvasProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [elements, setElements] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [cursors, setCursors] = useState<any[]>([]);
  const [tool, setTool] = useState<Tool>("cursor");
  const [currentShapeId, setCurrentShapeId] = useState<string | null>(null);
  
  const ydoc = useRef(new Y.Doc());
  const provider = useRef<WebsocketProvider | null>(null);
  const yShapes = useRef<Y.Map<any> | null>(null);
  const yComments = useRef<Y.Map<any> | null>(null);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001";
    
    provider.current = new WebsocketProvider(wsUrl, roomId, ydoc.current);
    yShapes.current = ydoc.current.getMap("shapes");
    yComments.current = ydoc.current.getMap("comments");

    yShapes.current.observe(() => {
      setElements(Array.from(yShapes.current?.values() || []));
    });

    yComments.current.observe(() => {
      setComments(Array.from(yComments.current?.values() || []));
    });

    // Awareness
    const awareness = provider.current.awareness;
    awareness.setLocalStateField("user", {
      name: "User " + Math.floor(Math.random() * 100),
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    });

    awareness.on("change", () => {
      const states = Array.from(awareness.getStates().entries())
        .filter(([clientId, state]: [number, any]) => clientId !== awareness.clientID)
        .map(([clientId, state]) => ({
          clientId,
          ...state.user,
          cursor: state.cursor
        }));
      setCursors(states);
    });
    
    provider.current.on("status", (event: any) => {
      setIsConnected(event.status === "connected");
    });

    return () => {
      provider.current?.destroy();
    };
  }, [roomId]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (tool === "cursor") return;

    const id = Date.now().toString();
    const { clientX, clientY } = e;

    if (tool === "comment") {
      const text = prompt("Enter comment:");
      if (text) {
        yComments.current?.set(id, {
          id,
          x: clientX,
          y: clientY,
          text,
          author: "User" // TODO: Get from auth
        });
      }
      setTool("cursor");
      return;
    }

    const shape = {
      id,
      type: tool,
      x: clientX,
      y: clientY,
      width: 0,
      height: 0,
      fill: "transparent",
      stroke: "black"
    };
    
    yShapes.current?.set(id, shape);
    setCurrentShapeId(id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Update local awareness
    provider.current?.awareness.setLocalStateField("cursor", {
      x: e.clientX,
      y: e.clientY
    });

    if (!currentShapeId || !yShapes.current) return;

    const shape = yShapes.current.get(currentShapeId);
    if (!shape) return;

    const width = e.clientX - shape.x;
    const height = e.clientY - shape.y;

    yShapes.current.set(currentShapeId, {
      ...shape,
      width,
      height
    });
  };

  const handleMouseUp = () => {
    setCurrentShapeId(null);
    if (tool !== "cursor") setTool("cursor");
  };

  const handleExport = () => {
    const svg = document.querySelector("svg");
    if (!svg) return;
    
    const data = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `drawing-${roomId}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearCanvas = () => {
    if (confirm("Clear canvas?")) {
      yShapes.current?.clear();
      yComments.current?.clear();
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white p-2 rounded-lg shadow-lg flex gap-2 border">
        <button
          onClick={() => setTool("cursor")}
          className={`p-2 rounded ${tool === "cursor" ? "bg-gray-200" : "hover:bg-gray-100"}`}
        >
          <MousePointer2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => setTool("rect")}
          className={`p-2 rounded ${tool === "rect" ? "bg-gray-200" : "hover:bg-gray-100"}`}
        >
          <Square className="w-5 h-5" />
        </button>
        <button
          onClick={() => setTool("circle")}
          className={`p-2 rounded ${tool === "circle" ? "bg-gray-200" : "hover:bg-gray-100"}`}
        >
          <Circle className="w-5 h-5" />
        </button>
        <button
          onClick={() => setTool("comment")}
          className={`p-2 rounded ${tool === "comment" ? "bg-gray-200" : "hover:bg-gray-100"}`}
        >
          <MessageSquare className="w-5 h-5" />
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button onClick={handleExport} className="p-2 rounded hover:bg-gray-100" title="Export">
          <Download className="w-5 h-5" />
        </button>
        <button onClick={clearCanvas} className="p-2 rounded hover:bg-red-100 text-red-500" title="Clear">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Status Indicator */}
      <div className="absolute top-4 right-4 z-10">
        <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} title={isConnected ? "Connected" : "Disconnected"} />
      </div>

      <svg
        className="block h-full w-full touch-none bg-gray-50 cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {elements.map((el) => {
          if (el.type === "rect") {
            return (
              <rect
                key={el.id}
                x={el.width < 0 ? el.x + el.width : el.x}
                y={el.height < 0 ? el.y + el.height : el.y}
                width={Math.abs(el.width)}
                height={Math.abs(el.height)}
                fill={el.fill}
                stroke={el.stroke}
                strokeWidth={2}
              />
            );
          }
          if (el.type === "circle") {
            const r = Math.sqrt(el.width ** 2 + el.height ** 2) / 2;
            return (
              <circle
                key={el.id}
                cx={el.x + el.width / 2}
                cy={el.y + el.height / 2}
                r={r}
                fill={el.fill}
                stroke={el.stroke}
                strokeWidth={2}
              />
            );
          }
          return null;
        })}
      </svg>

      {/* Comments Overlay */}
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="absolute bg-yellow-100 p-2 rounded shadow-md border border-yellow-300 text-sm max-w-xs"
          style={{ top: comment.y, left: comment.x }}
        >
          <div className="font-bold text-xs text-gray-600">{comment.author}</div>
          <div>{comment.text}</div>
        </div>
      ))}

      {/* Cursors Overlay */}
      {cursors.map((cursor) => {
        if (!cursor.cursor) return null; // Wait for cursor position
        return (
          <div
            key={cursor.clientId}
            className="absolute pointer-events-none"
            style={{ top: cursor.cursor.y, left: cursor.cursor.x }}
          >
            <MousePointer2
              className="w-4 h-4"
              style={{ color: cursor.color, fill: cursor.color }}
            />
            <div
              className="absolute left-4 top-2 text-xs text-white px-1 rounded whitespace-nowrap"
              style={{ backgroundColor: cursor.color }}
            >
              {cursor.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}
