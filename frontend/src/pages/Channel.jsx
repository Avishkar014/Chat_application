import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { getSocket } from "../lib/socket";
import ChatWindow from "../components/ChatWindow";
import OnlineList from "../components/OnlineList";

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

export default function ChannelPage() {
  const { id: channelId } = useParams();
  const nav = useNavigate();
  const [channel, setChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [online, setOnline] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const oldestRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!channelId) return;
    let mounted = true;

    async function loadChannelAndMessages() {
      try {
        const chRes = await api.get("/channels");
        const found = (chRes.data || []).find((c) => c._id === channelId);
        setChannel(found || { _id: channelId, name: channelId });

        const msgs = await api.get(`/messages?channel=${channelId}&limit=30`);
        if (!mounted) return;
        setMessages(msgs.data);
        if (msgs.data.length) oldestRef.current = msgs.data[0].createdAt;

        socketRef.current = getSocket();
        socketRef.current.emit("joinChannel", channelId);

        socketRef.current.on("message:new", onNewMessage);
        socketRef.current.on("presence:update", (p) => setOnline(p.online || []));

        socketRef.current.on("typing", ({ user, isTyping }) => {
          if (!user) return;
          setTypingUsers((prev) => {
            const name = user.name || (user.id ? user.id.slice(0, 8) : "Unknown");
            if (isTyping) {
              if (!prev.includes(name)) return [...prev, name];
              return prev;
            } else {
              return prev.filter((n) => n !== name);
            }
          });
        });

        socketRef.current.on("message:deleted", ({ id }) => {
          setMessages((prev) => prev.filter((m) => String(m._id) !== String(id)));
        });
      } catch (err) {
        console.error(err);
      }
    }

    loadChannelAndMessages();

    return () => {
      mounted = false;
      if (socketRef.current) {
        socketRef.current.off("message:new", onNewMessage);
        socketRef.current.off("presence:update");
        socketRef.current.off("typing");
        socketRef.current.off("message:deleted");
        socketRef.current.emit("leaveChannel", channelId);
      }
    };
    // eslint-disable-next-line
  }, [channelId]);

  function onNewMessage(m) {
    if (m.channel === channelId || m.channel?._id === channelId) {
      setMessages((prev) => [...prev, m]);
    }
  }

  const emitTypingStop = debounce(() => {
    const s = socketRef.current;
    if (s) s.emit("typing", { channelId, isTyping: false });
  }, 900);

  function handleInputChange(e) {
    setText(e.target.value);
    const s = socketRef.current;
    if (s) {
      s.emit("typing", { channelId, isTyping: true });
      emitTypingStop();
    }
  }

  async function send() {
    if (!text.trim()) return;
    const s = socketRef.current;
    if (s) s.emit("message:send", { channelId, text: text.trim() });
    setText("");
    emitTypingStop();
  }

  async function loadOlder() {
    if (!oldestRef.current) return;
    const res = await api.get(
      `/messages?channel=${channelId}&limit=20&before=${encodeURIComponent(oldestRef.current)}`
    );
    if (res.data.length) {
      setMessages((prev) => [...res.data, ...prev]);
      oldestRef.current = res.data[0].createdAt;
    }
  }

  return (
    <div style={{ display: "flex", height: "calc(100vh - 68px)" }}>
      <aside className="sidebar" style={{ width: 260, padding: 16 }}>
        <div style={{ marginBottom: 12 }}>
          <button onClick={() => nav("/channels")} className="secondary">
            Back
          </button>
        </div>
        <OnlineList online={online} />
        <div style={{ marginTop: 12 }}>
          <button onClick={loadOlder}>Load older</button>
        </div>
      </aside>

      <main className="main" style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0 }}>{channel?.name || channelId}</h3>
            <div style={{ fontSize: 13, color: "#666" }}>{messages.length} messages</div>
          </div>

          <div style={{ fontSize: 13, color: "#666" }}>{typingUsers.length ? `${typingUsers.join(", ")} typing…` : null}</div>
        </div>

        <div style={{ flex: 1, overflow: "auto", marginTop: 12 }}>
          <ChatWindow messages={messages} channelId={channelId} />
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <input
            type="text"
            placeholder="Write a message…"
            value={text}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && send()}
            style={{ flex: 1 }}
          />
          <button onClick={send}>Send</button>
        </div>
      </main>
    </div>
  );
}
