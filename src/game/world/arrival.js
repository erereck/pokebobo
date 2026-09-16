import { createRoute } from "./createRoute.js";
import { note } from "../career/journal.js";
import { city } from "../selectors/city.js";

export function arrival(r) {
  r.spent = 0;
  r.prepared = false;
  r.pendingTravel = false;
  createRoute(r);
  if (r.position > 0) {
    note(
      r,
      `Chegamos a ${city(r).name}. Uma nova rota. Hora de preparar a equipe.`,
    );
  }
}
