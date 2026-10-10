export const GLOBAL_DEX_KEY = "pokebobo.dex.v1";
export const GLOBAL_DEX_BACKUP_KEY = "pokebobo.dex.backup.v1";

export function mergeDex(...collections) {
  const records = new Map();
  for (const collection of collections) {
    for (const entry of Array.isArray(collection) ? collection : []) {
      if (!entry || typeof entry.species !== "string") continue;
      const key = [
        entry.slot || 1,
        entry.seed,
        entry.runNumber,
        entry.monId,
        entry.species,
      ].join(":");
      if (!records.has(key) || records.get(key).kind === "snapshot")
        records.set(key, entry);
    }
  }
  return [...records.values()];
}

export function runCollection(run, slot = 1) {
  if (!run) return [];
  const recorded = (run.collection || []).map((entry) => ({ ...entry, slot }));
  const snapshot = [...(run.party || []), ...(run.box || [])].map((mon) => ({
    species: typeof mon === "string" ? mon : mon.name,
    monId: mon.id || (typeof mon === "string" ? mon : mon.name),
    kind: "snapshot",
    shiny: mon.shiny === true,
    runNumber: run.number || run.id,
    runName: run.name,
    seed: run.seed,
    week: run.week,
    level: mon.level,
    slot,
  }));
  return mergeDex(recorded, snapshot);
}

export function stateCollection(state, slot = 1) {
  return mergeDex(
    state.meta?.dex,
    runCollection(state.run, slot),
    ...(state.meta?.history || []).map((entry) =>
      runCollection(
        {
          ...entry,
          number: entry.id,
          party: entry.team,
        },
        entry.slot || slot,
      ),
    ),
  );
}

export function readGlobalDex(storage) {
  for (const key of [GLOBAL_DEX_KEY, GLOBAL_DEX_BACKUP_KEY]) {
    try {
      const raw = storage.getItem(key);
      if (!raw) continue;
      const entries = JSON.parse(raw);
      if (Array.isArray(entries)) return mergeDex(entries);
    } catch {}
  }
  return [];
}

export function writeGlobalDex(storage, records) {
  const next = JSON.stringify(mergeDex(readGlobalDex(storage), records));
  const previous = storage.getItem(GLOBAL_DEX_KEY);
  if (previous && previous !== next)
    storage.setItem(GLOBAL_DEX_BACKUP_KEY, previous);
  storage.setItem(GLOBAL_DEX_KEY, next);
}
