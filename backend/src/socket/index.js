const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Message = require("../models/Message");
const User = require("../models/User");

const online = new Map();

function initSockets(server, expressApp) {
  const io = new Server(server, {
    cors: { origin: process.env.FRONTEND_URL || "*", methods: ["GET", "POST"] }
  });

  async function sendPresenceUpdate() {
    try {
      const ids = Array.from(online.keys());
      if (ids.length === 0) {
        io.emit("presence:update", { online: [] });
        return;
      }
      const users = await User.find({ _id: { $in: ids } }).select("name email");
      io.emit("presence:update", {
        online: users.map(u => ({ id: u._id.toString(), name: u.name || u.email?.split("@")[0] || "Unknown" }))
      });
    } catch (err) {
      console.error("sendPresenceUpdate error", err);
    }
  }

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Auth token required"));
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.id).select("name");
      if (!user) return next(new Error("User not found"));
      socket.user = { id: user._id.toString(), name: user.name || null };
      return next();
    } catch (err) {
      return next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    const uid = socket.user.id;

    if (!online.has(uid)) online.set(uid, new Set());
    online.get(uid).add(socket.id);

    sendPresenceUpdate().catch(() => {});

    socket.on("joinChannel", (channelId) => {
      socket.join(`channel:${channelId}`);
      io.to(`channel:${channelId}`).emit("channel:memberJoined", { user: { id: uid, name: socket.user.name } });
    });

    socket.on("leaveChannel", (channelId) => {
      socket.leave(`channel:${channelId}`);
      io.to(`channel:${channelId}`).emit("channel:memberLeft", { user: { id: uid, name: socket.user.name } });
    });

    socket.on("message:send", async ({ channelId, text }) => {
      try {
        if (!channelId || !text) return;
        const msg = await Message.create({ sender: uid, channel: channelId, text });
        const full = await Message.findById(msg._id).populate("sender", "name avatarUrl");
        io.to(`channel:${channelId}`).emit("message:new", full);
      } catch (err) {
        console.error("message:send error", err);
      }
    });

    socket.on("typing", ({ channelId, isTyping }) => {
      socket.to(`channel:${channelId}`).emit("typing", { user: { id: uid, name: socket.user.name }, isTyping });
    });

    socket.on("disconnect", () => {
      const set = online.get(uid);
      if (set) {
        set.delete(socket.id);
        if (set.size === 0) {
          online.delete(uid);
          sendPresenceUpdate().catch(() => {});
        } else {
          sendPresenceUpdate().catch(() => {});
        }
      } else {
        sendPresenceUpdate().catch(() => {});
      }
    });
  });

  expressApp.set("io", io);
}

module.exports = { initSockets };
