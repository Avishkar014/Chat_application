import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import ChannelList from "../components/ChannelList";

export default function ChannelsPage() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [channels, setChannels] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      const res = await api.get("/channels");
      setChannels(res.data || []);
    } catch (err) {}
  }

  async function create() {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await api.post("/channels", { name: name.trim() });
      setName("");
      await load();
    } catch (err) {} 
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

  return (
    <div style={{ display: "flex", height: "calc(100vh - 68px)" }}>
      <aside className="sidebar" style={{ width: 300, padding: 20 }}>
        {!user ? (
          <div style={{
            padding: 16,
            borderRadius: 12,
            background: "linear-gradient(180deg,#fff,#fbfbff)",
            boxShadow: "0 8px 20px rgba(16,24,40,0.04)",
            border: "1px solid rgba(16,24,40,0.04)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{
                width:44, height:44, borderRadius:10, background:"#2563eb",
                color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800
              }}>TC</div>
              <div>
                <div style={{ fontWeight:800, fontSize:16 }}>Team Chat</div>
                <div style={{ fontSize:13, color:"#546070" }}>Real-time channels & presence</div>
              </div>
            </div>

            <p style={{ color:"#475569", fontSize:14, marginTop: 6 }}>
              Create an account to participate in channels, send messages, and see who’s online.
            </p>

            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button onClick={() => nav("/login")} style={{
                flex: 1, padding: "10px 12px", borderRadius:10, border:"none", background:"#2563eb", color:"#fff", fontWeight:700
              }}>Login</button>
              <button onClick={() => nav("/signup")} style={{
                padding: "10px 12px", borderRadius:10, border:"1px solid #e6eefc", background:"#fff", color:"#2563eb", fontWeight:700
              }}>Sign up</button>
            </div>
          </div>
        ) : (
          <>
            <div style={{
              padding: 16,
              borderRadius: 12,
              background: "#ffffff",
              boxShadow: "0 6px 18px rgba(16,24,40,0.04)",
              border: "1px solid rgba(16,24,40,0.05)",
              marginBottom: 20
            }}>
              <h4 style={{ margin: "0 0 12px 0", fontWeight: 700, color: "#1e293b" }}>
                Create New Channel
              </h4>

              <div style={{ display: "flex", gap: 10 }}>
                <input
                  placeholder="Channel name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #cbd5e1",
                    outline: "none",
                    fontSize: 14
                  }}
                />
                <button
                  onClick={create}
                  disabled={loading}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 10,
                    border: "none",
                    background: "#2563eb",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                    width: 100
                  }}
                >
                  {loading ? "..." : "Create"}
                </button>
              </div>
            </div>

            <div style={{ marginTop: 8 }}>
              <h4 style={{ margin: "8px 0 12px 0" }}>Channels</h4>
              <ChannelList channels={channels} />
            </div>
          </>
        )}
      </aside>

      <main className="main" style={{ flex: 1, padding: 28 }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <h2 style={{ marginTop: 0 }}>Welcome{user ? `, ${user.name || user.id.slice(0,8)}` : ""}</h2>
          <p style={{ color: "#475569" }}>Select a channel on the left to start chatting.</p>

          <div style={{ marginTop: 20 }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16
            }}>
              {channels.slice(0, 6).map(c => (
                <div key={c._id} style={{
                  padding: 14,
                  borderRadius: 12,
                  background: "#fff",
                  boxShadow: "0 6px 18px rgba(16,24,40,0.04)",
                  border: "1px solid rgba(16,24,40,0.03)"
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div style={{ fontWeight:700 }}>{c.name}</div>
                    <div style={{ fontSize:12, color:"#6b7280" }}>{(c.members || []).length} members</div>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <button
                      onClick={() => window.location.href = `/channels/${c._id}`}
                      style={{
                        padding: "9px 12px",
                        width: "100%",
                        borderRadius: 10,
                        border: "none",
                        background: "#2563eb",
                        color: "#fff",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      Open
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
