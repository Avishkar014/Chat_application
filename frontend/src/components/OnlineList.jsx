// src/components/OnlineList.jsx
import React from "react";

export default function OnlineList({ online = [] }) {
  if (!Array.isArray(online) || online.length === 0) {
    return (
      <div style={{ padding: 12 }}>
        <h4 style={{ margin: 0 }}>Online</h4>
        <div style={{ marginTop: 8, color: "#6b7280" }}>No one online</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 12 }}>
      <h4 style={{ margin: 0 }}>Online</h4>
      <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
        {online.map((item) => {
          const id = typeof item === "string" ? item : item?.id;
          const name = typeof item === "string" ? null : item?.name;
          const label = name || (id ? id.slice(0, 8) : "Unknown");

          return (
            <div key={id || Math.random()} style={{ fontWeight: 700, color: "#111827" }}>
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
