// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import Mux from "@mux/mux-node";
// import { AccessToken } from "livekit-server-sdk";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const liveUsers = {};

// const mux = new Mux({
//   tokenId: process.env.MUX_TOKEN_ID,
//   tokenSecret: process.env.MUX_TOKEN_SECRET,
// });



// io.on("connection", (socket) => {
//     console.log("User Connected: " + socket.id);

//     socket.emit("me", socket.id); // User ko unka ID bhejein

//     // Call initiate karna
//     socket.on("callUser", ({ userToCall, signalData, from, name }) => {
//         io.to(userToCall).emit("callUser", { signal: signalData, from, name });
//     });

//     // Call accept karna
//     socket.on("answerCall", (data) => {
//         io.to(data.to).emit("callAccepted", data.signal);
//     });

//     socket.on("disconnect", () => {
//         console.log("Call Ended");
//     });
// });


// /* ✅ Create Live Stream */
// app.post("/api/create-live", async (req, res) => {
//   console.log("userId 0",);
//   const { userId } = req.body;
//   console.log("userId", userId);

//   try {
//     console.log("userId 1",);
//     const live = await mux.video.liveStreams.create({
//       playback_policy: ["public"],
//       new_asset_settings: { playback_policy: ["public"] },
//     });
//     console.log("userId 2");

//     liveUsers[userId] = {
//       playbackId: live.playback_ids[0].id,
//       liveStreamId: live.id,
//       isLive: false,
//     };
//     console.log("userId 3");

//     res.json({
//       streamKey: live.stream_key,
//       playbackId: live.playback_ids[0].id,
//       liveStreamId: live.id,
//       rtmpUrl: "rtmp://global-live.mux.com:5222/app",
//     });
//     console.log("userId 4");
//   } catch (e) {
//     console.error(e);
//     console.log("userId 5", e);
//     res.status(500).json({ error: "Mux stream failed" });
//   }
// });

// app.post("/api/webhook", express.json(), (req, res) => {
//   const event = req.body;
//   console.log("run 1");

//   if (event.type === "video.live_stream.active") {
//     console.log("run 2");
//     const id = event.data.id;

//     for (const userId in liveUsers) {
//       if (liveUsers[userId].liveStreamId === id) {
//         liveUsers[userId].isLive = true;
//       }
//     }
//   }

//   if (event.type === "video.live_stream.idle") {
//     console.log("run 3");
//     const id = event.data.id;

//     for (const userId in liveUsers) {
//       if (liveUsers[userId].liveStreamId === id) {
//         liveUsers[userId].isLive = false;
//       }
//     }
//   }

//   res.sendStatus(200);
// });

// app.get("/api/live-users", (req, res) => {
//   const list = [];

//   for (const userId in liveUsers) {
//     if (liveUsers[userId].isLive) {
//       list.push({
//         userId,
//         playbackId: liveUsers[userId].playbackId,
//       });
//     }
//   }

//   res.json(list);
// });

// app.post("/api/token", (req, res) => {
//   const { room, username } = req.body;

//   const at = new AccessToken(
//     process.env.LIVEKIT_API_KEY,
//     process.env.LIVEKIT_API_SECRET,
//     { identity: username }
//   );

//   at.addGrant({ roomJoin: true, room });

//   const token = at.toJwt();
//   res.json({ token, url: process.env.LIVEKIT_URL });
// });
// app.listen(5000, () => console.log("Backend running on 5000"));





const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let emailToSocketIdMap = new Map();
let socketIdToEmailMap = new Map();


io.on("connection", (socket) => {
  socket.on("room:join", (data) => {
    const { email, roomId } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketIdToEmailMap.set(socket.id, email);
    io.to(roomId).emit("user:joined", { email, id: socket.id });
    socket.join(roomId)
    io.to(socket.id).emit("room:join", data);

  });

  socket.on("user:coll", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { form: socket.id, offer })
  })

  socket.on("coll:accepted", ({ to, ans }) => {
    io.to(to).emit("coll:accepted", { form: socket.id, ans })
  })


  // socket.on("broadcaster", () => {
  //   broadcaster = socket.id;
  //   socket.broadcast.emit("broadcaster");

  // });

  // socket.on("viewer", () => {
  //   if (broadcaster) {
  //     socket.to(broadcaster).emit("viewer", socket.id);
  //   }
  // });

  // socket.on("offer", (id, message) => {
  //   socket.to(id).emit("offer", socket.id, message);
  // });

  // socket.on("answer", (id, message) => {
  //   socket.to(id).emit("answer", socket.id, message);
  // });

  // socket.on("candidate", (id, message) => {
  //   socket.to(id).emit("candidate", socket.id, message);
  // });

  // socket.on("disconnect", () => {
  //   if (socket.id === broadcaster) {
  //     broadcaster = null;
  //   }
  // });
});

server.listen(5000, () => console.log("Server is running on port 5000"));