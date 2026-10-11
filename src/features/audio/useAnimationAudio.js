import { useEffect, useId, useRef } from "react";
import { useAudio } from "./AudioContext.js";
import { crossedCues } from "./audioCues.js";

export function useAnimationAudio(key, cues, cryName) {
  const audio = useAudio(),
    liveAudio = useRef(audio),
    scope = useId();
  liveAudio.current = audio;
  const progress = useRef({ key: null, tick: -1 });
  useEffect(() => {
    liveAudio.current?.preloadCapture();
    if (cryName) liveAudio.current?.preloadCry(cryName);
    return () => liveAudio.current?.stopScope(scope);
  }, [key, cryName, scope]);
  return (tick, jumped) => {
    if (progress.current.key !== key) progress.current = { key, tick: -1 };
    const previous = progress.current.tick;
    if (tick <= previous) return;
    progress.current.tick = tick;
    for (const cue of crossedCues(cues, previous, tick, jumped)) {
      // A fanfare pode continuar enquanto o treinador retorna ao campo.
      if (cue.cry) liveAudio.current?.cry(cue.cry, { scope });
      else
        liveAudio.current?.cue(cue.sound, {
          scope: cue.sound === "caught" ? "celebration" : scope,
        });
    }
  };
}
