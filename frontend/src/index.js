import React from "react";
import ReactDOM from "react-dom/client";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import ChannelsPage from "./pages/Channels";
import ChannelPage from "./pages/Channel";
import "./index.css";
import HomePage from "./pages/Home";

function InnerApp() {
  const location = useLocation();
  let activeChannelName = null;
  const match = location.pathname.match(/^\/channels\/([^\/\?]+)/);
  if (match) activeChannelName = match[1];

  return (
    <>
      <Navbar activeChannelName={activeChannelName} />
      <div style={{ paddingTop: 12 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/channels" element={<ChannelsPage />} />
          <Route path="/channels/:id" element={<ChannelPage />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <InnerApp />
      </BrowserRouter>
    </AuthProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
