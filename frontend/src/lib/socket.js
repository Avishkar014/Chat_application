import { io } from "socket.io-client";
let socket = null;
export function getSocket() {
  if (socket) return socket;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  socket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:4000", {
    auth: { token },
    transports: ["websocket", "polling"]
  });
  return socket;
}
