const express = require("express");
const Message = require("../models/Message");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

/**
 GET /api/messages?channel=<id>&limit=30&before=<ISO date>
 returns messages in chronological order (oldest -> newest)
*/
router.get("/", verifyToken, async (req, res) => {
  try {
    const { channel, limit = 30, before } = req.query;
    if (!channel) return res.status(400).json({ error: "channel required" });
    const q = { channel };
    if (before) q.createdAt = { $lt: new Date(before) };
    const msgs = await Message.find(q)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate("sender", "name avatarUrl");
    res.json(msgs.reverse());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 DELETE /api/messages/:id
 Soft removal (hard delete here) - only message sender can delete
 Broadcasts message:deleted to the channel room
*/
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const msg = await Message.findById(id);
    if (!msg) return res.status(404).json({ error: "Message not found" });
    if (msg.sender.toString() !== req.user.id) return res.status(403).json({ error: "Forbidden" });

    const channelId = msg.channel;
    await Message.findByIdAndDelete(id);

    const io = req.app.get("io");
    if (io) io.to(`channel:${channelId}`).emit("message:deleted", { id });

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
