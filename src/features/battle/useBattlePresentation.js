import { useEffect, useId, useRef, useState } from "react";
import { browserStorage } from "../../shared/browserStorage.js";
import { useAudio } from "../audio/AudioContext.js";
import { battleAudioCue } from "../audio/audioCues.js";
import { restoreBattle } from "../../game/battle/restore.js";
import { battleSnapshot } from "../../game/battle/snapshot.js";
import {
  readBattleSpeed,
  writeBattleSpeed,
} from "../../app/preferences/battleSpeed.js";
import {
  applyBattleEvent,
  battleEffect,
  battleEventDuration,
  newBattleEvents,
} from "./turnPresentation.js";

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
  const audio = useAudio(),
    liveAudio = useRef(audio),
    audioScope = useId();
  liveAudio.current = audio;
  const entranceTimers = useRef([]);
  const [displaySnap, setDisplaySnap] = useState(snap);
  const [message, setMessage] = useState(
    snap.log.slice(-2).join(" ") || "Escolha seu primeiro golpe.",
  );
  const [effect, setEffect] = useState(null);
  const [locked, setLocked] = useState(false);
  const [speed, setSpeed] = useState(() => readBattleSpeed(browserStorage));
  const sequence = useRef(0);
  const pending = useRef(null);
  const liveFinish = useRef(null);
  const wait = useRef(null);
  const cancelWait = () => {
    if (!wait.current) return;
    clearTimeout(wait.current.timer);
    wait.current.resolve();
    wait.current = null;
  };

  useEffect(
    () => () => {
      sequence.current++;
      pending.current = null;
      cancelWait();
      entranceTimers.current.forEach(clearTimeout);
      liveAudio.current?.stopScope(audioScope);
    },
    [],
  );

  const battleKey = battleSpec.seed.join("-");
  useEffect(() => {
    liveAudio.current?.preloadCry(snap.foe?.name);
    liveAudio.current?.preloadCry(snap.active?.name);
    // Não reexecuta o histórico de golpes ao carregar um save.
    liveAudio.current?.cue("encounter", { scope: audioScope });
    entranceTimers.current = [
      setTimeout(
        () => liveAudio.current?.cry(snap.foe?.name, { scope: audioScope }),
        180,
      ),
      setTimeout(
        () => liveAudio.current?.cry(snap.active?.name, { scope: audioScope }),
        1050,
      ),
    ];
    return () => entranceTimers.current.forEach(clearTimeout);
  }, [battleKey, audioScope]);

  useEffect(() => {
    setDisplaySnap(snap);
    setMessage(snap.log.slice(-2).join(" ") || "Escolha seu primeiro golpe.");
    setEffect(null);
    setLocked(false);
  }, [battleSpec.choices.length, snap]);

  const toggleSpeed = () => {
    setSpeed((current) => {
      const next = current === "fast" ? "normal" : "fast";
      writeBattleSpeed(browserStorage, next);
      return next;
    });
  };

  // Um comando escolhido é aplicado uma única vez, inclusive ao pular ou
  // abrir outra tela. Sair da arena não permite desfazer o turno previsto.
  const finishTurn = () => {
    const turn = pending.current;
    if (!turn) return false;
    pending.current = null;
    sequence.current++;
    cancelWait();
    liveAudio.current?.stopScope(audioScope);
    setDisplaySnap(turn.preview);
    setEffect(null);
    setMessage(
      turn.preview.log.slice(-2).join(" ") || "Escolha seu próximo comando.",
    );
    const committed = turn.commit();
    setLocked(false);
    return committed;
  };
  liveFinish.current = finishTurn;
  useEffect(() => {
    const finish = () => liveFinish.current?.();
    const visibility = () => {
      if (document.hidden) finish();
    };
    window.addEventListener("beforeunload", finish);
    window.addEventListener("pagehide", finish);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.removeEventListener("beforeunload", finish);
      window.removeEventListener("pagehide", finish);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  const move = async (choice) => {
    if (locked || pending.current) return;
    const token = ++sequence.current;
    entranceTimers.current.forEach(clearTimeout);
    setLocked(true);

    let preview;
    try {
      preview = previewChoice(battleSpec, choice);
    } catch {
      act({ type: "BATTLE_CHOICE", choice });
      setLocked(false);
      return;
    }
    pending.current = {
      preview,
      commit: () => act({ type: "BATTLE_CHOICE", choice }),
    };

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
      const duration = battleEventDuration(event.type, speed);
      const actualDuration = reducedMotion ? Math.min(duration, 120) : duration;
      const nextEffect = battleEffect(event);
      setEffect(
        nextEffect ? { ...nextEffect, duration: actualDuration } : null,
      );
      const cue = battleAudioCue(event);
      if (cue.sound) liveAudio.current?.cue(cue.sound, { scope: audioScope });
      if (cue.cry) liveAudio.current?.cry(cue.cry, { scope: audioScope });
      await new Promise((resolve) => {
        wait.current = {
          resolve,
          timer: setTimeout(() => {
            wait.current = null;
            resolve();
          }, actualDuration),
        };
      });
    }

    if (token !== sequence.current) return;
    finishTurn();
  };

  return {
    displaySnap,
    message,
    effect,
    locked,
    speed,
    toggleSpeed,
    finishTurn,
    move,
  };
}
