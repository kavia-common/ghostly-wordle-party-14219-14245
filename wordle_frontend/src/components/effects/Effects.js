import React, { useEffect, useState } from "react";
import "./effects.css";

/**
 * DiscoLights: full screen lights animation for win celebration.
 */
// PUBLIC_INTERFACE
export function DiscoLights({ active }) {
  return (
    <div className={`disco ${active ? "active" : ""}`} aria-hidden={!active}>
      <div className="beam blue" />
      <div className="beam amber" />
      <div className="beam green" />
    </div>
  );
}

/**
 * PartyPopper: lightweight confetti particles for wins.
 */
// PUBLIC_INTERFACE
export function PartyPopper({ active }) {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    if (!active) return;
    const p = new Array(80).fill(0).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 200,
      color: ["#2563EB", "#F59E0B", "#22C55E", "#EF4444"][i % 4],
      size: 6 + Math.round(Math.random() * 6),
    }));
    setParticles(p);
    const t = setTimeout(() => setParticles([]), 2500);
    return () => clearTimeout(t);
  }, [active]);
  return (
    <div className={`popper ${active ? "active" : ""}`} aria-hidden={!active}>
      {particles.map((p) => (
        <span
          key={p.id}
          className="confetti"
          style={{
            left: `${p.left}%`,
            background: p.color,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}ms`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * GhostOverlay: spooky translucent ghost that floats for losses.
 */
// PUBLIC_INTERFACE
export function GhostOverlay({ active, message = "Boo! Better luck next time." }) {
  return (
    <div className={`ghost-overlay ${active ? "active" : ""}`} aria-hidden={!active}>
      <div className="ghost">
        <div className="eyes">
          <div className="eye" />
          <div className="eye" />
        </div>
        <div className="mouth" />
      </div>
      <div className="ghost-message">{message}</div>
    </div>
  );
}
