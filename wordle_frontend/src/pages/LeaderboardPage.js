import React, { useEffect, useState } from "react";
import { leaderboardApi } from "../services/api";
import { Card, Button } from "../components/common/UI";

const TYPES = ["streak", "win_rate", "fastest", "best_attempts"];

// PUBLIC_INTERFACE
export default function LeaderboardPage() {
  const [type, setType] = useState("streak");
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    setErr("");
    leaderboardApi.list(type, 20).then((data)=>{
      const list = data?.results || data || [];
      setRows(list);
    }).catch(()=>setErr("Failed to load leaderboard."));
  }, [type]);

  return (
    <div className="page">
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2>Leaderboard</h2>
          <div style={{ display: "flex", gap: 8 }}>
            {TYPES.map((t) => (
              <Button key={t} kind={t===type?"primary":"outline"} onClick={()=>setType(t)}>
                {t.replace("_"," ").toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
        {err && <div style={{ color: "var(--color-error)", fontWeight: 700 }}>{err}</div>}
        <div style={{ display: "grid", gap: 8 }}>
          {rows.length === 0 ? <div>No data.</div> : rows.map((r, idx) => (
            <div key={idx} style={{ display: "grid", gridTemplateColumns: "40px 1fr 120px", gap: 8, padding: "8px 0", borderBottom: "1px solid var(--color-border)" }}>
              <div style={{ fontWeight: 800, color: "var(--color-primary)" }}>#{idx+1}</div>
              <div>{r.username || r.user || "Player"}</div>
              <div style={{ textAlign: "right", fontWeight: 800 }}>{r.value ?? r.score ?? r.streak ?? ""}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
