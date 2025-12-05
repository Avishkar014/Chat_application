import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";

export default function Navbar({ activeChannelName }) {
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  let nav = null;
  try {
    nav = useNavigate();
  } catch (e) {
    nav = null;
  }

  function goHome() {
    if (nav) nav("/");
    else window.location.href = "/";
  }

  return (
    <>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 18px",
        borderBottom: "1px solid #ececec",
        background: "#ffffff",
        position: "sticky",
        top: 0,
        zIndex: 20
      }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", cursor: "pointer" }} onClick={goHome}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 8,
            background: "#2563eb",
            color: "#fff",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>TC</div>

          <div>
            <div style={{ fontWeight: 700 }}>Team Chat</div>
            <div style={{ fontSize: 12, color: "#666" }}>
              {activeChannelName ? `Channel: ${activeChannelName}` : "Channels"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {user ? (
            <>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 600 }}>{user.name || (user.id && user.id.slice(0, 8))}</div>
                <div style={{ fontSize: 12, color: "#666" }}>{user.email || ""}</div>
              </div>

              <button
                onClick={() => { logout(); if (nav) nav("/login"); else window.location.href = "/login"; }}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "none",
                  background: "#ef4444",
                  color: "#fff",
                  cursor: "pointer"
                }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowLogin(true)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "1px solid #2563eb",
                  background: "#fff",
                  color: "#2563eb",
                  cursor: "pointer"
                }}>
                Login
              </button>

              <button
                onClick={() => { if (nav) nav("/signup"); else window.location.href = "/signup"; }}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "none",
                  background: "#2563eb",
                  color: "#fff",
                  cursor: "pointer"
                }}>
                Sign up
              </button>
            </>
          )}
        </div>
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
