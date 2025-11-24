import { RoomCanvas } from "@/components/RoomCanvas";

interface PageProps {
  params: {
    roomId: string;
  };
}

export default function RoomPage({ params }: PageProps) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-white">
      <RoomCanvas roomId={params.roomId} />
    </div>
  );
}
