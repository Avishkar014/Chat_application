require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { initSockets } = require("./src/socket");

const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));

app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/channels", require("./src/routes/channels"));
app.use("/api/messages", require("./src/routes/messages"));

app.get("/health", (req, res) => res.json({ ok: true }));

const server = http.createServer(app);
initSockets(server, app);

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  })
  .catch(err => {
    console.error("MongoDB connection error", err);
    process.exit(1);
  });
