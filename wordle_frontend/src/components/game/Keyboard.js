import React from "react";
import "./keyboard.css";

const KEYS = [
  ["q","w","e","r","t","y","u","i","o","p"],
  ["a","s","d","f","g","h","j","k","l"],
  ["enter","z","x","c","v","b","n","m","back"],
];

/**
 * Keyboard with letter coloring based on known statuses.
 * statuses: { letter: 'correct'|'present'|'absent' }
 */
// PUBLIC_INTERFACE
export function Keyboard({ onKey, statuses = {} }) {
  return (
    <div className="kb">
      {KEYS.map((row, ridx) => (
        <div className="kb-row" key={ridx}>
          {row.map((k) => {
            const label = k === "back" ? "⌫" : k.toUpperCase();
            const st = statuses[k] || "neutral";
            return (
              <button
                key={k}
                className={`kb-key kb-${st} ${k.length > 1 ? "kb-wide" : ""}`}
                onClick={() => onKey(k)}
                aria-label={`key ${k}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
