import { arrival } from "./arrival.js";

export function advance(r) {
  r.position++;
  arrival(r);
  r.phase = "career";
}
