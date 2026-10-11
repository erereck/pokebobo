import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameAudioContext } from "./AudioContext.js";
import { AudioEngine } from "./AudioEngine.js";
import {
  readAudioPreferences,
  normalizeAudioPreferences,
  writeAudioPreferences,
} from "./audioPreferences.js";
import { audioScene, nextTrack } from "./audioScene.js";
import tracks from "./tracks.json" with { type: "json" };
import cries from "./cryIndex.json" with { type: "json" };
import { battleVictory } from "../../game/selectors/battleVictory.js";

export function AudioProvider({ run, tab, modal, slot, children }) {
  const [preferences, setPreferences] = useState(() =>
    readAudioPreferences(localStorage, tracks),
  );
  const [saved, setSaved] = useState(true);
  const [status, setStatus] = useState({
    ready: false,
    playing: false,
    background: false,
    track: null,
    error: "",
  });
  const engine = useRef(null),
    prefs = useRef(preferences);
  const scene = audioScene(run, tab, modal);
  const change = useCallback((patch) => {
    const next = normalizeAudioPreferences(
      { ...prefs.current, ...patch },
      tracks,
    );
    prefs.current = next;
    setPreferences(next);
    setSaved(writeAudioPreferences(localStorage, next));
    engine.current?.setPreferences(next);
  }, []);
  const advance = useCallback(
    (direction = 1) => {
      const track = nextTrack(
        tracks,
        engine.current?.state.track || prefs.current.track,
        direction,
      );
      change({
        mode: "playlist",
        track,
      });
      engine.current?.setTrack(track, { restart: true });
    },
    [change],
  );
  useEffect(() => {
    const player = new AudioEngine({
      baseUrl: import.meta.env.BASE_URL,
      tracks,
      cries,
      preferences: prefs.current,
      onChange: setStatus,
      onNext: () => advance(1),
    });
    engine.current = player;
    const gesture = (event) => {
      if (
        event.type === "keydown" &&
        (event.repeat ||
          ["Shift", "Control", "Alt", "Meta", "Tab", "Escape"].includes(
            event.key,
          ))
      )
        return;
      player.unlock();
    };
    const click = (event) => {
      const button = event.target.closest?.("button, select, a");
      if (
        button &&
        !button.disabled &&
        !button.closest(
          "[data-audio-silent], .field-dpad, .field-map, .capture-menu",
        )
      )
        player.cue("ui");
    };
    const visibility = () => player.setVisible(!document.hidden);
    document.addEventListener("pointerdown", gesture, true);
    document.addEventListener("keydown", gesture, true);
    document.addEventListener("click", click, true);
    document.addEventListener("visibilitychange", visibility);
    visibility();
    return () => {
      document.removeEventListener("pointerdown", gesture, true);
      document.removeEventListener("keydown", gesture, true);
      document.removeEventListener("click", click, true);
      document.removeEventListener("visibilitychange", visibility);
      player.dispose();
      engine.current = null;
    };
  }, [advance]);
  const trackId = preferences.mode === "auto" ? scene.track : preferences.track;
  useEffect(() => {
    engine.current?.setTrack(trackId);
  }, [trackId]);
  const previousRun = useRef({ run, slot });
  useEffect(() => {
    const previous = previousRun.current;
    previousRun.current = { run, slot };
    if (
      !run ||
      previous.slot !== slot ||
      previous.run?.number !== run.number ||
      previous.run?.seed !== run.seed
    ) {
      engine.current?.stopScope();
      return;
    }
    if (
      previous.run?.phase === "battle" &&
      run.phase === "result" &&
      battleVictory(run)
    )
      engine.current?.cue(run.battle.kind === "gym" ? "badge" : "level", {
        scope: "celebration",
      });
    if (run.balls > previous.run.balls || run.berries > previous.run.berries)
      engine.current?.cue("item", { scope: "celebration" });
    if (
      previous.run?.phase === "result" &&
      run.phase === "career" &&
      previous.run.battle?.kind === "ambush"
    )
      engine.current?.cue("recovery", { scope: "celebration" });
    const oldMons = new Map(
      [...(previous.run?.party || []), ...(previous.run?.box || [])].map(
        (mon) => [mon.id, mon],
      ),
    );
    if (
      [...(run.party || []), ...(run.box || [])].some(
        (mon) => oldMons.has(mon.id) && oldMons.get(mon.id).name !== mon.name,
      )
    )
      engine.current?.cue("evolved", { scope: "celebration" });
    else if (
      [...(run.party || []), ...(run.box || [])].some(
        (mon) => oldMons.has(mon.id) && mon.level > oldMons.get(mon.id).level,
      )
    )
      engine.current?.cue("level", { scope: "celebration" });
    if (previous.run?.phase !== "starter" && run.phase === "starter")
      engine.current?.cue("send");
  }, [run, slot]);
  const value = useMemo(
    () => ({
      preferences,
      saved,
      status,
      tracks,
      scene,
      change,
      advance,
      activate: () =>
        engine.current?.unlock(Boolean(engine.current.state.error)),
      toggle: () => {
        if (!prefs.current.muted && !engine.current?.state.ready)
          engine.current?.unlock(true);
        else {
          const muted = !prefs.current.muted;
          change({ muted });
          if (!muted) engine.current?.unlock(true);
        }
      },
      select: (track) => {
        change({ mode: "playlist", track, muted: false });
        engine.current?.setTrack(track, { restart: true });
        engine.current?.unlock();
      },
      cue: (sound, options) => engine.current?.cue(sound, options),
      cry: (name, options) => engine.current?.cry(name, options),
      preloadCry: (name) => engine.current?.preloadCry(name),
      preloadCapture: () => engine.current?.preloadCapture(),
      stopScope: (scope) => engine.current?.stopScope(scope),
    }),
    [preferences, saved, status, change, advance, scene.track, scene.label],
  );
  return (
    <GameAudioContext.Provider value={value}>
      {children}
    </GameAudioContext.Provider>
  );
}
