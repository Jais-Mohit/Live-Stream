import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Mux from "@mux/mux-node";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const liveUsers = {}; 

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

/* ✅ Create Live Stream */
app.post("/api/create-live", async (req, res) => {
  const { userId } = req.body;

  try {
    const live = await mux.video.liveStreams.create({
      playback_policy: ["public"],
      new_asset_settings: { playback_policy: ["public"] },
    });

    liveUsers[userId] = {
      playbackId: live.playback_ids[0].id,
      liveStreamId: live.id,
      isLive: false,
    };

    res.json({
      streamKey: live.stream_key,
      playbackId: live.playback_ids[0].id,
      liveStreamId: live.id,
      rtmpUrl: "rtmp://global-live.mux.com:5222/app",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Mux stream failed" });
  }
});








app.listen(5000, () => console.log("Backend running on 5000"));
