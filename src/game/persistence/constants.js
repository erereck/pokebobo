export const SAVE_KEY = "pokebobo.save.v1";
export const SAVE_BACKUP_KEY = "pokebobo.save.backup.v1";
export const GLOBAL_HALL_KEY = "pokebobo.hall.v1";
export const GLOBAL_HALL_BACKUP_KEY = "pokebobo.hall.backup.v1";
export const ACTIVE_SAVE_SLOT_KEY = "pokebobo.save.active.v1";
export const SAVE_SLOTS = 3;

export function normalizeSaveSlot(value) {
  const slot = Math.trunc(Number(value));
  return slot >= 1 && slot <= SAVE_SLOTS ? slot : 1;
}

export function saveKey(slot = 1) {
  const normalized = normalizeSaveSlot(slot);
  return normalized === 1 ? SAVE_KEY : `pokebobo.save.slot.${normalized}.v1`;
}

export function saveBackupKey(slot = 1) {
  const normalized = normalizeSaveSlot(slot);
  return normalized === 1
    ? SAVE_BACKUP_KEY
    : `pokebobo.save.backup.slot.${normalized}.v1`;
}

export const SAVE_VERSION = 4;
