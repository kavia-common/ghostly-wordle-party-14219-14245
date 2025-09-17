import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, Button } from "../components/common/UI";
import { Grid } from "../components/game/Grid";
import { Keyboard } from "../components/game/Keyboard";
import { DiscoLights, PartyPopper, GhostOverlay } from "../components/effects/Effects";
import Onboarding from "../components/overlays/Onboarding";
import ResultOverlay from "../components/overlays/ResultOverlay";
import { gameApi, effectsApi } from "../services/api";

// Convert backend "result" info to grid row statuses.
// Backend may return guess info; if not, we derive locally and update when response arrives.
function emptyRow() {
  return new Array(5).fill(0).map(()=>({ char: "", status: "empty" }));
}

function clampWord(s) {
  return (s || "").slice(0,5);
}

// PUBLIC_INTERFACE
export default function GamePage() {
  const [game, setGame] = useState(null);
  const [rows, setRows] = useState([emptyRow(), emptyRow(), emptyRow(), emptyRow(), emptyRow(), emptyRow()]);
  const [activeRow, setActiveRow] = useState(0);
  const [current, setCurrent] = useState("");
  const [keyboardStatuses, setKeyboardStatuses] = useState({});
  const [loading, setLoading] = useState(false);
  const [shakeRow, setShakeRow] = useState(-1);

  const [showOnboard, setShowOnboard] = useState(false);
  const [showDisco, setShowDisco] = useState(false);
  const [showPopper, setShowPopper] = useState(false);
  const [showGhost, setShowGhost] = useState(false);
  const [resultOverlay, setResultOverlay] = useState({ open: false, data: null });

  const containerRef = useRef(null);

  // Load active game if exists, otherwise create one
  useEffect(() => {
    (async function init() {
      try {
        const g = await gameApi.current();
        if (g && g.id) {
          setGame(g);
          hydrateFromGame(g);
        } else {
          const ng = await gameApi.newGame(6);
          setGame(ng);
          hydrateFromGame(ng);
          setShowOnboard(true);
        }
      } catch {
        // On error, try creating a new game
        try {
          const ng = await gameApi.newGame(6);
          setGame(ng);
          hydrateFromGame(ng);
          setShowOnboard(true);
        } catch {
          // swallow, surface minimal UI
        }
      }
    })();
  }, []);

  function hydrateFromGame(g) {
    const max = g?.max_attempts ?? 6;
    const baseRows = new Array(max).fill(0).map(()=>emptyRow());
    const guesses = Array.isArray(g?.guesses) ? g.guesses : [];
    const statuses = {};
    guesses.forEach((gu, idx) => {
      const word = (gu.text || "").slice(0,5);
      baseRows[idx] = word.padEnd(5).split("").map((ch, i) => ({
        char: ch.trim(),
        status: gu.result?.[i] || "absent",
      }));
      // update keyboard statuses (priority: correct > present > absent)
      for (let i=0;i<word.length;i++) {
        const k = word[i].toLowerCase();
        const s = gu.result?.[i] || "absent";
        statuses[k] = maxStatus(statuses[k], s);
      }
    });
    setRows(baseRows);
    setActiveRow(guesses.length);
    setKeyboardStatuses(statuses);
  }

  function maxStatus(prev, s) {
    if (prev === "correct" || s === "correct") return "correct";
    if (prev === "present" || s === "present") return "present";
    if (prev === "absent" || s === "absent") return "absent";
    return prev || "neutral";
  }

  // Keyboard / physical key handling
  useEffect(() => {
    function handler(e) {
      if (!containerRef.current) return;
      const key = e.key.toLowerCase();
      if (key === "enter") onKey("enter");
      else if (key === "backspace") onKey("back");
      else if (/^[a-z]$/.test(key)) onKey(key);
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  function onKey(k) {
    if (!game || loading) return;
    if (resultOverlay.open) return; // freeze after end

    if (k === "enter") {
      submitGuess();
      return;
    }
    if (k === "back") {
      setCurrent((c) => c.slice(0, -1));
      setRows((rs) => {
        const newRows = rs.map((r)=>r.slice());
        const idx = current.length - 1;
        if (idx >= 0 && idx < 5) newRows[activeRow][idx] = { char: "", status: "empty" };
        return newRows;
      });
      return;
    }
    if (/^[a-z]$/.test(k)) {
      setCurrent((c) => {
        if (c.length >= 5) return c;
        const next = c + k;
        setRows((rs) => {
          const newRows = rs.map((r)=>r.slice());
          const idx = next.length - 1;
          newRows[activeRow][idx] = { char: k, status: "empty" };
          return newRows;
        });
        return next;
      });
    }
  }

  async function submitGuess() {
    const guess = clampWord(current);
    if (guess.length < 5) {
      flashShake(activeRow);
      return;
    }
    setLoading(true);
    try {
      const resp = await gameApi.guess({ guess, game_id: game?.id });
      // Expected to include info like: is_won, result array, attempts_used, maybe target info when done.
      // Update grid row with statuses from resp.guess_result or similar.
      const resultArray = resp.result || resp.guess_result || [];
      setRows((rs) => {
        const newRows = rs.map((r)=>r.slice());
        newRows[activeRow] = guess.split("").map((ch, i) => ({
          char: ch, status: resultArray[i] || "absent",
        }));
        return newRows;
      });

      // Update keyboard statuses
      const updates = {};
      for (let i=0;i<guess.length;i++) {
        const k = guess[i];
        updates[k] = maxStatus(keyboardStatuses[k], resultArray[i] || "absent");
      }
      setKeyboardStatuses((ks)=> ({ ...ks, ...updates }));

      // Clear current input and move to next row if not finished
      setCurrent("");
      const isWon = Boolean(resp.is_won);
      const isEnded = isWon || Boolean(resp.ended_at);

      if (isWon) {
        setShowDisco(true);
        setShowPopper(true);
        try { await effectsApi.trigger("disco", { game_id: String(game?.id || "") }); } catch {}
        try { await effectsApi.trigger("party_popper", { game_id: String(game?.id || "") }); } catch {}
        setTimeout(()=>setShowPopper(false), 2600);
      } else if (isEnded) {
        setShowGhost(true);
        try { await effectsApi.trigger("ghost", { game_id: String(game?.id || "") }); } catch {}
      }

      if (isEnded) {
        setResultOverlay({ open: true, data: {
          is_won: isWon,
          attempts_used: resp.attempts_used,
          target_word: resp.target_word,
        }});
      } else {
        setActiveRow((r) => r + 1);
      }

      // Refresh game state
      setGame((g)=> ({ ...(g||{}), ...resp, guesses: mergeGuesses(g?.guesses, resp) }));
    } catch (e) {
      flashShake(activeRow);
    } finally {
      setLoading(false);
    }
  }

  function mergeGuesses(prevGuesses, resp) {
    const arr = Array.isArray(prevGuesses) ? prevGuesses.slice() : [];
    if (resp && resp.text) {
      arr.push({ text: resp.text, result: resp.result });
    }
    return arr;
  }

  function flashShake(rowIndex) {
    setShakeRow(rowIndex);
    setTimeout(()=>setShakeRow(-1), 550);
  }

  async function newGame() {
    setResultOverlay({ open: false, data: null });
    setShowGhost(false);
    setShowDisco(false);
    setShowPopper(false);

    const ng = await gameApi.newGame(6);
    setGame(ng);
    hydrateFromGame(ng);
    setCurrent("");
    setKeyboardStatuses({});
  }

  const winActive = showDisco || showPopper;
  const lossActive = showGhost;

  return (
    <div className="page" ref={containerRef}>
      <DiscoLights active={winActive} />
      <PartyPopper active={winActive} />
      <GhostOverlay active={lossActive} />

      <Onboarding open={showOnboard} onClose={() => setShowOnboard(false)} />
      <ResultOverlay
        open={resultOverlay.open}
        result={resultOverlay.data}
        onClose={() => setResultOverlay((r)=>({ ...r, open: false }))}
        onNewGame={newGame}
      />

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Guess the word</h2>
          <Button kind="outline" onClick={newGame}>New Game</Button>
        </div>
        <div style={{ marginTop: 12 }}>
          <Grid rows={rows} shakingRow={shakeRow} />
        </div>
        <div style={{ marginTop: 12 }}>
          <Keyboard onKey={onKey} statuses={keyboardStatuses} />
        </div>
        <div style={{ marginTop: 8, color: "var(--color-text-muted)", fontSize: 13 }}>
          Press Enter to submit. Backspace to delete. Current attempt: {activeRow + 1}.
        </div>
      </Card>
    </div>
  );
}
