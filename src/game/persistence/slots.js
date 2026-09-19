import {
  ACTIVE_SAVE_SLOT_KEY,
  SAVE_SLOTS,
  normalizeSaveSlot,
  saveKey,
} from "./constants.js";
import { migrateSave } from "./migrateSave.js";
import { readGlobalHall } from "./hallStorage.js";

function read(storage, key) {
  try { return storage.getItem(key); } catch { return null; }
}

export function loadActiveSaveSlot(storage) {
  return normalizeSaveSlot(read(storage, ACTIVE_SAVE_SLOT_KEY));
}

export function writeActiveSaveSlot(storage, slot) {
  const normalized = normalizeSaveSlot(slot);
  storage.setItem(ACTIVE_SAVE_SLOT_KEY, String(normalized));
  return normalized;
}

function latestTrainer(storage, slot, state) {
  if (state?.run?.name) return state.run.name;
  return (
    readGlobalHall(storage).find(
      (entry) => normalizeSaveSlot(entry.slot) === normalizeSaveSlot(slot),
    )?.name || ""
  );
}

export function summarizeSaveState(storage, state, slot) {
  const meta = state?.meta || {};
  const run = state?.run || null;
  const untouched =
    !run &&
    !(Number(meta.runs) || 0) &&
    !(Number(meta.wins) || 0) &&
    !(Number(meta.best) || 0);

  return {
    slot: normalizeSaveSlot(slot),
    empty: untouched,
    corrupt: false,
    trainer: latestTrainer(storage, slot, state),
    runs: Number(meta.runs) || 0,
    wins: Number(meta.wins) || 0,
    best: Number(meta.best) || 0,
    badges: Number(run?.badges) || 0,
    week: Number(run?.week) || 0,
    mode: run?.mode || "",
    phase: run?.phase || "",
    hasRun: Boolean(run),
  };
}

export function readSaveSlotSummary(storage, slot) {
  const normalized = normalizeSaveSlot(slot);
  const raw = read(storage, saveKey(normalized));
  if (!raw) return summarizeSaveState(storage, null, normalized);

  try {
    return summarizeSaveState(storage, migrateSave(JSON.parse(raw)), normalized);
  } catch {
    return {
      slot: normalized,
      empty: false,
      corrupt: true,
      trainer: latestTrainer(storage, normalized, null),
      runs: 0, wins: 0, best: 0, badges: 0, week: 0,
      mode: "", phase: "", hasRun: false,
    };
  }
}

export function allSaveSlotSummaries(storage, activeSlot, activeState) {
  return Array.from({ length: SAVE_SLOTS }, (_, index) => {
    const slot = index + 1;
    return slot === normalizeSaveSlot(activeSlot)
      ? summarizeSaveState(storage, activeState, slot)
      : readSaveSlotSummary(storage, slot);
  });
}
