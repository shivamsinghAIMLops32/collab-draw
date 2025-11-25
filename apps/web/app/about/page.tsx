export default function AboutPage() {
  return (
    <div className="container py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About CollabDraw</h1>
        <div className="prose prose-lg">
          <p className="text-lg text-gray-600 mb-4">
            CollabDraw is an open-source collaborative whiteboard application designed for teams to sketch, brainstorm, and plan together in real-time.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Features</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Real-time collaboration with WebSocket synchronization</li>
            <li>Multiple drawing tools (shapes, freehand, text, images)</li>
            <li>Hand-drawn aesthetic using RoughJS</li>
            <li>Secure authentication and private rooms</li>
            <li>Persistent storage with PostgreSQL</li>
          </ul>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Technology Stack</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Next.js 16 with App Router</li>
            <li>Yjs for CRDT-based real-time sync</li>
            <li>WebSocket server with authentication</li>
            <li>PostgreSQL + Prisma ORM</li>
            <li>Redis for pub/sub</li>
            <li>BetterAuth for authentication</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
