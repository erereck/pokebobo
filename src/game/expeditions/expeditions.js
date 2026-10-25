import {
  EXPEDITION_RULES as RULES,
  EXPEDITION_SITES,
} from "../config/expeditions.js";
import { EXPEDITION_LAYOUTS } from "../data/expeditions.js";
import { makeMon } from "../pokemon/createPokemon.js";
import { addEquipment } from "../equipment/equipment.js";

export const expeditionSite = (id) =>
  EXPEDITION_SITES.find((site) => site.id === id);
export const activeExpedition = (r) =>
  r.expeditions?.[r.activeExpedition] || null;
export const fieldExpeditionOpen = (r) =>
  Boolean(
    r.exploration &&
      r.encounters.filter((mon) => mon.used).length ===
        (r.exploration.usedAtStart ?? 0),
  );
export const availableExpeditions = (r) =>
  !r.inLeague && r.badges <= RULES.lastBadge
    ? EXPEDITION_SITES.filter(
        (site) => r.badges >= site.badges && !r.expeditions?.[site.id],
      )
    : [];
export const guardianTeam = (site) =>
  site.team.map((mon, i) => makeMon(mon.name, mon.level, `foe${i}`));
export const nearPoint = (e, point) =>
  Math.abs(e.x - point.x) + Math.abs(e.y - point.y) <= 1;
export const expeditionFloor = (room, x, y) =>
  EXPEDITION_LAYOUTS[room]?.[y]?.[x] === ".";

export function startExpedition(r, site) {
  r.expeditions ||= {};
  r.expeditions[site.id] = {
    status: "active",
    room: 0,
    ...RULES.spawn,
    steps: 0,
    facing: "north",
    walk: null,
    collected: [],
    supply: null,
    reward: null,
  };
  r.activeExpedition = site.id;
  r.exploration = null;
  r.phase = "expedition";
}

export function moveInExpedition(e, dx, dy, animate) {
  if (
    e.status !== "active" ||
    e.walk ||
    !Number.isInteger(dx) ||
    !Number.isInteger(dy) ||
    Math.abs(dx) + Math.abs(dy) !== 1
  )
    return false;
  const x = e.x + dx,
    y = e.y + dy;
  const object = e.room < 2 ? RULES.cache : RULES.guardian;
  if (!expeditionFloor(e.room, x, y) || (x === object.x && y === object.y))
    return false;
  const fromX = e.x,
    fromY = e.y;
  e.x = x;
  e.y = y;
  e.steps++;
  e.facing = dy < 0 ? "north" : dy > 0 ? "south" : dx < 0 ? "west" : "east";
  if (animate) e.walk = { id: e.steps, fromX, fromY };
  return true;
}

export function collectExpeditionCache(r, choice) {
  const e = activeExpedition(r),
    site = expeditionSite(r.activeExpedition);
  if (
    !e ||
    e.status !== "active" ||
    e.walk ||
    e.room > 1 ||
    e.collected.includes(e.room) ||
    !nearPoint(e, RULES.cache)
  )
    return false;
  if (e.room === 0) {
    if (choice !== "cache") return false;
    r.money = (r.money || 0) + site.cacheMoney;
    r.balls += site.cacheBalls;
  } else {
    if (!["balls", "berries"].includes(choice)) return false;
    r[choice] += RULES.supplies[choice];
    e.supply = choice;
  }
  e.collected.push(e.room);
  return true;
}

export function advanceExpedition(e) {
  if (
    e.status !== "active" ||
    e.walk ||
    e.room >= 2 ||
    !e.collected.includes(e.room) ||
    !nearPoint(e, RULES.gate)
  )
    return false;
  e.room++;
  Object.assign(e, RULES.spawn, { facing: "north" });
  return true;
}

export function claimExpeditionTreasure(r, reward) {
  const e = activeExpedition(r),
    site = expeditionSite(r.activeExpedition);
  if (!e || e.status !== "won" || !site.rewards.includes(reward)) return false;
  addEquipment(r, reward);
  r.money = (r.money || 0) + site.victoryMoney;
  e.reward = reward;
  e.status = "cleared";
  return true;
}
