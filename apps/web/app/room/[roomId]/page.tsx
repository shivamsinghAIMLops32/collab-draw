import { RoomCanvas } from "@/components/RoomCanvas";

interface PageProps {
  params: Promise<{
    roomId: string;
  }>;
}

export default async function RoomPage({ params }: PageProps) {
  const { roomId } = await params;
  
  return (
    <div className="h-screen w-screen overflow-hidden bg-white">
      <RoomCanvas roomId={roomId} />
    </div>
  );
}
