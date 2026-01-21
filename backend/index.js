const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { AccessToken } = require("livekit-server-sdk");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// 🔴 In-memory live list
let liveHosts = [];

// ---------- SOCKET ----------
io.on("connection", (socket) => {
  socket.on("host-live", ({ roomId, hostName }) => {
    liveHosts.push({ roomId, hostName, socketId: socket.id });
    io.emit("live-list", liveHosts);
  });

  socket.on("end-live", () => {
    liveHosts = liveHosts.filter((h) => h.socketId !== socket.id);
    io.emit("live-list", liveHosts);
  });

  socket.on("disconnect", () => {
    liveHosts = liveHosts.filter((h) => h.socketId !== socket.id);
    io.emit("live-list", liveHosts);
  });
});

// ---------- TOKEN API ----------
app.get("/token", async (req, res) => {
  const { room = "demo", name = "guest" } = req.query;

  try {
    const token = new AccessToken(
      "APIofDa6BatCnh2",
      "bywHDd8R0GBAyRIzHjhCogPYdOxhafi8yHez1uZa0hw",
      { identity: name }
    );

    token.addGrant({
      roomJoin: true,
      room,
      canPublish: true,
      canSubscribe: true,
    });

    const jwt = await token.toJwt();

    res.json({ token: jwt });
  } catch (err) {
    res.status(500).json({ error: "token failed" });
  }
});

server.listen(5000, () =>
  console.log("🔥 server on http://localhost:5000")
);
