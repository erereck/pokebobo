// Cues derivados dos quadros visuais, inclusive após suspensão da aba.
export function captureCues(frames) {
  const cues = [];
  let previous;
  for (let tick = 0; tick < frames.length; tick++) {
    const frame = frames[tick],
      stage = frame.stage;
    if (tick === 20) cues.push({ tick, sound: "throw" });
    if (stage !== previous?.stage) {
      const sound = {
        open: "open",
        absorb: "absorb",
        close: "close",
        caught: "caught",
        breakout: "breakout",
      }[stage];
      if (sound) cues.push({ tick, sound });
      if (stage.startsWith("shake-")) cues.push({ tick, sound: "shake" });
    }
    if (
      stage === "bounce" &&
      frame.ball?.y >= 69 &&
      (previous?.stage !== "bounce" || previous.ball?.y < 69)
    )
      cues.push({ tick, sound: "bounce" });
    previous = frame;
  }
  return cues;
}

export function battleAudioCue(event) {
  if (event.type === "switch") return { sound: "send", cry: event.name };
  return {
    sound: {
      move: "attack",
      damage: "hit",
      heal: "heal",
      status: "status",
      curestatus: "heal",
      faint: "faint",
      futurestart: "psychic",
      futurehit: "psychicHit",
    }[event.type],
  };
}

// Um salto/pulo de animação não despeja dezenas de sons de uma vez.
export function crossedCues(cues, previousTick, tick, jumped = false) {
  const crossed = cues.filter(
    (cue) => cue.tick > previousTick && cue.tick <= tick,
  );
  return jumped && cues.length > 3
    ? crossed
        .filter((cue) => cue.sound === "caught" || cue.sound === "breakout")
        .slice(-1)
    : crossed;
}
