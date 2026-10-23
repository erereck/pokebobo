import catalog from "../catalog.json" with { type: "json" };
import { Dex } from "@pkmn/sim";
import { ORIGINS } from "../data/origins.js";
import { VILLAGES } from "../data/villages.js";
import { GYMS } from "../data/gyms/index.js";
import { CAMPAIGN_RULES } from "../config/campaign.js";
import { EXPLORATION_RULES } from "../config/exploration.js";
import { fieldLayout } from "../world/fieldLayout.js";
import { migrateSave } from "./migrateSave.js";
import { restoreBattle } from "../battle/restore.js";
import { writeSave } from "./writeSave.js";
import { GLOBAL_DEX_KEY, GLOBAL_DEX_BACKUP_KEY } from "./dexStorage.js";
import {
  SAVE_VERSION,
  SAVE_SLOTS,
  saveKey,
  saveBackupKey,
  ACTIVE_SAVE_SLOT_KEY,
  GLOBAL_HALL_KEY,
  GLOBAL_HALL_BACKUP_KEY,
  normalizeSaveSlot,
} from "./constants.js";

export const MAX_BACKUP_BYTES = 8 * 1024 * 1024;
const phases = new Set([
  "origin",
  "starter",
  "draft",
  "ready",
  "career",
  "market",
  "exploration",
  "encounter",
  "capture",
  "event",
  "evolution-choice",
  "move-choice",
  "battle",
  "result",
  "ended",
]);
const places = new Set(
  [...ORIGINS, ...VILLAGES, ...GYMS].map((place) => place.id),
);
const integer = (n, min, max) => Number.isInteger(n) && n >= min && n <= max;
const fail = () => {
  throw Error("O backup está incompleto ou contém dados de jogo inválidos.");
};
function checkMons(mons, limit = CAMPAIGN_RULES.partySize) {
  if (!Array.isArray(mons) || mons.length > limit) fail();
  const ids = new Set();
  for (const mon of mons) {
    if (
      !mon ||
      !catalog[mon.name] ||
      typeof mon.id !== "string" ||
      !mon.id ||
      ids.has(mon.id) ||
      !integer(mon.level, 1, 100)
    )
      fail();
    ids.add(mon.id);
    if (
      !Array.isArray(mon.moves) ||
      !mon.moves.length ||
      mon.moves.length > 4 ||
      mon.moves.some(
        (id) => typeof id !== "string" || !Dex.forGen(8).moves.get(id).exists,
      )
    )
      fail();
  }
}
export function parseSaveBackup(text) {
  if (
    typeof text !== "string" ||
    new TextEncoder().encode(text).byteLength > MAX_BACKUP_BYTES
  )
    throw Error("Escolha um backup JSON de até 8 MB.");
  let value;
  try {
    value = JSON.parse(text);
  } catch {
    throw Error(
      "Não foi possível ler este JSON. Escolha um backup exportado pelo Pokébobo.",
    );
  }
  if (
    !value ||
    Array.isArray(value) ||
    !value.meta ||
    typeof value.meta !== "object" ||
    !["runs", "wins", "best"].every((key) =>
      integer(value.meta[key], 0, Number.MAX_SAFE_INTEGER),
    ) ||
    !("run" in value)
  )
    throw Error("Este arquivo não é um backup do Pokébobo.");
  if (value.version !== SAVE_VERSION)
    throw Error(
      "Este backup usa uma versão de save incompatível com o jogo atual.",
    );
  if (value.run !== null) {
    const raw = value.run;
    if (
      !raw ||
      typeof raw !== "object" ||
      Array.isArray(raw) ||
      !phases.has(raw.phase) ||
      !integer(raw.rng, 1, 0xffffffff) ||
      !integer(raw.seed, 1, 0xffffffff)
    )
      fail();
    // Conferir antes da normalização: ela limita a reserva e não deve
    // transformar um backup inválido em uma jornada com Pokémon removidos.
    checkMons(raw.party);
    checkMons(raw.box, CAMPAIGN_RULES.boxSize);
  }
  const state = migrateSave(value),
    r = state.run;
  if (!r) return state;
  if (
    !phases.has(r.phase) ||
    !integer(r.rng, 1, 0xffffffff) ||
    !integer(r.seed, 1, 0xffffffff) ||
    !Array.isArray(value.run.route) ||
    r.route.length > CAMPAIGN_RULES.cityCount ||
    r.route.some((place) => !places.has(place?.id))
  )
    fail();
  if (!["origin", "starter", "ended"].includes(r.phase) && !r.route[r.position])
    fail();
  checkMons(r.party);
  checkMons(r.box, CAMPAIGN_RULES.boxSize);
  if (
    new Set([...r.party, ...r.box].map((mon) => mon.id)).size !==
    r.party.length + r.box.length
  )
    fail();
  if (!["origin", "starter", "ended"].includes(r.phase) && !r.party.length)
    fail();
  if (r.exploration) {
    const e = r.exploration;
    if (
      !integer(e.x, 0, EXPLORATION_RULES.width - 1) ||
      !integer(e.y, 0, EXPLORATION_RULES.height - 1) ||
      !integer(e.steps, 0, EXPLORATION_RULES.maxRouteSteps) ||
      !Array.isArray(e.spots)
    )
      fail();
    if (e.layoutId !== undefined && !fieldLayout(e.layoutId)) fail();
    if (
      e.walk &&
      (!integer(e.walk.fromX, 0, EXPLORATION_RULES.width - 1) ||
        !integer(e.walk.fromY, 0, EXPLORATION_RULES.height - 1) ||
        !integer(e.walk.id, 1, EXPLORATION_RULES.maxRouteSteps))
    )
      fail();
  }
  if (r.phase === "exploration" && !r.exploration) fail();
  if (["encounter", "capture"].includes(r.phase)) {
    const index =
      r.captureAttempt?.index ??
      r.exploration?.activeIndex ??
      r.eventEncounterIndex ??
      r.encounters?.findIndex((mon) => !mon.used);
    if (
      !Array.isArray(r.encounters) ||
      !r.encounters[index] ||
      !catalog[r.encounters[index].name]
    )
      fail();
  }
  if (r.phase === "capture") {
    const attempt = r.captureAttempt;
    if (
      !attempt ||
      typeof attempt.id !== "string" ||
      typeof attempt.success !== "boolean" ||
      !r.encounters[attempt.index]
    )
      fail();
    if (attempt.success && !attempt.mon) fail();
    if (attempt.mon) checkMons([attempt.mon]);
  }
  if (r.phase === "event" && !r.weekEvent) fail();
  if (["battle", "result"].includes(r.phase)) {
    const spec = r.battle;
    if (
      !spec ||
      !Array.isArray(spec.seed) ||
      spec.seed.length !== 4 ||
      spec.seed.some((n) => !integer(n, 0, 0xffffffff)) ||
      !Array.isArray(spec.choices) ||
      spec.choices.length > 10000 ||
      spec.choices.some(
        (choice) =>
          typeof choice !== "string" ||
          !/^(?:move [1-4]|switch [1-6]|pass)$/.test(choice),
      )
    )
      fail();
    checkMons(spec.player);
    checkMons(spec.enemy);
    if (!spec.player.length || !spec.enemy.length) fail();
    let battle;
    try {
      battle = restoreBattle(spec);
      if (
        (r.phase === "battle" && battle.ended) ||
        (r.phase === "result" && (!battle.ended || !r.outcome))
      )
        fail();
    } catch {
      fail();
    } finally {
      battle?.destroy();
    }
  }
  return state;
}

// Guarda o slot anterior e tenta restaurar as chaves se a gravação falhar.
// Não escreve em outros slots nem nas preferências de apresentação.
export function restoreSaveSlot(storage, state, slot) {
  if (!integer(Number(slot), 1, SAVE_SLOTS))
    throw Error("Escolha um dos três slots para restaurar.");
  const normalized = normalizeSaveSlot(slot);
  const validated = parseSaveBackup(JSON.stringify(state));
  const keys = [
    saveKey(normalized),
    saveBackupKey(normalized),
    ACTIVE_SAVE_SLOT_KEY,
    GLOBAL_HALL_KEY,
    GLOBAL_HALL_BACKUP_KEY,
    GLOBAL_DEX_KEY,
    GLOBAL_DEX_BACKUP_KEY,
  ];
  let previous;
  try {
    previous = new Map(keys.map((key) => [key, storage.getItem(key)]));
  } catch {
    throw Error(
      "Este navegador não permite restaurar arquivos. O progresso aberto continua em memória.",
    );
  }
  try {
    const raw = previous.get(saveKey(normalized));
    if (raw) {
      let valid = false;
      try {
        parseSaveBackup(raw);
        valid = true;
      } catch {}
      if (valid) storage.setItem(saveBackupKey(normalized), raw);
    }
    writeSave(storage, validated, normalized);
    storage.setItem(ACTIVE_SAVE_SLOT_KEY, String(normalized));
  } catch (error) {
    let recovered = true;
    for (const [key, value] of previous)
      if (value === null)
        try {
          storage.removeItem(key);
        } catch {
          recovered = false;
        }
    for (const [key, value] of previous)
      if (value !== null)
        try {
          storage.setItem(key, value);
        } catch {
          recovered = false;
        }
    throw Error(
      recovered
        ? "Não foi possível restaurar o backup neste navegador. O progresso aberto não foi substituído."
        : "A restauração falhou. O progresso aberto continua em memória; exporte-o antes de fechar.",
      { cause: error },
    );
  }
  return validated;
}
