import React from "react";
import { Link } from "react-router-dom";

export default function ChannelList({ channels }) {
  return (
    <div>
      {channels.map(c => (
        <div key={c._id} className="channel-item">
          <Link to={`/channels/${c._id}`}>{c.name}</Link> <small>({c.members?.length||0})</small>
        </div>
      ))}
    </div>
  );
}
