import React from "react";
import Navbar from "../components/Navbar";

export default function HomePage() {
  return (
    <>
      

      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100vh - 70px)",
        textAlign: "center",
        padding: 20
      }}>
        
        <div style={{
          width: 90,
          height: 90,
          borderRadius: 20,
          background: "#2563eb",
          color: "#fff",
          fontSize: 38,
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20
        }}>
          TC
        </div>

        <h1 style={{ fontSize: 36, margin: 0, color: "#1e293b" }}>
          Welcome to TeamChat
        </h1>

        <p style={{
          marginTop: 10,
          maxWidth: 480,
          color: "#475569",
          fontSize: 16,
          lineHeight: 1.5
        }}>
          A simple and fast real-time chat platform for your team.  
          Connect, collaborate, and communicate effortlessly.
        </p>

        <div style={{ marginTop: 30, display: "flex", gap: 16 }}>
          <button
            onClick={() => (window.location.href = "/signup")}
            style={{
              padding: "10px 22px",
              background: "#2563eb",
              border: "none",
              color: "#fff",
              fontWeight: 600,
              borderRadius: 10,
              cursor: "pointer",
              fontSize: 16
            }}>
            Get Started
          </button>

          <button
            onClick={() => (window.location.href = "/login")}
            style={{
              padding: "10px 22px",
              background: "#fff",
              border: "1px solid #2563eb",
              color: "#2563eb",
              fontWeight: 600,
              borderRadius: 10,
              cursor: "pointer",
              fontSize: 16
            }}>
            Login
          </button>
        </div>
      </div>
    </>
  );
}
