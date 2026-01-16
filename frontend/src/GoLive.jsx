import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

export default function GoLive() {
  const [data, setData] = useState([]);
  const [lives, setLives] = useState([]);

  const createLive = async () => {
    const res = await axios.post("http://localhost:5000/api/create-live", {
      userId: "mohit123"
    });
    setData(res.data);
  };

  useEffect(() => {
    const load = async () => {
      const res = await axios.get("http://localhost:5000/api/live-users");
      setLives(res.data);
    };

    load();
    setInterval(load, 5000);
  }, []);



  const startLive = async () => {
    const res = await axios.post("http://localhost:5000/api/token", {
      room: "public-room",
      username: "mohit-host",
    });

    const room = await connect(res.data.url, res.data.token);

    await room.localParticipant.enableCameraAndMicrophone();
    alert("You are LIVE 🔴");
  };


  return (
    <div>
      <h2>Go Live</h2>
      <button onClick={startLive}>Go Live start Live</button> <br /> <br />


      <button onClick={createLive}>Create Live Stream</button>
      {lives.map(l => (
        <a href={`/watch?pid=${l.playbackId}`}>
          {l.userId} is Live
        </a>
      ))}

      {data && (
        <div>
          <p><b>Server:</b> rtmp://global-live.mux.com:5222/app</p>
          <p><b>Stream Key:</b> {data.streamKey}</p>

          <a href={`/watch?pid=${data.playbackId}`}>
            Watch Stream
          </a>
        </div>
      )}
    </div>
  );
}
