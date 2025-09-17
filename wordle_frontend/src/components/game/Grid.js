import React from "react";
import "./grid.css";

/**
 * Renders the 5-row grid. Each row shows letters and their status:
 * - correct (green), present (amber), absent (gray), or empty.
 * Expects rows: Array<Array<{ char: string, status: 'correct'|'present'|'absent'|'empty' }>>
 */
// PUBLIC_INTERFACE
export function Grid({ rows = [], shakingRow = -1 }) {
  return (
    <div className="grid">
      {rows.map((row, idx) => (
        <div key={idx} className={`grid-row ${shakingRow === idx ? "shake" : ""}`}>
          {row.map((cell, cidx) => (
            <div key={cidx} className={`grid-cell status-${cell.status || "empty"}`}>
              {cell.char?.toUpperCase() || ""}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
