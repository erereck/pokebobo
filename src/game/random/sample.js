import { random } from "./random.js";

export function sample(r, list, n) {
  const pool = [...list],
    out = [];
  while (out.length < n && pool.length) {
    out.push(pool.splice(Math.floor(random(r) * pool.length), 1)[0]);
  }
  return out;
}
