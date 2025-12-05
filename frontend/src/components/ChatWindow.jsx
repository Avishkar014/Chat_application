import React from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";

export default function ChatWindow({ messages = [], channelId }) {
  const { user } = useAuth();

  async function handleDelete(messageId) {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api.delete(`/messages/${messageId}`);
      // optimistic UI removal: will also be removed when socket broadcasts message:deleted
    } catch (err) {
      alert(err?.response?.data?.error || "Delete failed");
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {messages.map((m) => {
        const sender = m.sender || m.senderId || {};
        const senderName = sender.name || (sender.id ? String(sender.id).slice(0, 8) : "Unknown");
        const isMine = user && (String(user.id) === String(sender.id || sender._id || sender));
        return (
          <div key={m._id} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: "#e6eefc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              color: "#2563eb"
            }}>
              {senderName.charAt(0).toUpperCase() || "U"}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 700 }}>{senderName}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{new Date(m.createdAt).toLocaleString()}</div>
              </div>

              <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{m.text}</div>

              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                {isMine && (
                  <button
                    onClick={() => handleDelete(m._id)}
                    style={{
                      padding: "6px 8px",
                      borderRadius: 8,
                      border: "1px solid #ef4444",
                      background: "#fff",
                      color: "#ef4444",
                      cursor: "pointer"
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
