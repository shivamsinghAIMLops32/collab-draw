"use client";

import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { ArrowRight, Zap, Users, Lock } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const createRoom = () => {
    const roomId = uuidv4();
    router.push(`/room/${roomId}`);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center space-y-10 py-24 text-center md:py-32">
        <div className="space-y-4 max-w-3xl px-4">
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-600">
            Collaborate & Draw in Real-Time
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            An open-source whiteboard for teams. Sketch, brainstorm, and plan together with zero latency.
          </p>
        </div>
        <div className="flex flex-col gap-4 min-[400px]:flex-row">
          <button
            onClick={createRoom}
            className="inline-flex h-12 items-center justify-center rounded-md bg-black px-8 text-sm font-medium text-white shadow transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
          >
            Start Drawing Now <ArrowRight className="ml-2 h-4 w-4" />
          </button>
          <button className="inline-flex h-12 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950">
            View Features
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-12 md:py-24 lg:py-32 bg-gray-50 rounded-3xl mb-12">
        <div className="grid gap-12 lg:grid-cols-3 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-full shadow-sm">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Lightning Fast</h3>
            <p className="text-gray-500">
              Powered by Yjs and Redis for instant synchronization across all devices.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-full shadow-sm">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Multiplayer</h3>
            <p className="text-gray-500">
              See others' cursors and edits in real-time. Perfect for remote teams.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-full shadow-sm">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Secure & Private</h3>
            <p className="text-gray-500">
              Your data is owned by you. Self-hostable and open source.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
