import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../provider/SocketProvider";

export default function LiveList() {
  const socket = useSocket();
  const [list, setList] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    socket.on("live-list", (data) => setList(data));
    return () => socket.off("live-list");
  }, []);

  return (
    <div>
      <h2>🔥 Live Users</h2>
      {list.map((l) => (
        <div key={l.roomId} onClick={() => nav(`/view/${l.roomId}`)}>
          ▶ {l.hostName}
        </div>
      ))}
    </div>
  );
}
