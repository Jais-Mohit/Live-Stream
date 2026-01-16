import axios from "axios";
import { useState } from "react";

export default function GoLive() {
  const [data, setData] = useState(null);

  const createLive = async () => {
    const res = await axios.post("http://localhost:5000/api/create-live");
    setData(res.data);
  };

  return (
    <div>
      <h2>Go Live</h2>

      <button onClick={createLive}>Create Live Stream</button>

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
