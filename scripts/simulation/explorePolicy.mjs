import { atLake, isTallGrass } from "../../src/game/world/exploration.js";

export function chooseExploration(run) {
  const e = run.exploration;
  if (!run.balls) return { type: "EXIT_ROUTE" };
  const index = e.spots.findIndex((spot, i) => spot && !run.encounters[i].used);
  const target = index >= 0 ? { x: 3, y: 3 } : { x: 8, y: 3 };
  if (
    index < 0 &&
    !run.encounters.some((mon) => mon.habitat === "water" && !mon.used)
  )
    return { type: "EXIT_ROUTE" };
  if (index < 0 && atLake(e))
    return {
      type: "LAKE_ENCOUNTER",
      method: run.badges >= 5 ? "surf" : "fish",
    };
  if (index >= 0 && isTallGrass(e, e.x, e.y)) {
    return { type: "MOVE_ROUTE", dx: e.x === 3 ? 1 : -1, dy: 0 };
  }
  return {
    type: "MOVE_ROUTE",
    dx: Math.sign(target.x - e.x),
    dy: target.x === e.x ? Math.sign(target.y - e.y) : 0,
  };
}
