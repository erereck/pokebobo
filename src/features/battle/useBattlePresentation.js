import { useEffect, useRef, useState } from "react";
import { restoreBattle } from "../../game/battle/restore.js";
import { battleSnapshot } from "../../game/battle/snapshot.js";
import {
  applyBattleEvent,
  battleEffect,
  battleEventDuration,
  newBattleEvents,
} from "./turnPresentation.js";

const SPEED_KEY = "pokebobo:battle-speed";

function previewChoice(spec, choice) {
  const preview = structuredClone(spec);
  preview.choices.push(choice);
  const battle = restoreBattle(preview);
  try {
    return battleSnapshot(battle);
  } finally {
    battle.destroy();
  }
}

export function useBattlePresentation({ battleSpec, snap, act }) {
  const [displaySnap, setDisplaySnap] = useState(snap);
  const [message, setMessage] = useState(
    snap.log.slice(-2).join(" ") || "Escolha seu primeiro golpe.",
  );
  const [effect, setEffect] = useState(null);
  const [locked, setLocked] = useState(false);
  const [speed, setSpeed] = useState(
    () => localStorage.getItem(SPEED_KEY) || "normal",
  );
  const sequence = useRef(0);

  useEffect(
    () => () => {
      sequence.current++;
    },
    [],
  );

  useEffect(() => {
    setDisplaySnap(snap);
    setMessage(
      snap.log.slice(-2).join(" ") || "Escolha seu primeiro golpe.",
    );
    setEffect(null);
    setLocked(false);
  }, [battleSpec.choices.length, snap]);

  const toggleSpeed = () => {
    setSpeed((current) => {
      const next = current === "fast" ? "normal" : "fast";
      localStorage.setItem(SPEED_KEY, next);
      return next;
    });
  };

  const move = async (choice) => {
    if (locked) return;
    const token = ++sequence.current;
    setLocked(true);

    let preview;
    try {
      preview = previewChoice(battleSpec, choice);
    } catch {
      if (act({ type: "BATTLE_CHOICE", choice }) === false) setLocked(false);
      return;
    }

    const events = newBattleEvents(snap, preview);
    let shown = structuredClone(snap);
    const reducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    for (const event of events) {
      if (token !== sequence.current) return;
      if (event.text) setMessage(event.text);
      shown = applyBattleEvent(shown, event, preview);
      setDisplaySnap(shown);
      setEffect(battleEffect(event));
      const duration = battleEventDuration(event.type, speed);
      await new Promise((resolve) =>
        setTimeout(resolve, reducedMotion ? Math.min(duration, 120) : duration),
      );
    }

    if (token !== sequence.current) return;
    setDisplaySnap(preview);
    setEffect(null);
    setMessage(
      preview.log.slice(-2).join(" ") || "Escolha seu próximo comando.",
    );

    const committed = act({ type: "BATTLE_CHOICE", choice });
    if (committed === false) setLocked(false);
  };

  return {
    displaySnap,
    message,
    effect,
    locked,
    speed,
    toggleSpeed,
    move,
  };
}
