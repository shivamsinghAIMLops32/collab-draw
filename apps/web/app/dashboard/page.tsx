import Link from "next/link";
import { prisma } from "@repo/db";
import { Plus } from "lucide-react";

// Mock user ID for now since auth UI isn't fully hooked up to session
const MOCK_USER_ID = "user_1"; 

export default async function DashboardPage() {
  // In a real app, get session here
  // const session = await auth.api.getSession({ headers: await headers() });
  
  const rooms = await prisma.room.findMany({
    where: {
      // ownerId: session?.user?.id
      // For demo, just list all public rooms or recent ones
      isPublic: true
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link href="/">
          <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
            <Plus className="h-4 w-4" />
            New Room
          </button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Link key={room.id} href={`/room/${room.id}`}>
            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer bg-white">
              <h3 className="font-semibold text-lg mb-2">{room.name}</h3>
              <p className="text-sm text-gray-500">
                Created {new Date(room.createdAt).toLocaleDateString()}
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
    </div>
  );
}
