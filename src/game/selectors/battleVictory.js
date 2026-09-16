export const noSurvivors = (run) =>
  run.mode === "nuzlocke" &&
  run.outcome.player.length > 0 &&
  run.outcome.player.every((mon) => mon.fainted);

export const battleVictory = (run) =>
  run.outcome.winner === "Você" && !noSurvivors(run);
