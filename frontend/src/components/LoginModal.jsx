import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginModal({ onClose }) {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handle(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email.trim(), password);
      onClose();
      nav("/channels");
    } catch (err) {
      alert(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="brand">Team Chat</div>
          <button className="close-btn" onClick={onClose} aria-label="close">✕</button>
        </div>

        <div className="modal-body">
          <h2 className="modal-title">Welcome back</h2>
          <p className="modal-sub">Sign in to continue to your workspace</p>

          <form onSubmit={handle} className="modal-form">
            <label className="field">
              <div className="field-label">Email</div>
              <input
                type="email"
                required
                className="field-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
              />
            </label>

            <label className="field">
              <div className="field-label">Password</div>
              <input
                type="password"
                required
                className="field-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </label>

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="modal-foot">
            <span>New here?</span>
            <button className="link-btn" onClick={() => { onClose(); window.location.href = "/signup"; }}>Create an account</button>
          </div>
        </div>
      </div>
    </div>
  );
}
