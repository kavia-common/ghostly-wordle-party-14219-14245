import React from "react";
import { Modal, Button } from "../common/UI";

// PUBLIC_INTERFACE
export default function ResultOverlay({ open, onClose, result, onNewGame }) {
  if (!result) return null;
  const { is_won, attempts_used, target_word } = result;

  return (
    <Modal open={open} title={is_won ? "You Won!" : "Game Over"} onClose={onClose}>
      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ fontWeight: 800, color: is_won ? "var(--color-secondary)" : "var(--color-error)" }}>
          {is_won ? "Disco mode engaged! 🎉" : "A friendly ghost appears... 👻"}
        </div>
        <div>Attempts used: <strong>{attempts_used}</strong></div>
        {!is_won && target_word && <div>The word was: <strong>{(target_word || "").toUpperCase()}</strong></div>}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12, gap: 8 }}>
        <Button kind="outline" onClick={onClose}>Close</Button>
        <Button onClick={onNewGame}>New Game</Button>
      </div>
    </Modal>
  );
}
