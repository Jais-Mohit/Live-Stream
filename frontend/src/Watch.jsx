import { useSearchParams } from "react-router-dom";
import MuxPlayer from "@mux/mux-player-react";

export default function Watch() {
  const [params] = useSearchParams();
  const playbackId = params.get("pid");

  return (
    <div>
      <h2>Live Stream</h2>

      {playbackId ? (
        <MuxPlayer
          playbackId={playbackId}
          streamType="live"
          autoPlay
          muted
        />
      ) : (
        <p>No live stream</p>
      )}
    </div>
  );
}
