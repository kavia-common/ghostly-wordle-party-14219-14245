import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { userApi } from "../services/api";
import { Card } from "../components/common/UI";

// PUBLIC_INTERFACE
export default function ProfilePage() {
  const { user, profile, setProfile } = useAuth();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    userApi.me().then(setProfile).catch(()=>{});
    userApi.history(20).then((d) => setHistory(d?.results || d || [])).catch(()=>{});
  }, [setProfile]);

  if (!user) return (
    <div className="page">
      <Card><strong>Please log in to view your profile.</strong></Card>
    </div>
  );

  const stats = profile?.stats || profile || {};

  return (
    <div className="page">
      <div className="card">
        <h2>Your Profile</h2>
        <div style={{ color: "var(--color-text-muted)" }}>{user.email || "No email set"}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 12 }}>
          <Stat label="Games" value={stats.games_played ?? "--"} />
          <Stat label="Wins" value={stats.wins ?? "--"} />
          <Stat label="Current Streak" value={stats.current_streak ?? "--"} />
          <Stat label="Best Streak" value={stats.best_streak ?? "--"} />
        </div>
      </div>
      <div className="card">
        <h3>Recent Games</h3>
        <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
          {history.length === 0 ? <div>No games yet. Start your first game!</div> : history.map((g) => (
            <div key={g.id} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--color-border)", paddingBottom: 6 }}>
              <span>Game #{g.id}</span>
              <span>{g.is_won ? "Won" : "Lost"} in {g.attempts_used} attempts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <div style={{ fontSize: 12, color: "var(--color-text-muted)", fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 900 }}>{value}</div>
    </div>
  );
}
