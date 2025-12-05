import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    try {
      await login(email, password);
      nav("/channels");
    } catch (err) {
      alert(err.response?.data?.error || "Invalid login credentials");
    }
  }

  return (
    <div style={{
      minHeight: "calc(100vh - 70px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f8fafc",
      padding: 20
    }}>
      <div style={{
        width: "100%",
        maxWidth: 380,
        background: "#ffffff",
        padding: "32px 28px",
        borderRadius: 14,
        boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
        border: "1px solid #e2e8f0"
      }}>

        <h2 style={{ textAlign: "center", marginBottom: 20, color: "#1e293b" }}>
          Login
        </h2>

        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid #cbd5e1",
              fontSize: 15
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid #cbd5e1",
              fontSize: 15
            }}
          />

          <button type="submit" style={{
            padding: "12px 14px",
            borderRadius: 10,
            border: "none",
            background: "#2563eb",
            color: "white",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer"
          }}>
            Login
          </button>
        </form>

        <p style={{ marginTop: 16, textAlign: "center", fontSize: 14, color: "#475569" }}>
          Don't have an account?{" "}
          <a href="/signup" style={{ color: "#2563eb", fontWeight: 600 }}>Sign up</a>
        </p>

      </div>
    </div>
  );
}
