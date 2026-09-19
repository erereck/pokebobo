import {
  GLOBAL_HALL_BACKUP_KEY,
  GLOBAL_HALL_KEY,
  normalizeSaveSlot,
} from "./constants.js";

function read(storage, key) {
  try { return storage.getItem(key); } catch { return null; }
}

function parseHistory(raw) {
  if (!raw) return [];
  const value = JSON.parse(raw);
  if (!Array.isArray(value)) throw Error("Hall inválido");
  return value.filter((entry) => entry && typeof entry === "object");
}

function tagEntry(entry, fallbackSlot = 1) {
  return { ...entry, slot: normalizeSaveSlot(entry.slot || fallbackSlot) };
}

function keyOf(entry) {
  return [
    normalizeSaveSlot(entry.slot),
    entry.id ?? "",
    entry.seed ?? "",
    entry.week ?? "",
    entry.won ? 1 : 0,
  ].join(":");
}

export function tagHall(history, fallbackSlot = 1) {
  return (Array.isArray(history) ? history : []).map((entry) =>
    tagEntry(entry, fallbackSlot),
  );
}

export function mergeHall(...histories) {
  const seen = new Set();
  const merged = [];
  for (const history of histories) {
    for (const entry of Array.isArray(history) ? history : []) {
      const tagged = tagEntry(entry, entry.slot || 1);
      const key = keyOf(tagged);
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(tagged);
    }
  }
  return merged;
}

export function readGlobalHall(storage) {
  try {
    return tagHall(parseHistory(read(storage, GLOBAL_HALL_KEY)));
  } catch {
    try {
      return tagHall(parseHistory(read(storage, GLOBAL_HALL_BACKUP_KEY)));
    } catch {
      return [];
    }
  }
}

export function writeGlobalHall(storage, history) {
  const next = JSON.stringify(tagHall(history));
  const previous = read(storage, GLOBAL_HALL_KEY);
  if (previous && previous !== next) {
    try { storage.setItem(GLOBAL_HALL_BACKUP_KEY, previous); } catch {}
  }
  storage.setItem(GLOBAL_HALL_KEY, next);
}
