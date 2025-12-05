import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  async function fetchProfile(token) {
    try {
      const res = await api.get("/auth/me");
      if (res?.data) {
        const u = res.data.user || res.data;
        setUser({ id: u.id || u._id, name: u.name || u.email?.split("@")[0], email: u.email });
        return;
      }
    } catch (e) {
      // fallback to token decode below
    }
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ id: payload.id, name: payload.name || payload.email?.split("@")[0], email: payload.email });
      } catch {
        setUser(null);
      }
    }
  }

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    const token = res.data.token;
    localStorage.setItem("token", token);
    await fetchProfile(token);
  }

  async function signup(name, email, password) {
    const res = await api.post("/auth/signup", { name, email, password });
    const token = res.data.token;
    localStorage.setItem("token", token);
    await fetchProfile(token);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    try { window.location.href = "/login"; } catch {}
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetchProfile(token);
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
