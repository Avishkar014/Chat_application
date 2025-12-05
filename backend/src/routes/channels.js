const express = require("express");
const Channel = require("../models/Channel");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// Create channel
router.post("/", verifyToken, async (req, res) => {
  const { name, isPrivate } = req.body;
  if (!name) return res.status(400).json({ error: "Name required" });
  try {
    const channel = await Channel.create({ name, isPrivate: !!isPrivate, members: [req.user._id] });
    res.json(channel);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: "Channel exists" });
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// List channels
router.get("/", verifyToken, async (req, res) => {
  const channels = await Channel.find().select("name members isPrivate").populate("members", "name");
  res.json(channels);
});

// Join channel
router.post("/:id/join", verifyToken, async (req, res) => {
  const channel = await Channel.findById(req.params.id);
  if (!channel) return res.status(404).json({ error: "Channel not found" });
  if (channel.members.find((m) => m.toString() === req.user._id.toString())) return res.json(channel);
  channel.members.push(req.user._id);
  await channel.save();
  res.json(channel);
});

// Leave channel
router.post("/:id/leave", verifyToken, async (req, res) => {
  const channel = await Channel.findById(req.params.id);
  if (!channel) return res.status(404).json({ error: "Channel not found" });
  channel.members = channel.members.filter((m) => m.toString() !== req.user._id.toString());
  await channel.save();
  res.json({ ok: true });
});

module.exports = router;
