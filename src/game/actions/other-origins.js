import { sample } from "../random/sample.js";
import { ORIGINS } from "../data/origins.js";

export function handleOtherOrigins(s, action, state) {
  let r = s.run;
  if (action.type === "OTHER_ORIGINS" && r.phase === "origin") {
    r.offers = sample(r, ORIGINS, 3).map((x) => x.id);
    return s;
  }
  return state;
}
