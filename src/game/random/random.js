export function random(r) {
  let n = r.rng | 0;
  n ^= n << 13;
  n ^= n >>> 17;
  n ^= n << 5;
  r.rng = n >>> 0;
  return r.rng / 4294967296;
}
