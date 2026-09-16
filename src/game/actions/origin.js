import { ORIGINS } from "../data/origins.js";

export function handleOrigin(s, action, state) {
  let r = s.run;
  if (
    action.type === "ORIGIN" &&
    r.phase === "origin" &&
    r.offers.includes(action.id)
  ) {
    r.route = [ORIGINS.find((x) => x.id === action.id)];
    r.phase = "starter";
    return s;
  }
  return state;
}
