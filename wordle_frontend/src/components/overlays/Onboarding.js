import React, { useEffect, useState } from "react";
import { Modal, Button } from "../common/UI";

// PUBLIC_INTERFACE
export default function Onboarding({ open, onClose }) {
  const [step, setStep] = useState(0);
  useEffect(()=>{ if (!open) setStep(0); }, [open]);

  const steps = [
    {
      title: "Welcome to Ghostly Wordle Party",
      body: "Guess the 5-letter word within limited attempts. Use the keyboard or your physical keys.",
    },
    {
      title: "Color Hints",
      body: "Green means correct letter in correct spot, amber means letter exists elsewhere, gray means absent.",
    },
    {
      title: "Effects",
      body: "Win to trigger disco lights and confetti! Lose to see a spooky friendly ghost.",
    },
  ];

  const s = steps[step];

  return (
    <Modal open={open} title={s.title} onClose={onClose}>
      <p style={{ color: "var(--color-text-muted)" }}>{s.body}</p>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
        <Button kind="outline" onClick={onClose}>Skip</Button>
        <div style={{ display: "flex", gap: 8 }}>
          {step > 0 && <Button kind="outline" onClick={()=>setStep(step-1)}>Back</Button>}
          {step < steps.length - 1 ? (
            <Button onClick={()=>setStep(step+1)}>Next</Button>
          ) : (
            <Button onClick={onClose}>Start</Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
