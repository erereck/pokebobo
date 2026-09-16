import { random } from "./random.js";

export function pick(r, list) {
  return list[Math.floor(random(r) * list.length)];
}
