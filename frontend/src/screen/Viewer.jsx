import { useEffect, useRef } from "react";
import { Room } from "livekit-client";
import { useParams } from "react-router-dom";

export default function Viewer() {
  const box = useRef(null);
  const { roomId } = useParams();

  useEffect(() => {
    let room;

    async function join() {
      const name = "viewer_" + Math.floor(Math.random() * 1000);

      const res = await fetch(
        `http://192.168.0.156:5000/token?room=${roomId}&name=${name}&isHost=false`
      );
      const { token } = await res.json();

      room = new Room();
      await room.connect("wss://test-ljgovfi9.livekit.cloud", token);

      room.on("trackSubscribed", (track) => {
        const el = track.attach();
        box.current.appendChild(el);
      });
    }

    join();
    return () => room && room.disconnect();
  }, [roomId]);

  return (
    <div>
      <h2>📺 Watching Live</h2>
      <div ref={box}></div>
    </div>
  );
}
