"use client";

import Link from "next/link";
import { Plus, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Room {
  id: string;
  name: string;
  createdAt: string;
  owner: {
    name: string | null;
    email: string;
  };
  _count: {
    members: number;
  };
}

export default function DashboardPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch("/api/rooms");
      if (res.ok) {
        const data = await res.json();
        setRooms(data);
      }
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const createRoom = async () => {
    setCreating(true);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Untitled Room" }),
      });
      
      if (res.ok) {
        const room = await res.json();
        router.push(`/room/${room.id}`);
      }
    } catch (error) {
      console.error("Failed to create room:", error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <button
          onClick={createRoom}
          disabled={creating}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
        >
          {creating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          New Room
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <Link key={room.id} href={`/room/${room.id}`}>
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer bg-white">
                <h3 className="font-semibold text-lg mb-2">{room.name}</h3>
                <p className="text-sm text-gray-500">
                  Created {new Date(room.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {room._count.members} member{room._count.members !== 1 ? "s" : ""}
                </p>
              </div>
            </Link>
          ))}
          {rooms.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500 border-2 border-dashed rounded-lg">
              No rooms found. Create one to get started!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
