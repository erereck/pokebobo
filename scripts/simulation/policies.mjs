import catalog from "../../src/game/catalog.json" with { type: "json" };
import { weekLimit } from "../../src/game/selectors/weekLimit.js";
import { canTrain } from "../../src/game/selectors/levelGain.js";

export const STRATEGIES = ["training", "balanced", "coverage", "random"];
export function choosePreparation(run, strategy, rng) {
  const available = run.encounters.some((e) => !e.used) && run.balls > 0;
  if (strategy === "training")
    return { type: canTrain(run.party) ? "TRAIN" : "CHALLENGE" };
  if (strategy === "random") {
    const actions = [
      ...(canTrain(run.party) ? ["TRAIN"] : []),
      "FORAGE",
      ...(available ? ["EXPLORE"] : []),
      ...(run.berries ? ["PREPARE"] : []),
    ];
    return { type: actions[Math.floor(rng() * actions.length)] };
  }
  const targetSize = strategy === "coverage" ? 6 : 4;
  if (available && run.party.length < targetSize && run.spent === 0)
    return { type: "EXPLORE" };
  if (
    strategy === "coverage" &&
    available &&
    run.badges >= 3 &&
    run.spent === 0 &&
    run.party.length === 6
  )
    return { type: "EXPLORE" };
  if (
    run.spent === weekLimit(run) - 1 &&
    run.berries &&
    run.route[run.position].kind === "gym" &&
    !run.prepared
  )
    return { type: "PREPARE" };
  return { type: canTrain(run.party) ? "TRAIN" : "CHALLENGE" };
}
export function chooseCapture(run, strategy, rng) {
  const types = new Set(run.party.flatMap((mon) => catalog[mon.name].types));
  const opportunities = run.encounters
    .map((e, index) => ({ ...e, index }))
    .filter((e) => !e.used);
  if (!opportunities.length) return { type: "SKIP_ENCOUNTER" };
  const score = (name) =>
    catalog[name].types.filter((t) => !types.has(t)).length * 100 +
    Object.values(catalog[name].stats).reduce((a, b) => a + b, 0) / 10;
  const selected =
    strategy === "random"
      ? opportunities[Math.floor(rng() * opportunities.length)]
      : opportunities.sort((a, b) => score(b.name) - score(a.name))[0];
  const weakest = [...run.party].sort(
    (a, b) => a.level - b.level || score(a.name) - score(b.name),
  )[0];
  return {
    type: "CAPTURE",
    index: selected.index,
    ...(run.party.length === 6 ? { replaceId: weakest.id } : {}),
  };
}
