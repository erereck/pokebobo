import {
  moveExplorer,
  finishExploration,
  lakeEncounter,
  completeRouteStep,
} from "../world/exploration.js";
import { note } from "../career/journal.js";

export function handleExploration(s, action, state) {
  const r = s.run;
  if (r.phase !== "exploration" || !r.exploration) return state;
  if (action.type === "MOVE_ROUTE")
    return moveExplorer(r, action.dx, action.dy, action.animate) ? s : state;
  if (action.type === "ROUTE_STEP_COMPLETE")
    return completeRouteStep(r, action.id) ? s : state;
  if (r.exploration.walk) return state;
  if (action.type === "LAKE_ENCOUNTER")
    return lakeEncounter(r, action.method) ? s : state;
  if (action.type === "EXIT_ROUTE") {
    note(
      r,
      "Você terminou a exploração. Caminhada e capturas custaram uma única semana.",
    );
    finishExploration(r);
    return s;
  }
  return state;
}
